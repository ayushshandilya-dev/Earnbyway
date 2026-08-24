import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../lib/auth';

const router = Router();

export function formatOrder(order: any) {
  if (!order) return null;
  return {
    ...order,
    milestones: (order.milestones || []).map((m: any) => ({
      ...m,
      dependsOn: JSON.parse(m.dependsOn || '[]'),
    })),
    workspaceTasks: order.workspaceTasks || [],
    workspaceAssets: order.workspaceAssets || [],
    workspaceNotes: order.workspaceNotes?.notes || '',
  };
}

// Get User Orders
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    let orders;
    if (role === 'admin') {
      orders = await prisma.order.findMany({
        include: { milestones: true }
      });
    } else if (role === 'client') {
      orders = await prisma.order.findMany({
        where: { clientId: userId },
        include: { milestones: true }
      });
    } else {
      orders = await prisma.order.findMany({
        where: { freelancerId: userId },
        include: { milestones: true }
      });
    }

    return res.json(orders.map(formatOrder));
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Order by ID (Includes Workspace task/assets/notes)
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        milestones: true,
        workspaceTasks: true,
        workspaceAssets: true,
        workspaceNotes: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify access
    if (role !== 'admin' && order.clientId !== userId && order.freelancerId !== userId) {
      return res.status(403).json({ error: 'Access denied: you are not a participant in this order' });
    }

    return res.json(formatOrder(order));
  } catch (error) {
    console.error('Get order by ID error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Order from Gig package
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { gigId, packageKey } = req.body; // packageKey: 'basic' | 'standard' | 'premium'

  if (!gigId || !packageKey || !['basic', 'standard', 'premium'].includes(packageKey)) {
    return res.status(400).json({ error: 'Gig ID and valid package key are required' });
  }

  try {
    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const packages = JSON.parse(gig.packages || '{}');
    const selectedPackage = packages[packageKey];

    if (!selectedPackage) {
      return res.status(400).json({ error: 'Selected package is not configured on this gig' });
    }

    // Client verification
    const client = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (!client) {
      return res.status(404).json({ error: 'Client account not found' });
    }

    if (client.balance < selectedPackage.price) {
      return res.status(400).json({ error: 'Insufficient balance to purchase this package' });
    }

    // Deduct client balance and hold in Escrow
    await prisma.user.update({
      where: { id: client.id },
      data: {
        balance: { decrement: selectedPackage.price },
        pendingBalance: { increment: selectedPackage.price }
      }
    });

    // Create Order
    const order = await prisma.order.create({
      data: {
        type: 'gig',
        title: `${gig.title} (${selectedPackage.name})`,
        clientId: client.id,
        clientName: client.name,
        freelancerId: gig.freelancerId,
        freelancerName: gig.freelancerName,
        totalPrice: selectedPackage.price,
        escrowBalance: selectedPackage.price,
        status: 'funded'
      }
    });

    // Create single Milestone representing this package order
    await prisma.milestone.create({
      data: {
        orderId: order.id,
        title: selectedPackage.title,
        percentage: 100.0,
        amount: selectedPackage.price,
        dueDate: new Date(Date.now() + selectedPackage.deliveryDays * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'funded',
        dependsOn: JSON.stringify([])
      }
    });

    // Initialize blank notes
    await prisma.workspaceNote.create({
      data: {
        orderId: order.id,
        notes: `# Workspace Collaboration notes\n\nWrite project directives or specifications here.`
      }
    });

    const finalizedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { milestones: true, workspaceTasks: true, workspaceAssets: true, workspaceNotes: true }
    });

    return res.status(201).json(formatOrder(finalizedOrder));
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit deliverable note/file for Milestone
router.put('/:id/milestones/:milestoneId/submit', authenticateToken, async (req: AuthRequest, res) => {
  const { id, milestoneId } = req.params;
  const { note, file } = req.body;

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.freelancerId !== req.user?.id) {
      return res.status(403).json({ error: 'Access denied: only the assigned freelancer can submit milestones' });
    }

    const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
    if (!milestone || milestone.orderId !== id) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'submitted',
        deliverableNote: note,
        deliverableFile: file || '',
        submittedAt: new Date().toISOString()
      }
    });

    await prisma.order.update({
      where: { id },
      data: { status: 'under_review' }
    });

    return res.json(updatedMilestone);
  } catch (error) {
    console.error('Submit milestone error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve Milestone and Release Funds
router.put('/:id/milestones/:milestoneId/release', authenticateToken, async (req: AuthRequest, res) => {
  const { id, milestoneId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { milestones: true }
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.clientId !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: only the client or admin can release escrow funds' });
    }

    const milestone = await prisma.milestone.findUnique({ where: { id: milestoneId } });
    if (!milestone || milestone.orderId !== id) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    if (milestone.status === 'released') {
      return res.status(400).json({ error: 'Milestone funds already released' });
    }

    // Update milestone status
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status: 'released' }
    });

    // Debit Escrow balance and Credit Freelancer earnings (with 10% platform fee deducted)
    const platformFee = milestone.amount * 0.10;
    const netEarnings = milestone.amount - platformFee;

    await prisma.order.update({
      where: { id },
      data: {
        escrowBalance: { decrement: milestone.amount }
      }
    });

    // Credit freelancer balance with net earnings (minus 10% fee)
    await prisma.user.update({
      where: { id: order.freelancerId },
      data: {
        balance: { increment: netEarnings }
      }
    });

    // Debit client pending balance
    await prisma.user.update({
      where: { id: order.clientId },
      data: {
        pendingBalance: { decrement: milestone.amount }
      }
    });

    // Fetch updated order to check if all milestones are released
    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      include: { milestones: true }
    });

    const allReleased = updatedOrder?.milestones.every(m => m.status === 'released');
    if (allReleased) {
      await prisma.order.update({
        where: { id },
        data: { status: 'completed' }
      });
      // Increment ordersCompleted for the freelancer profile and add net earnings
      await prisma.freelancerProfile.update({
        where: { userId: order.freelancerId },
        data: {
          completedJobs: { increment: 1 },
          totalEarned: { increment: order.totalPrice * 0.90 } // apply 10% platform fee deduction to total order price
        }
      });
    } else {
      await prisma.order.update({
        where: { id },
        data: { status: 'in_progress' }
      });
    }

    const finalOrder = await prisma.order.findUnique({
      where: { id },
      include: { milestones: true, workspaceTasks: true, workspaceAssets: true, workspaceNotes: true }
    });

    return res.json(formatOrder(finalOrder));
  } catch (error) {
    console.error('Release milestone error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Workspace Task Add
router.post('/:id/tasks', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, assignedTo } = req.body;

  try {
    const task = await prisma.workspaceTask.create({
      data: {
        orderId: id,
        title,
        status: 'todo',
        assignedTo: assignedTo || ''
      }
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error('Add task error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Workspace Task Update
router.put('/:id/tasks/:taskId', authenticateToken, async (req: AuthRequest, res) => {
  const { taskId } = req.params;
  const { status, assignedTo } = req.body;

  try {
    const task = await prisma.workspaceTask.update({
      where: { id: taskId },
      data: { status, assignedTo }
    });
    return res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Workspace Assets Add
router.post('/:id/assets', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, url, size } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    const asset = await prisma.workspaceAsset.create({
      data: {
        orderId: id,
        name,
        url,
        size: size || 'Unknown',
        uploadedBy: user?.name || 'User'
      }
    });
    return res.status(201).json(asset);
  } catch (error) {
    console.error('Add asset error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Workspace Notes Update
router.put('/:id/notes', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    const note = await prisma.workspaceNote.upsert({
      where: { orderId: id },
      update: { notes },
      create: { orderId: id, notes }
    });
    return res.json(note);
  } catch (error) {
    console.error('Update notes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
