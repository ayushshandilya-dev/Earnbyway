import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../lib/auth';
import { z } from 'zod';
import { validate } from '../middleware/validation';

const router = Router();

const reviewSchema = z.object({
  body: z.object({
    orderId: z.string().uuid('Invalid order ID'),
    targetId: z.string().uuid('Invalid target user ID'),
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, 'Review must be at least 5 characters'),
    pros: z.string().optional(),
    cons: z.string().optional(),
    wouldHireAgain: z.boolean().optional(),
  })
});

/**
 * Recompute the average rating for a freelancer across all their reviews,
 * then propagate the updated rating to their FreelancerProfile and all Gigs.
 */
async function recomputeRatings(targetId: string) {
  const allReviews = await prisma.review.findMany({
    where: { targetId },
    select: { rating: true }
  });

  if (allReviews.length === 0) return;

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  const roundedRating = Math.round(avgRating * 10) / 10; // 1 decimal place

  // Update FreelancerProfile rating
  await prisma.freelancerProfile.updateMany({
    where: { userId: targetId },
    data: { rating: roundedRating }
  });

  // Update all Gigs by this freelancer with the aggregated rating + review count
  await prisma.gig.updateMany({
    where: { freelancerId: targetId },
    data: {
      rating: roundedRating,
      reviewsCount: allReviews.length
    }
  });
}

// Submit a Review for a Completed Order
router.post('/', authenticateToken, validate(reviewSchema), async (req: AuthRequest, res) => {
  const { orderId, targetId, rating, comment, pros, cons, wouldHireAgain } = req.body;
  const reviewerId = req.user?.id!;

  try {
    // Verify order exists and is completed
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Reviews can only be submitted for completed orders' });
    }

    // Verify reviewer is a participant in the order
    if (order.clientId !== reviewerId && order.freelancerId !== reviewerId) {
      return res.status(403).json({ error: 'You are not a participant in this order' });
    }

    // Verify target is the other participant
    if (targetId !== order.clientId && targetId !== order.freelancerId) {
      return res.status(400).json({ error: 'Target must be a participant of this order' });
    }
    if (targetId === reviewerId) {
      return res.status(400).json({ error: 'You cannot review yourself' });
    }

    // Check for duplicate review (enforced by @@unique but catch gracefully)
    const existing = await prisma.review.findUnique({
      where: { orderId_reviewerId: { orderId, reviewerId } }
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this order' });
    }

    const reviewer = await prisma.user.findUnique({ where: { id: reviewerId } });

    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId,
        reviewerName: reviewer?.name || 'Anonymous',
        reviewerAvatar: reviewer?.avatar || '',
        targetId,
        rating,
        comment,
        pros: pros || null,
        cons: cons || null,
        wouldHireAgain: wouldHireAgain ?? true,
      }
    });

    // Recompute ratings for the target freelancer
    await recomputeRatings(targetId);

    // Send notification to the reviewed user
    await prisma.notification.create({
      data: {
        userId: targetId,
        type: 'review',
        title: 'New Review Received',
        message: `${reviewer?.name || 'A user'} left you a ${rating}★ review.`
      }
    });

    return res.status(201).json(review);
  } catch (error) {
    console.error('Submit review error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Reviews for a Target User (Freelancer)
router.get('/:targetId', async (req, res) => {
  const { targetId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { targetId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
