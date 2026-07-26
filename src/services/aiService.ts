import { FreelancerProfile, Gig, Project, User } from '../types';

export interface AISearchResultFilter {
  keyword?: string;
  category?: string;
  maxPrice?: number;
  minRating?: number;
  skills?: string[];
  availability?: string;
}

export interface AIProposalOutput {
  coverLetter: string;
  suggestedBid: number;
  suggestedDays: number;
  keyMilestones: { title: string; percentage: number }[];
}

export interface AIGigOutput {
  description: string;
  tags: string[];
  basicTitle: string;
  basicDesc: string;
  standardTitle: string;
  standardDesc: string;
  premiumTitle: string;
  premiumDesc: string;
}

export interface AIResumeAnalysis {
  score: number;
  strengths: string[];
  missingSkills: string[];
  recommendations: string[];
}

export interface AIFraudAnalysis {
  riskScore: 'Low' | 'Medium' | 'High';
  isSafe: boolean;
  warnings: string[];
  trustSignals: string[];
}

export class AIService {
  // 1. Natural Language Smart Search Parser
  static parseNaturalLanguageSearch(query: string): AISearchResultFilter {
    const q = query.toLowerCase();
    const filter: AISearchResultFilter = {};

    // Price extraction (e.g. "under 25k", "under ₹30000", "< 15000")
    const priceMatch = q.match(/(?:under|below|<|budget|max|rs|₹|\$)\s*₹?\s*(\d+)(k)?/i);
    if (priceMatch) {
      let val = parseInt(priceMatch[1], 10);
      if (priceMatch[2] === 'k' || priceMatch[2] === 'K') val *= 1000;
      filter.maxPrice = val;
    }

    // Rating extraction (e.g. "4.8+", "5 star", "top rated")
    if (q.includes('top rated') || q.includes('5 star') || q.includes('4.8+')) {
      filter.minRating = 4.8;
    }

    // Skill extraction
    const skills = ['react', 'node', 'typescript', 'figma', 'python', 'ai', 'ui ux', 'tailwind', 'devops', 'next.js', 'video editing'];
    const matchedSkills = skills.filter(s => q.includes(s));
    if (matchedSkills.length > 0) {
      filter.skills = matchedSkills;
    }

    // Category extraction
    if (q.includes('dev') || q.includes('code') || q.includes('web') || q.includes('full stack')) {
      filter.category = 'Development';
    } else if (q.includes('design') || q.includes('figma') || q.includes('logo') || q.includes('ui')) {
      filter.category = 'Graphic Design';
    } else if (q.includes('ai') || q.includes('machine learning') || q.includes('gpt')) {
      filter.category = 'AI';
    }

    filter.keyword = query;
    return filter;
  }

  // 2. AI Proposal Generator
  static generateProposal(project: Project, freelancer: FreelancerProfile, user: User): AIProposalOutput {
    const coverLetter = `Hi ${project.clientName},

I reviewed your project "${project.title}" and would love to help you build it. 

As a ${freelancer.title} with a ${freelancer.rating}★ rating and ${freelancer.completedJobs}+ completed jobs, I specialize in ${project.skills.slice(0, 3).join(', ')}.

Here is my approach for your project:
1. Architecture & Technical Setup: Designing clean, reusable modules and schema.
2. Development Phase: Iterative builds with daily status updates.
3. Quality Assurance: Rigorous cross-browser testing and performance optimization.

I can begin immediately and deliver high-quality work within ${Math.ceil(parseInt(project.duration) || 14)} days. Let us discuss the exact deliverables on chat!

Best regards,
${user.name}`;

    const suggestedBid = Math.round(project.budget * 0.92);
    const suggestedDays = 14;

    return {
      coverLetter,
      suggestedBid,
      suggestedDays,
      keyMilestones: [
        { title: 'Phase 1: Architecture & UI Wireframes', percentage: 30 },
        { title: 'Phase 2: Core Development & APIs', percentage: 50 },
        { title: 'Phase 3: QA Testing & Handover', percentage: 20 }
      ]
    };
  }

  // 3. AI Gig Description & Package Generator
  static generateGigDetails(title: string, category: string): AIGigOutput {
    return {
      description: `Get a professional, hand-crafted solution for "${title}". Built with industry best practices, modern aesthetic design, and high performance standards.\n\nKey Highlights:\n- 100% Custom work tailored to your brand\n- Responsive and optimized across all devices\n- Fast turnaround time with clean code & assets\n- Post-delivery technical support included`,
      tags: [category, 'Professional', 'Fast Delivery', 'High Quality', 'Top Rated'],
      basicTitle: 'Starter Package',
      basicDesc: 'Essential setup and core deliverable with 2 rounds of revisions.',
      standardTitle: 'Professional Business Package',
      standardDesc: 'Complete solution including extended features, source files, and 4 revisions.',
      premiumTitle: 'Enterprise Full Stack Package',
      premiumDesc: 'End-to-end premium package with priority 24/7 support and unlimited revisions.'
    };
  }

  // 4. AI Skill & Freelancer Matcher
  static matchFreelancers(projectBrief: string, profiles: Record<string, FreelancerProfile>, users: User[]) {
    const brief = projectBrief.toLowerCase();
    
    return users
      .filter(u => u.role === 'freelancer' && profiles[u.id])
      .map(u => {
        const prof = profiles[u.id];
        let score = 70; // baseline
        
        prof.skills.forEach(skill => {
          if (brief.includes(skill.toLowerCase())) score += 10;
        });

        if (prof.rating >= 4.9) score += 5;
        if (prof.responseRate >= 98) score += 5;

        const matchPercentage = Math.min(score, 99);

        return {
          user: u,
          profile: prof,
          matchPercentage,
          reason: `High match based on skills: ${prof.skills.slice(0, 3).join(', ')} and ${prof.rating}★ rating.`
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // 5. AI Resume & Profile Analyzer
  static analyzeProfile(profile: FreelancerProfile): AIResumeAnalysis {
    let score = 55;
    const strengths: string[] = [];
    const missingSkills: string[] = [];
    const recommendations: string[] = [];

    if (profile.portfolio.length >= 2) {
      score += 20;
      strengths.push('Strong portfolio showcase with live projects.');
    } else {
      recommendations.push('Upload at least 2 portfolio projects to boost client conversion by 40%.');
    }

    if (profile.certificates.length > 0) {
      score += 10;
      strengths.push('Verified technical certifications attached.');
    } else {
      recommendations.push('Add AWS, Google, or Meta certifications to earn a Verified badge.');
    }

    if (profile.skills.length >= 6) {
      score += 15;
      strengths.push('Comprehensive skill tagging.');
    } else {
      missingSkills.push('Docker', 'GraphQL', 'CI/CD Pipelines');
      recommendations.push('Add modern DevOps and cloud skills to rank higher in searches.');
    }

    return {
      score: Math.min(score, 98),
      strengths,
      missingSkills,
      recommendations
    };
  }

  // 6. AI Fraud & Scam Detector
  static analyzeScamRisk(text: string): AIFraudAnalysis {
    const t = text.toLowerCase();
    const warnings: string[] = [];
    const trustSignals: string[] = [];

    if (t.includes('telegram') || t.includes('whatsapp') || t.includes('pay outside') || t.includes('direct bank')) {
      warnings.push('CRITICAL: Detected request for off-platform contact/payment. Earn By Way Escrow protection only applies to platform payments.');
    }

    if (t.includes('free trial') || t.includes('work for free') || t.includes('test sample first')) {
      warnings.push('WARNING: Unpaid work or free sample requested before contract setup.');
    }

    if (t.includes('escrow') || t.includes('milestone') || t.includes('verified')) {
      trustSignals.push('Protected by Earn By Way Escrow milestone policy.');
    }

    const isHighRisk = warnings.some(w => w.includes('CRITICAL'));
    const isMediumRisk = warnings.length > 0 && !isHighRisk;

    return {
      riskScore: isHighRisk ? 'High' : isMediumRisk ? 'Medium' : 'Low',
      isSafe: !isHighRisk,
      warnings,
      trustSignals: trustSignals.length > 0 ? trustSignals : ['Clean submission history detected.']
    };
  }
}
