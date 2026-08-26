import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../lib/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

// ─── Razorpay SDK Init ───
const Razorpay = require('razorpay');
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

const createOrderSchema = z.object({
  body: z.object({
    amount: z.number()
      .min(10, 'Minimum deposit is ₹10')
      .max(1000000, 'Maximum deposit is ₹10,00,000'),
  })
});

const verifySchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  })
});

// ─── Create Razorpay Order (Server-Side Amount Control) ───
router.post('/create-order', authenticateToken, validate(createOrderSchema), async (req: AuthRequest, res) => {
  const { amount } = req.body;
  const userId = req.user?.id!;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate unique idempotency receipt
    const receipt = `rcpt_${userId.slice(0, 8)}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Create Razorpay order (amount in paise = INR * 100)
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt,
      notes: {
        userId,
        purpose: 'wallet_topup',
      }
    });

    // Record the pending transaction in database
    await prisma.paymentTransaction.create({
      data: {
        userId,
        amount,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        status: 'pending',
        receipt,
      }
    });

    return res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      receipt,
    });
  } catch (error: any) {
    console.error('Create payment order error:', error);
    // Razorpay SDK may throw descriptive errors
    if (error?.statusCode) {
      return res.status(502).json({ error: 'Payment gateway error. Please try again later.' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Verify Razorpay Payment (HMAC-SHA256 Signature Verification) ───
router.post('/verify', authenticateToken, validate(verifySchema), async (req: AuthRequest, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const userId = req.user?.id!;

  try {
    // Lookup the pending transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify the transaction belongs to the requesting user
    if (transaction.userId !== userId) {
      return res.status(403).json({ error: 'Transaction does not belong to this user' });
    }

    // Idempotency: If already completed, return success without re-crediting
    if (transaction.status === 'completed') {
      return res.json({
        message: 'Payment already verified',
        transactionId: transaction.id,
        amount: transaction.amount,
      });
    }

    // ─── HMAC-SHA256 Signature Verification ───
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Mark transaction as failed
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' }
      });
      return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
    }

    // ─── Signature Valid → Credit Wallet ───
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: transaction.amount }
      }
    });

    // Mark transaction as completed
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        completedAt: new Date()
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'payment',
        title: 'Wallet Funded via Razorpay',
        message: `₹${transaction.amount.toLocaleString()} has been added to your wallet.`
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.json({
      message: 'Payment verified successfully',
      transactionId: transaction.id,
      amount: transaction.amount,
      balance: updatedUser.balance,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Payment Transaction History ───
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id!;

  try {
    const transactions = await prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json(transactions);
  } catch (error) {
    console.error('Get payment history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
