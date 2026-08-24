import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest, requireRole } from '../lib/auth';

const router = Router();

export function formatProject(project: any) {
  if (!project) return null;
  try {
    return {
      ...project,
      skills: JSON.parse(project.skills || '[]'),
      proposals: (project.proposals || []).map((p: any) => ({
        ...p,
        attachments: JSON.parse(p.attachments || '[]'),
      })),
    };
  } catch (e) {
    return {
      ...project,
      skills: [],
      proposals: [],
    };
  }
}

// Get All Projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { proposals: true },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(projects.map(formatProject));
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Project by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { proposals: true }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    return res.json(formatProject(project));
  } catch (error) {
    console.error('Get project by ID error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Post a Project
router.post('/', authenticateToken, requireRole(['client']), async (req: AuthRequest, res) => {
  const { title, budget, category, skills, description, duration } = req.body;

  if (!title || budget === undefined || !category || !skills || !description || !duration) {
    return res.status(400).json({ error: 'Missing required project fields' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        clientId: user.id,
        clientName: user.name,
        clientAvatar: user.avatar,
        clientCompany: user.company || '',
        budget: parseFloat(budget),
        category,
        skills: JSON.stringify(skills),
        description,
        duration,
        status: 'open',
        proposalCount: 0
      },
      include: { proposals: true }
    });

    return res.status(201).json(formatProject(project));
  } catch (error) {
    console.error('Post project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a Proposal
router.post('/:id/proposals', authenticateToken, requireRole(['freelancer']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { coverLetter, bidAmount, estimatedDays, attachments } = req.body;

  if (!coverLetter || bidAmount === undefined || estimatedDays === undefined) {
    return res.status(400).json({ error: 'Missing required proposal fields' });
  }

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ error: 'Project is no longer open for proposals' });
    }

    const freelancer = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { freelancerProfile: true }
    });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingProposal = await prisma.proposal.findFirst({
      where: {
        projectId: id,
        freelancerId: freelancer.id
      }
    });

    if (existingProposal) {
      return res.status(400).json({ error: 'You have already submitted a proposal for this project' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        projectId: id,
        freelancerId: freelancer.id,
        freelancerName: freelancer.name,
        freelancerAvatar: freelancer.avatar,
        freelancerRating: freelancer.freelancerProfile?.rating || 5.0,
        freelancerTitle: freelancer.title || 'Freelancer Architect',
        coverLetter,
        bidAmount: parseFloat(bidAmount),
        estimatedDays: parseInt(estimatedDays),
        attachments: JSON.stringify(attachments || []),
        status: 'pending'
      }
    });

    await prisma.project.update({
      where: { id },
      data: { proposalCount: { increment: 1 } }
    });

    return res.status(201).json({
      ...proposal,
      attachments: JSON.parse(proposal.attachments || '[]')
    });
  } catch (error) {
    console.error('Submit proposal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Manage Proposal (Accept/Reject/Shortlist)
router.put('/:id/proposals/:proposalId', authenticateToken, requireRole(['client']), async (req: AuthRequest, res) => {
  const { id, proposalId } = req.params;
  const { status } = req.body; // 'accepted' | 'rejected' | 'shortlisted'

  if (!status || !['accepted', 'rejected', 'shortlisted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid proposal status request' });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { proposals: true }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.clientId !== req.user?.id) {
      return res.status(403).json({ error: 'Access denied: you do not own this project' });
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId }
    });

    if (!proposal || proposal.projectId !== id) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Update proposal status
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status }
    });

    // If accepted, mark project as hired and reject other pending proposals
    if (status === 'accepted') {
      await prisma.project.update({
        where: { id },
        data: { status: 'hired' }
      });

      await prisma.proposal.updateMany({
        where: {
          projectId: id,
          id: { not: proposalId },
          status: 'pending'
        },
        data: { status: 'rejected' }
      });

      // Create Order
      const order = await prisma.order.create({
        data: {
          type: 'project',
          title: project.title,
          clientId: project.clientId,
          clientName: project.clientName,
          freelancerId: proposal.freelancerId,
          freelancerName: proposal.freelancerName,
          totalPrice: proposal.bidAmount,
          escrowBalance: proposal.bidAmount,
          status: 'funded'
        }
      });

      // Create dummy milestone for project order
      await prisma.milestone.create({
        data: {
          orderId: order.id,
          title: 'Project Deliverable',
          percentage: 100,
          amount: proposal.bidAmount,
          dueDate: new Date(Date.now() + proposal.estimatedDays * 24 * 3600 * 1000).toISOString().split('T')[0],
          status: 'funded'
        }
      });
    }

    return res.json({
      ...updatedProposal,
      attachments: JSON.parse(updatedProposal.attachments || '[]')
    });
  } catch (error) {
    console.error('Manage proposal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
