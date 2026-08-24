import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest, requireRole } from '../lib/auth';

const router = Router();

export function formatGig(gig: any) {
  if (!gig) return null;
  try {
    return {
      ...gig,
      tags: JSON.parse(gig.tags || '[]'),
      galleryImages: JSON.parse(gig.galleryImages || '[]'),
      packages: JSON.parse(gig.packages || '{}'),
      faqs: JSON.parse(gig.faqs || '[]'),
      requirements: JSON.parse(gig.requirements || '[]'),
    };
  } catch (e) {
    return {
      ...gig,
      tags: [],
      galleryImages: [],
      packages: {},
      faqs: [],
      requirements: [],
    };
  }
}

// Get All Gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(gigs.map(formatGig));
  } catch (error) {
    console.error('Get gigs error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Gig by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const gig = await prisma.gig.findUnique({
      where: { id }
    });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    return res.json(formatGig(gig));
  } catch (error) {
    console.error('Get gig by ID error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Gig
router.post('/', authenticateToken, requireRole(['freelancer']), async (req: AuthRequest, res) => {
  const { title, category, subcategory, tags, description, coverImage, galleryImages, startingPrice, packages, faqs, requirements } = req.body;

  if (!title || !category || !subcategory || !description || !coverImage || startingPrice === undefined || !packages) {
    return res.status(400).json({ error: 'Missing required gig fields' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerAvatar: user.avatar,
        freelancerTitle: user.title || 'Freelancer Specialist',
        rating: 5.0,
        reviewsCount: 0,
        category,
        subcategory,
        tags: JSON.stringify(tags || []),
        description,
        coverImage,
        galleryImages: JSON.stringify(galleryImages || []),
        startingPrice: parseFloat(startingPrice),
        packages: JSON.stringify(packages),
        faqs: JSON.stringify(faqs || []),
        requirements: JSON.stringify(requirements || []),
        ordersCompleted: 0
      }
    });

    return res.status(201).json(formatGig(gig));
  } catch (error) {
    console.error('Create gig error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Gig
router.delete('/:id', authenticateToken, requireRole(['freelancer', 'admin']), async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const gig = await prisma.gig.findUnique({ where: { id } });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (req.user?.role !== 'admin' && gig.freelancerId !== req.user?.id) {
      return res.status(403).json({ error: 'Access denied: you do not own this gig' });
    }

    await prisma.gig.delete({ where: { id } });
    return res.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.error('Delete gig error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
