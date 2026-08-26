import { Router, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, authenticateToken, AuthRequest } from '../lib/auth';
import { validate } from '../middleware/validation';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['client', 'freelancer', 'admin'], { errorMap: () => ({ message: 'Role must be client, freelancer, or admin' }) }),
    title: z.string().optional(),
    location: z.string().optional(),
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  })
});

export function formatProfile(profile: any) {
  if (!profile) return null;
  try {
    return {
      ...profile,
      skills: JSON.parse(profile.skills || '[]'),
      languages: JSON.parse(profile.languages || '[]'),
      education: JSON.parse(profile.education || '[]'),
      certificates: JSON.parse(profile.certificates || '[]'),
      experience: JSON.parse(profile.experience || '[]'),
      portfolio: JSON.parse(profile.portfolio || '[]'),
      socialLinks: JSON.parse(profile.socialLinks || '{}'),
      verifiedSkills: JSON.parse(profile.verifiedSkills || '[]'),
    };
  } catch (e) {
    return {
      ...profile,
      skills: [],
      languages: [],
      education: [],
      certificates: [],
      experience: [],
      portfolio: [],
      socialLinks: {},
      verifiedSkills: []
    };
  }
}

// Register
router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password, role, title, location } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`, // default avatar
        role,
        title,
        location: location || 'Global',
        isVerified: false,
        balance: 0.0,
        pendingBalance: 0.0,
        withdrawnBalance: 0.0,
        proTier: 'none',
      },
    });

    if (role === 'freelancer') {
      await prisma.freelancerProfile.create({
        data: {
          userId: user.id,
          banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
          bio: '',
          title: title || 'Freelancer',
          hourlyRate: 500,
          skills: JSON.stringify([]),
          languages: JSON.stringify(['English (Fluent)']),
          education: JSON.stringify([]),
          certificates: JSON.stringify([]),
          experience: JSON.stringify([]),
          portfolio: JSON.stringify([]),
          socialLinks: JSON.stringify({}),
          resumeUrl: '',
          availability: 'Full-time',
          rating: 5.0,
          completedJobs: 0,
          totalEarned: 0,
          responseTime: '< 1 hour',
          avgDeliveryTime: '3 Days',
          responseRate: 100,
          proposalSuccessRate: 100,
          profileViewsThisMonth: 0,
          verifiedSkills: JSON.stringify([]),
        },
      });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isOnboarded: user.isOnboarded }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login / SignIn
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { freelancerProfile: true }
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const formattedProfile = user.freelancerProfile ? formatProfile(user.freelancerProfile) : null;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      accessToken,
      refreshToken,
      user: {
        ...userWithoutPassword,
        freelancerProfile: formattedProfile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh Token
router.post('/refresh', validate(refreshSchema), async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }

  const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return res.json({
    accessToken,
    refreshToken: newRefreshToken,
  });
});

// Stub Password Reset Request
router.post('/reset-password-request', validate(resetPasswordSchema), async (req, res) => {
  const { email } = req.body;
  
  // Real logic would send an email with a reset link
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  return res.json({ message: 'Password reset link sent successfully (mocked)' });
});

// Get Current User (Me)
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { freelancerProfile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedProfile = user.freelancerProfile ? formatProfile(user.freelancerProfile) : null;
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      ...userWithoutPassword,
      freelancerProfile: formattedProfile
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const { name, company, title, location, proTier, freelancerProfile } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: {
        name,
        company,
        title,
        location,
        proTier,
        isOnboarded: true,
      },
      include: { freelancerProfile: true }
    });

    if (user.role === 'freelancer' && freelancerProfile) {
      const { banner, bio, hourlyRate, skills, languages, education, certificates, experience, portfolio, socialLinks, resumeUrl, availability } = freelancerProfile;
      
      await prisma.freelancerProfile.update({
        where: { userId: user.id },
        data: {
          banner,
          bio,
          title: title || freelancerProfile.title,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
          skills: skills ? JSON.stringify(skills) : undefined,
          languages: languages ? JSON.stringify(languages) : undefined,
          education: education ? JSON.stringify(education) : undefined,
          certificates: certificates ? JSON.stringify(certificates) : undefined,
          experience: experience ? JSON.stringify(experience) : undefined,
          portfolio: portfolio ? JSON.stringify(portfolio) : undefined,
          socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
          resumeUrl,
          availability,
        }
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user?.id },
      include: { freelancerProfile: true }
    });

    const formattedProfile = updatedUser?.freelancerProfile ? formatProfile(updatedUser.freelancerProfile) : null;
    const { password: _, ...userWithoutPassword } = updatedUser!;

    return res.json({
      ...userWithoutPassword,
      freelancerProfile: formattedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Freelancers list / specific freelancer
router.get('/freelancers', async (req, res) => {
  try {
    const freelancers = await prisma.user.findMany({
      where: { role: 'freelancer' },
      include: { freelancerProfile: true }
    });

    const formattedFreelancers = freelancers.map(f => {
      const { password: _, ...userWithoutPassword } = f;
      return {
        ...userWithoutPassword,
        freelancerProfile: f.freelancerProfile ? formatProfile(f.freelancerProfile) : null
      };
    });

    return res.json(formattedFreelancers);
  } catch (error) {
    console.error('Get freelancers error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
