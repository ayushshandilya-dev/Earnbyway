import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing tables
  await prisma.bookmark.deleteMany();
  await prisma.workspaceNote.deleteMany();
  await prisma.workspaceAsset.deleteMany();
  await prisma.workspaceTask.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.order.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.project.deleteMany();
  await prisma.gig.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = bcrypt.hashSync('password123', 10);

  // 1. Seed Users
  const sarah = await prisma.user.create({
    data: {
      id: 'user_client_1',
      name: 'Sarah Jenkins',
      email: 'sarah@techscale.io',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'client',
      company: 'TechScale Innovations',
      title: 'VP of Product',
      location: 'Bengaluru, India',
      isVerified: true,
      joinedDate: new Date('2024-01-01'),
      balance: 145000,
      pendingBalance: 35000,
      withdrawnBalance: 0,
      proTier: 'none'
    }
  });

  const alex = await prisma.user.create({
    data: {
      id: 'user_freelancer_1',
      name: 'Alex Vance',
      email: 'alex.vance@devhive.io',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'Full Stack & AI Systems Architect',
      location: 'Mumbai, India',
      isVerified: true,
      joinedDate: new Date('2023-11-01'),
      balance: 64200,
      pendingBalance: 24000,
      withdrawnBalance: 120000,
      proTier: 'none'
    }
  });

  const sophia = await prisma.user.create({
    data: {
      id: 'user_freelancer_2',
      name: 'Sophia Chen',
      email: 'sophia.design@studio.co',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'Senior Product UI/UX Designer',
      location: 'Singapore',
      isVerified: true,
      joinedDate: new Date('2024-03-01'),
      balance: 38900,
      pendingBalance: 15000,
      withdrawnBalance: 85000,
      proTier: 'none'
    }
  });

  const admin = await prisma.user.create({
    data: {
      id: 'user_admin_1',
      name: 'Earn By Way Moderation Team',
      email: 'admin@earnbyway.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      title: 'Platform Lead & Trust Officer',
      location: 'Global Compliance HQ',
      isVerified: true,
      joinedDate: new Date('2023-01-01'),
      balance: 890000,
      pendingBalance: 120000,
      withdrawnBalance: 4500000,
      proTier: 'none'
    }
  });

  // Seed Freelancer dummy account for Dispute resolution (DevUser99)
  const devuser = await prisma.user.create({
    data: {
      id: 'user_freelancer_dummy',
      name: 'DevUser99',
      email: 'devuser99@devhive.io',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'freelancer',
      title: 'WordPress Specialist',
      location: 'Pune, India',
      isVerified: false,
      joinedDate: new Date('2024-04-01'),
      balance: 0,
      pendingBalance: 0,
      withdrawnBalance: 0,
      proTier: 'none'
    }
  });

  // Seed Client dummy account for Dispute resolution (Enterprise Logistics Corp)
  const enterpriseClient = await prisma.user.create({
    data: {
      id: 'user_client_dummy',
      name: 'Enterprise Logistics Corp',
      email: 'logistics@enterprise.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
      role: 'client',
      company: 'Enterprise Logistics Corp',
      title: 'Procurement Specialist',
      location: 'Delhi, India',
      isVerified: true,
      joinedDate: new Date('2023-08-01'),
      balance: 500000,
      pendingBalance: 0,
      withdrawnBalance: 0,
      proTier: 'none'
    }
  });

  console.log('Users seeded.');

  // 2. Seed Freelancer Profiles
  await prisma.freelancerProfile.create({
    data: {
      userId: alex.id,
      banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      bio: 'Experienced Senior Full Stack Developer specializing in React, Next.js, Node.js microservices, Python AI integration, and scalable PostgreSQL database design. Over 6+ years delivering high-impact SaaS projects.',
      title: 'Senior Full Stack & AI Systems Engineer',
      hourlyRate: 1500,
      skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Python AI', 'REST & GraphQL']),
      languages: JSON.stringify(['English (Fluent)', 'Hindi (Native)', 'Spanish (Basic)']),
      education: JSON.stringify(['B.Tech in Computer Science - IIT Bombay (2019)']),
      certificates: JSON.stringify([
        { id: 'c1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
        { id: 'c2', name: 'Meta Senior Frontend Specialist', issuer: 'Meta', year: '2022' }
      ]),
      experience: JSON.stringify([
        { id: 'e1', company: 'CloudNexus Inc', role: 'Lead Frontend Engineer', period: '2021 - 2023', description: 'Architected micro-frontend architecture serving 2M+ active users.' },
        { id: 'e2', company: 'DevMatrix', role: 'Full Stack Developer', period: '2019 - 2021', description: 'Built real-time web socket dashboard and payment processing pipelines.' }
      ]),
      portfolio: JSON.stringify([
        {
          id: 'p1',
          title: 'SaaS Analytics Dashboard',
          description: 'Real-time financial analytics dashboard with high-throughput websocket data visualizer.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
          projectUrl: 'https://example.com/demo1',
          githubUrl: 'https://github.com/example/analytics-app',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts']
        },
        {
          id: 'p2',
          title: 'AI Contract Generator',
          description: 'Automated legal agreement drafting engine leveraging GPT-4 and PDF export engines.',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
          technologies: ['Python', 'FastAPI', 'React', 'OpenAI API']
        }
      ]),
      socialLinks: JSON.stringify({
        github: 'https://github.com/alexvance-dev',
        linkedin: 'https://linkedin.com/in/alexvance',
        website: 'https://alexvance.dev'
      }),
      resumeUrl: 'https://earnbyway.dev/resumes/alex_vance.pdf',
      availability: 'Full-time',
      rating: 4.98,
      completedJobs: 54,
      totalEarned: 485000,
      responseTime: '< 1 hour',
      avgDeliveryTime: '3.5 Days',
      responseRate: 99,
      proposalSuccessRate: 84,
      profileViewsThisMonth: 1240,
      verifiedSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Tailwind CSS'])
    }
  });

  await prisma.freelancerProfile.create({
    data: {
      userId: sophia.id,
      banner: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      bio: 'Product Designer obsessed with crafting sleek, accessible, high-converting digital experiences. Expert in Figma component libraries, UX research, interactive wireframing, and design systems.',
      title: 'Senior Product UI/UX Designer',
      hourlyRate: 1800,
      skills: JSON.stringify(['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping', 'Mobile App UX', 'User Research']),
      languages: JSON.stringify(['English (Native)', 'Mandarin (Fluent)']),
      education: JSON.stringify(['B.Des in Interaction Design - NUS (2020)']),
      certificates: JSON.stringify([
        { id: 'c3', name: 'Google UX Design Professional Certificate', issuer: 'Google', year: '2021' }
      ]),
      experience: JSON.stringify([
        { id: 'e3', company: 'DesignFlow Studio', role: 'Staff UI/UX Designer', period: '2021 - 2024', description: 'Led UI design redesign for fintech mobile apps.' }
      ]),
      portfolio: JSON.stringify([
        {
          id: 'p3',
          title: 'Crypto Wallet Mobile App Design',
          description: 'Modern sleek dark mode mobile wallet UI design with interactive prototypes.',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          technologies: ['Figma', 'Prototyping', 'Design System']
        }
      ]),
      socialLinks: JSON.stringify({
        dribbble: 'https://dribbble.com/sophiachen',
        linkedin: 'https://linkedin.com/in/sophiachen'
      }),
      resumeUrl: '',
      availability: 'Contract',
      rating: 4.95,
      completedJobs: 38,
      totalEarned: 320000,
      responseTime: '< 30 mins',
      avgDeliveryTime: '2 Days',
      responseRate: 100,
      proposalSuccessRate: 91,
      profileViewsThisMonth: 950,
      verifiedSkills: JSON.stringify(['Figma', 'UI/UX Design'])
    }
  });

  console.log('Freelancer profiles seeded.');

  // 3. Seed Gigs
  await prisma.gig.create({
    data: {
      id: 'gig_1',
      title: 'I will build a high-performance Full Stack React & Node.js Website',
      freelancerId: alex.id,
      freelancerName: alex.name,
      freelancerAvatar: alex.avatar,
      freelancerTitle: 'Full Stack Architect',
      rating: 4.98,
      reviewsCount: 42,
      category: 'Development',
      subcategory: 'Web Development',
      tags: JSON.stringify(['React', 'Node.js', 'TypeScript', 'Tailwind', 'SaaS']),
      description: 'Get a custom, ultra-fast, modern responsive web application built with React, TypeScript, Tailwind CSS, and a Node.js API backend. Includes clean code architecture, SEO metadata, and API integrations.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
      ]),
      startingPrice: 3000,
      packages: JSON.stringify({
        basic: {
          name: 'Basic',
          title: 'Single Page React Web App',
          price: 3000,
          description: 'Custom 1-page modern landing page with responsive layout and contact form.',
          deliveryDays: 3,
          revisions: 2,
          features: ['1 Page Design', 'Responsive Mobile Layout', 'Source Code Included', 'Speed Optimization']
        },
        standard: {
          name: 'Standard',
          title: 'Full Business Web App (Up to 5 Pages)',
          price: 8500,
          description: 'Complete multi-page web application with interactive components, form backend, and API routing.',
          deliveryDays: 5,
          revisions: 4,
          features: ['Up to 5 Pages', 'Responsive Mobile Layout', 'REST API Integration', 'Database Hookup', 'SEO Setup', 'Source Code']
        },
        premium: {
          name: 'Premium',
          title: 'Enterprise Full Stack SaaS Solution',
          price: 18000,
          description: 'Full stack SaaS with JWT Authentication, Payments integration, Admin Dashboard, and Cloud setup.',
          deliveryDays: 8,
          revisions: 99,
          features: ['Full Stack Application', 'JWT Auth & User Roles', 'Payment Gateway Integration', 'Admin Panel', 'Database Setup', 'Priority 24/7 Support']
        }
      }),
      faqs: JSON.stringify([
        { question: 'Will I get full source code access?', answer: 'Yes! All packages include full repository access and ownership rights.' },
        { question: 'Can you integrate payment gateways like Razorpay or Stripe?', answer: 'Absolutely. Standard and Premium packages include seamless payment setup.' }
      ]),
      requirements: JSON.stringify(['Project requirement document or wireframes', 'Logo and brand assets', 'Preferred color theme']),
      ordersCompleted: 28,
      createdAt: new Date('2024-02-15')
    }
  });

  await prisma.gig.create({
    data: {
      id: 'gig_2',
      title: 'I will design modern UI UX for Mobile Apps and Web SaaS platforms in Figma',
      freelancerId: sophia.id,
      freelancerName: sophia.name,
      freelancerAvatar: sophia.avatar,
      freelancerTitle: 'Senior Product UI/UX Designer',
      rating: 4.95,
      reviewsCount: 31,
      category: 'Graphic Design',
      subcategory: 'UI UX Design',
      tags: JSON.stringify(['Figma', 'UI UX', 'App Design', 'Web Design', 'Prototype']),
      description: 'Transform your project idea into a breathtaking Figma design system. Premium micro-interactions, responsive auto-layouts, and user-centric wireframes.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      galleryImages: JSON.stringify([
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
      ]),
      startingPrice: 2500,
      packages: JSON.stringify({
        basic: {
          name: 'Basic',
          title: '3 Screen Mobile UI Design',
          price: 2500,
          description: 'Pixel-perfect mobile UI design in Figma for 3 key app screens.',
          deliveryDays: 2,
          revisions: 2,
          features: ['3 App Screens', 'Figma Source File', 'Interactive Prototype', 'Design System Specs']
        },
        standard: {
          name: 'Standard',
          title: 'Full Web App Dashboard UI (10 Screens)',
          price: 7000,
          description: 'Complete UI/UX design for a web app dashboard with component library.',
          deliveryDays: 4,
          revisions: 5,
          features: ['10 Screens', 'Full Figma Component Library', 'Clickable Prototype', 'User Flow Diagram']
        },
        premium: {
          name: 'Premium',
          title: 'End-to-End Product Design System',
          price: 15000,
          description: 'Complete UI UX transformation for web + mobile apps including UX research and high-fidelity animations.',
          deliveryDays: 7,
          revisions: 99,
          features: ['Web + Mobile UI Systems', 'UX Competitor Audit', 'Design System Documentation', 'Developer Handoff Support']
        }
      }),
      faqs: JSON.stringify([
        { question: 'Do you provide ready-to-use Figma files?', answer: 'Yes, organized with components, auto-layout 5.0, and variable tokens.' }
      ]),
      requirements: JSON.stringify(['App concept description', 'Target user demographics', 'Competitor reference links']),
      ordersCompleted: 19,
      createdAt: new Date('2024-03-01')
    }
  });

  console.log('Gigs seeded.');

  // 4. Seed Projects
  const project1 = await prisma.project.create({
    data: {
      id: 'proj_1',
      title: 'Need React & Node.js Developer for E-Commerce Marketplace SaaS',
      clientId: sarah.id,
      clientName: sarah.name,
      clientAvatar: sarah.avatar,
      clientCompany: sarah.company,
      budget: 35000,
      category: 'Development',
      skills: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Escrow Payments']),
      description: 'We are seeking an expert developer to construct a high-throughput multi-vendor e-commerce platform. Requirements include customer accounts, vendor dashboards, secure payment hold/release logic, real-time order notifications, and responsive search filtering.',
      duration: '3-4 Weeks',
      status: 'open',
      proposalCount: 1,
      createdAt: new Date('2024-07-20')
    }
  });

  const project2 = await prisma.project.create({
    data: {
      id: 'proj_2',
      title: 'AI Resume & Portfolio Analyzer Tool UI Redesign',
      clientId: sarah.id,
      clientName: sarah.name,
      clientAvatar: sarah.avatar,
      clientCompany: sarah.company,
      budget: 20000,
      category: 'AI',
      skills: JSON.stringify(['Figma', 'UI UX', 'AI Interfaces', 'React']),
      description: 'Looking for a UI designer and frontend engineer to build an interactive AI resume parsing interface with skill gap visualization, resume scoring charts, and dark mode aesthetic.',
      duration: '2 Weeks',
      status: 'hired',
      proposalCount: 0,
      createdAt: new Date('2024-07-10')
    }
  });

  console.log('Projects seeded.');

  // 5. Seed Proposals
  await prisma.proposal.create({
    data: {
      id: 'prop_1',
      projectId: project1.id,
      freelancerId: alex.id,
      freelancerName: alex.name,
      freelancerAvatar: alex.avatar,
      freelancerRating: 4.98,
      freelancerTitle: 'Full Stack Architect',
      coverLetter: 'Hi Sarah, I reviewed your multi-vendor marketplace requirement. I have built 4 similar scalable SaaS platforms using React, PostgreSQL, and payment escrow flows. I can structure this with clean microservice APIs, state-of-the-art UI, and milestone release checkpoints.',
      bidAmount: 32000,
      estimatedDays: 20,
      status: 'pending',
      submittedAt: new Date('2024-07-21')
    }
  });

  console.log('Proposals seeded.');

  // 6. Seed Orders
  // We need three orders: order_101, order_99 (referenced by review), order_55 (referenced by dispute)
  const order101 = await prisma.order.create({
    data: {
      id: 'order_101',
      type: 'project',
      title: 'AI Resume & Portfolio Analyzer Tool UI Redesign',
      clientId: sarah.id,
      clientName: sarah.name,
      freelancerId: alex.id,
      freelancerName: alex.name,
      totalPrice: 20000,
      escrowBalance: 20000,
      status: 'in_progress',
      createdAt: new Date('2024-07-15')
    }
  });

  const order99 = await prisma.order.create({
    data: {
      id: 'order_99',
      type: 'gig',
      title: 'Build Web SaaS Application Core Backend',
      clientId: sarah.id,
      clientName: sarah.name,
      freelancerId: alex.id,
      freelancerName: alex.name,
      totalPrice: 15000,
      escrowBalance: 0,
      status: 'completed',
      createdAt: new Date('2024-06-15')
    }
  });

  const order55 = await prisma.order.create({
    data: {
      id: 'order_55',
      type: 'project',
      title: 'WordPress Plugin Integration',
      clientId: enterpriseClient.id,
      clientName: enterpriseClient.name,
      freelancerId: devuser.id,
      freelancerName: devuser.name,
      totalPrice: 8000,
      escrowBalance: 8000,
      status: 'disputed',
      createdAt: new Date('2024-07-10')
    }
  });

  console.log('Orders seeded.');

  // 7. Seed Milestones for Order 101
  await prisma.milestone.create({
    data: {
      id: 'm1',
      orderId: order101.id,
      title: 'Phase 1: Architecture & UI Wireframes',
      percentage: 30,
      amount: 6000,
      dueDate: '2024-07-22',
      status: 'released',
      deliverableNote: 'Completed initial UI component architecture and Figma wireframe layout.',
      submittedAt: '2024-07-18'
    }
  });

  await prisma.milestone.create({
    data: {
      id: 'm2',
      orderId: order101.id,
      title: 'Phase 2: React Frontend & AI API Engine',
      percentage: 50,
      amount: 10000,
      dueDate: '2024-07-28',
      status: 'submitted',
      dependsOn: JSON.stringify(['m1']),
      deliverableFile: 'https://github.com/example/resume-ai-core.zip',
      deliverableNote: 'Implemented React UI components, OpenAI resume parsing parser, and live scoring charts.',
      submittedAt: '2024-07-24'
    }
  });

  await prisma.milestone.create({
    data: {
      id: 'm3',
      orderId: order101.id,
      title: 'Phase 3: Final Testing & Production Deployment',
      percentage: 20,
      amount: 4000,
      dueDate: '2024-08-02',
      status: 'funded',
      dependsOn: JSON.stringify(['m2'])
    }
  });

  console.log('Milestones seeded.');

  // 8. Seed Conversations and Messages
  const conv1 = await prisma.conversation.create({
    data: {
      id: 'conv_1',
      participantAId: sarah.id,
      participantBId: alex.id,
      lastMessage: 'I have submitted Milestone #2 for your review with the AI resume parser code.',
      lastMessageTime: new Date()
    }
  });

  const conv2 = await prisma.conversation.create({
    data: {
      id: 'conv_2',
      participantAId: sarah.id,
      participantBId: sophia.id,
      lastMessage: 'Sure, I can deliver the updated Figma design system by tomorrow evening!',
      lastMessageTime: new Date(Date.now() - 24 * 3600 * 1000)
    }
  });

  // Seed Messages for Conversation 1
  await prisma.message.create({
    data: {
      id: 'msg_1',
      conversationId: conv1.id,
      senderId: sarah.id,
      senderName: sarah.name,
      senderAvatar: sarah.avatar,
      recipientId: alex.id,
      text: 'Hi Alex! How is progress coming along for the AI Resume Analyzer frontend?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true
    }
  });

  await prisma.message.create({
    data: {
      id: 'msg_2',
      conversationId: conv1.id,
      senderId: alex.id,
      senderName: alex.name,
      senderAvatar: alex.avatar,
      recipientId: sarah.id,
      text: 'Hello Sarah! Everything is right on track. I just finalized the skill match scoring engine and modern dark UI layout.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: true
    }
  });

  await prisma.message.create({
    data: {
      id: 'msg_3',
      conversationId: conv1.id,
      senderId: alex.id,
      senderName: alex.name,
      senderAvatar: alex.avatar,
      recipientId: sarah.id,
      text: 'I have submitted Milestone #2 for your review with the AI resume parser code.',
      attachments: JSON.stringify(['https://earnbyway.dev/files/milestone2_build.zip']),
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false
    }
  });

  console.log('Conversations and messages seeded.');

  // 9. Seed Notifications
  await prisma.notification.create({
    data: {
      id: 'n1',
      userId: sarah.id,
      type: 'order',
      title: 'Milestone Deliverable Submitted',
      message: 'Alex Vance submitted deliverables for Milestone #2: React Frontend & AI API Engine.',
      read: false,
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    }
  });

  await prisma.notification.create({
    data: {
      id: 'n2',
      userId: sarah.id,
      type: 'proposal',
      title: 'New Proposal Received',
      message: 'Alex Vance submitted a proposal for "Need React & Node.js Developer for E-Commerce".',
      read: true,
      timestamp: new Date(Date.now() - 2 * 3600 * 1000)
    }
  });

  await prisma.notification.create({
    data: {
      id: 'n3',
      userId: alex.id,
      type: 'payment',
      title: 'Escrow Milestone Released',
      message: 'Sarah Jenkins approved Milestone #1. ₹6,000 released to your available balance!',
      read: false,
      timestamp: new Date(Date.now() - 24 * 3600 * 1000)
    }
  });

  console.log('Notifications seeded.');

  // 10. Seed Reviews
  await prisma.review.create({
    data: {
      id: 'r1',
      orderId: order99.id,
      reviewerName: sarah.name,
      reviewerAvatar: sarah.avatar,
      targetId: alex.id,
      rating: 5,
      comment: 'Alex is an absolute rockstar developer! Delivered clean typescript code, comprehensive API documentation, and finished 2 days ahead of schedule.',
      pros: 'Lightning fast communication, clean code structure, proactive suggestions.',
      cons: 'None!',
      wouldHireAgain: true,
      createdAt: new Date('2024-06-28')
    }
  });

  console.log('Reviews seeded.');

  // 11. Seed Disputes
  await prisma.dispute.create({
    data: {
      id: 'disp_1',
      orderId: order55.id,
      orderTitle: order55.title,
      clientName: enterpriseClient.name,
      freelancerName: devuser.name,
      amount: order55.totalPrice,
      reason: 'Freelancer submitted non-functional code and missed deadline by 5 days.',
      status: 'open',
      createdAt: new Date('2024-07-22')
    }
  });

  console.log('Disputes seeded.');

  // 12. Seed WithdrawalRequests
  await prisma.withdrawalRequest.create({
    data: {
      id: 'w_1',
      freelancerId: alex.id,
      freelancerName: alex.name,
      amount: 15000,
      method: 'UPI',
      accountDetails: 'alexvance@okicici',
      status: 'pending',
      createdAt: new Date('2024-07-24')
    }
  });

  console.log('Withdrawals seeded.');

  // 13. Seed Workspace Tasks, Assets, Notes for order 101
  await prisma.workspaceTask.create({
    data: {
      id: 'wt_1',
      orderId: order101.id,
      title: 'Conduct Figma User Research & Interviews',
      status: 'done',
      assignedTo: 'Sophia Chen',
      createdAt: new Date('2024-07-16')
    }
  });

  await prisma.workspaceTask.create({
    data: {
      id: 'wt_2',
      orderId: order101.id,
      title: 'Draft Component Library in Figma',
      status: 'in_progress',
      assignedTo: 'Sophia Chen',
      createdAt: new Date('2024-07-17')
    }
  });

  await prisma.workspaceTask.create({
    data: {
      id: 'wt_3',
      orderId: order101.id,
      title: 'Integrate Tailwind Theme Config',
      status: 'todo',
      assignedTo: 'Alex Vance',
      createdAt: new Date('2024-07-18')
    }
  });

  await prisma.workspaceTask.create({
    data: {
      id: 'wt_4',
      orderId: order101.id,
      title: 'Set up OpenAI API Endpoint Client Routing',
      status: 'todo',
      assignedTo: 'Alex Vance',
      createdAt: new Date('2024-07-19')
    }
  });

  await prisma.workspaceAsset.create({
    data: {
      id: 'wa_1',
      orderId: order101.id,
      name: 'UI_Design_System_v1.fig',
      url: '#',
      size: '14.2 MB',
      uploadedBy: 'Sophia Chen',
      uploadedAt: new Date('2024-07-16')
    }
  });

  await prisma.workspaceAsset.create({
    data: {
      id: 'wa_2',
      orderId: order101.id,
      name: 'OpenAI_API_Integration_Specs.pdf',
      url: '#',
      size: '2.4 MB',
      uploadedBy: 'Sarah Jenkins',
      uploadedAt: new Date('2024-07-17')
    }
  });

  await prisma.workspaceNote.create({
    data: {
      orderId: order101.id,
      notes: `# Project Specifications\n- Main objective: Redesign the AI resume parsing & feedback tool with dynamic charts.\n- Target Audience: Fresh graduates & professionals.\n- Tech Stack: React, Recharts, Tailwind CSS.\n\n# Access Credentials & APIs\n- API Endpoint: https://api.techscale.io/v1/resume-parser\n- Staging URL: https://staging.techscale-ai.vercel.app`
    }
  });

  console.log('Workspace data seeded.');
  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
