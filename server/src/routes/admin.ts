import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, requireRole, AuthRequest } from '../lib/auth';

const router = Router();

// Apply Admin Role Check to all admin routes
router.use(authenticateToken, requireRole(['admin']));

// Get All Withdrawal Requests (Pending, Approved, Rejected)
router.get('/withdrawals', async (req: AuthRequest, res) => {
  try {
    const withdrawals = await prisma.withdrawalRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(withdrawals);
  } catch (error) {
    console.error('Get admin withdrawals list error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve Withdrawal
router.put('/withdrawals/:id/approve', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const request = await prisma.withdrawalRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal request is already resolved' });
    }

    // Update request status
    await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: 'approved' }
    });

    // Debit pending balance, credit total withdrawn balance
    await prisma.user.update({
      where: { id: request.freelancerId },
      data: {
        pendingBalance: { decrement: request.amount },
        withdrawnBalance: { increment: request.amount }
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: request.freelancerId,
        type: 'payment',
        title: 'Withdrawal Approved',
        message: `Your withdrawal of ₹${request.amount.toLocaleString()} via ${request.method} has been approved and paid out.`
      }
    });

    return res.json({ message: 'Withdrawal approved successfully' });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject Withdrawal
router.put('/withdrawals/:id/reject', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const request = await prisma.withdrawalRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal request is already resolved' });
    }

    // Update request status
    await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: 'rejected' }
    });

    // Debit pending balance, return back to available balance
    await prisma.user.update({
      where: { id: request.freelancerId },
      data: {
        pendingBalance: { decrement: request.amount },
        balance: { increment: request.amount }
      }
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: request.freelancerId,
        type: 'payment',
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of ₹${request.amount.toLocaleString()} was rejected. Funds returned to wallet.`
      }
    });

    return res.json({ message: 'Withdrawal rejected successfully' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle User Verification Status (Moderate verify)
router.put('/users/:id/verify', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isVerified: !user.isVerified }
    });

    // Notify user of verification status change
    await prisma.notification.create({
      data: {
        userId: id,
        type: 'system',
        title: updated.isVerified ? 'Profile Verified!' : 'Verification Suspended',
        message: updated.isVerified
          ? 'Your WorkHive verification has been approved. You now hold a verified check badge!'
          : 'Your account verification has been suspended by administration.'
      }
    });

    return res.json({
      message: `User verification toggled successfully`,
      isVerified: updated.isVerified
    });
  } catch (error) {
    console.error('Toggle user verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
