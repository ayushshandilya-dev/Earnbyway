import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../lib/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const depositSchema = z.object({
  body: z.object({
    amount: z.number().positive('Deposit amount must be positive'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
  })
});

const withdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive('Withdrawal amount must be positive'),
    method: z.enum(['UPI', 'Bank Transfer', 'Razorpay', 'PayPal'], {
      errorMap: () => ({ message: 'Method must be UPI, Bank Transfer, Razorpay, or PayPal' })
    }),
    accountDetails: z.string().min(3, 'Account details are required'),
  })
});

// Deposit Funds (Add Funds to Client Wallet)
router.post('/deposit', authenticateToken, validate(depositSchema), async (req: AuthRequest, res) => {
  const { amount, paymentMethod } = req.body;
  const userId = req.user?.id!;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    // Credit client available balance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount }
      }
    });

    // Create system notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'payment',
        title: 'Wallet Funded Successfully',
        message: `₹${amount.toLocaleString()} has been added to your available balance via ${paymentMethod}.`
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.json({
      message: 'Deposit successful',
      balance: updatedUser.balance,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Request Withdrawal (Freelancer)
router.post('/withdraw', authenticateToken, validate(withdrawSchema), async (req: AuthRequest, res) => {
  const { amount, method, accountDetails } = req.body;
  const userId = req.user?.id!;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient available balance' });
    }

    // Deduct available balance, hold in pending
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: amount },
        pendingBalance: { increment: amount }
      }
    });

    // Create withdrawal request record
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        freelancerId: userId,
        freelancerName: user.name,
        amount,
        method,
        accountDetails,
        status: 'pending'
      }
    });

    // Create system notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'payment',
        title: 'Withdrawal Requested',
        message: `Your request to withdraw ₹${amount.toLocaleString()} via ${method} is pending approval.`
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(201).json({
      message: 'Withdrawal requested successfully',
      withdrawal,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get User's Withdrawals History
router.get('/withdrawals', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id!;

  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { freelancerId: userId },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(withdrawals);
  } catch (error) {
    console.error('Get withdrawals history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
