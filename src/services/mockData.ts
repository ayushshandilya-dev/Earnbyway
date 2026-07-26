import { 
  User, 
  FreelancerProfile, 
  Gig, 
  Project, 
  Order, 
  Conversation, 
  Message, 
  NotificationItem, 
  Review, 
  Dispute, 
  WithdrawalRequest 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_client_1',
    name: 'Sarah Jenkins',
    email: 'sarah@techscale.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'client',
    company: 'TechScale Innovations',
    title: 'VP of Product',
    location: 'Bengaluru, India',
    isVerified: true,
    joinedDate: 'Jan 2024',
    balance: 145000,
    pendingBalance: 35000,
    withdrawnBalance: 0
  },
  {
    id: 'user_freelancer_1',
    name: 'Alex Vance',
    email: 'alex.vance@devhive.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'freelancer',
    title: 'Full Stack & AI Systems Architect',
    location: 'Mumbai, India',
    isVerified: true,
    joinedDate: 'Nov 2023',
    balance: 64200,
    pendingBalance: 24000,
    withdrawnBalance: 120000
  },
  {
    id: 'user_freelancer_2',
    name: 'Sophia Chen',
    email: 'sophia.design@studio.co',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'freelancer',
    title: 'Senior Product UI/UX Designer',
    location: 'Singapore',
    isVerified: true,
    joinedDate: 'Mar 2024',
    balance: 38900,
    pendingBalance: 15000,
    withdrawnBalance: 85000
  },
  {
    id: 'user_admin_1',
    name: 'Earn By Way Moderation Team',
    email: 'admin@earnbyway.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    title: 'Platform Lead & Trust Officer',
    location: 'Global Compliance HQ',
    isVerified: true,
    joinedDate: 'Jan 2023',
    balance: 890000,
    pendingBalance: 120000,
    withdrawnBalance: 4500000
  }
];

export const MOCK_FREELANCER_PROFILES: Record<string, FreelancerProfile> = {
  user_freelancer_1: {
    userId: 'user_freelancer_1',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    bio: 'Experienced Senior Full Stack Developer specializing in React, Next.js, Node.js microservices, Python AI integration, and scalable PostgreSQL database design. Over 6+ years delivering high-impact SaaS projects.',
    title: 'Senior Full Stack & AI Systems Engineer',
    hourlyRate: 1500,
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'Python AI', 'REST & GraphQL'],
    languages: ['English (Fluent)', 'Hindi (Native)', 'Spanish (Basic)'],
    education: ['B.Tech in Computer Science - IIT Bombay (2019)'],
    certificates: [
      { id: 'c1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
      { id: 'c2', name: 'Meta Senior Frontend Specialist', issuer: 'Meta', year: '2022' }
    ],
    experience: [
      { id: 'e1', company: 'CloudNexus Inc', role: 'Lead Frontend Engineer', period: '2021 - 2023', description: 'Architected micro-frontend architecture serving 2M+ active users.' },
      { id: 'e2', company: 'DevMatrix', role: 'Full Stack Developer', period: '2019 - 2021', description: 'Built real-time web socket dashboard and payment processing pipelines.' }
    ],
    portfolio: [
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
    ],
    socialLinks: {
      github: 'https://github.com/alexvance-dev',
      linkedin: 'https://linkedin.com/in/alexvance',
      website: 'https://alexvance.dev'
    },
    resumeUrl: 'https://earnbyway.dev/resumes/alex_vance.pdf',
    availability: 'Full-time',
    rating: 4.98,
    completedJobs: 54,
    totalEarned: 485000,
    responseTime: '< 1 hour',
    avgDeliveryTime: '3.5 Days',
    responseRate: 99,
    proposalSuccessRate: 84,
    profileViewsThisMonth: 1240
  },
  user_freelancer_2: {
    userId: 'user_freelancer_2',
    banner: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    bio: 'Product Designer obsessed with crafting sleek, accessible, high-converting digital experiences. Expert in Figma component libraries, UX research, interactive wireframing, and design systems.',
    title: 'Senior Product UI/UX Designer',
    hourlyRate: 1800,
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping', 'Mobile App UX', 'User Research'],
    languages: ['English (Native)', 'Mandarin (Fluent)'],
    education: ['B.Des in Interaction Design - NUS (2020)'],
    certificates: [
      { id: 'c3', name: 'Google UX Design Professional Certificate', issuer: 'Google', year: '2021' }
    ],
    experience: [
      { id: 'e3', company: 'DesignFlow Studio', role: 'Staff UI/UX Designer', period: '2021 - 2024', description: 'Led UI design redesign for fintech mobile apps.' }
    ],
    portfolio: [
      {
        id: 'p3',
        title: 'Crypto Wallet Mobile App Design',
        description: 'Modern sleek dark mode mobile wallet UI design with animated interactive prototypes.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        technologies: ['Figma', 'Prototyping', 'Design System']
      }
    ],
    socialLinks: {
      dribbble: 'https://dribbble.com/sophiachen',
      linkedin: 'https://linkedin.com/in/sophiachen'
    },
    availability: 'Contract',
    rating: 4.95,
    completedJobs: 38,
    totalEarned: 320000,
    responseTime: '< 30 mins',
    avgDeliveryTime: '2 Days',
    responseRate: 100,
    proposalSuccessRate: 91,
    profileViewsThisMonth: 950
  }
};

export const INITIAL_GIGS: Gig[] = [
  {
    id: 'gig_1',
    title: 'I will build a high-performance Full Stack React & Node.js Website',
    freelancerId: 'user_freelancer_1',
    freelancerName: 'Alex Vance',
    freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    freelancerTitle: 'Full Stack & AI Architect',
    rating: 4.98,
    reviewsCount: 42,
    category: 'Development',
    subcategory: 'Web Development',
    tags: ['React', 'Node.js', 'TypeScript', 'Tailwind', 'SaaS'],
    description: 'Get a custom, ultra-fast, modern responsive web application built with React, TypeScript, Tailwind CSS, and a Node.js API backend. Includes clean code architecture, SEO metadata, and API integrations.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    startingPrice: 3000,
    packages: {
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
    },
    faqs: [
      { question: 'Will I get full source code access?', answer: 'Yes! All packages include full repository access and ownership rights.' },
      { question: 'Can you integrate payment gateways like Razorpay or Stripe?', answer: 'Absolutely. Standard and Premium packages include seamless payment setup.' }
    ],
    requirements: ['Project requirement document or wireframes', 'Logo and brand assets', 'Preferred color theme'],
    ordersCompleted: 28,
    createdAt: '2024-02-15'
  },
  {
    id: 'gig_2',
    title: 'I will design modern UI UX for Mobile Apps and Web SaaS platforms in Figma',
    freelancerId: 'user_freelancer_2',
    freelancerName: 'Sophia Chen',
    freelancerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    freelancerTitle: 'Senior Product UI/UX Designer',
    rating: 4.95,
    reviewsCount: 31,
    category: 'Graphic Design',
    subcategory: 'UI UX Design',
    tags: ['Figma', 'UI UX', 'App Design', 'Web Design', 'Prototype'],
    description: 'Transform your project idea into a breathtaking Figma design system. Premium micro-interactions, responsive auto-layouts, and user-centric wireframes.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
    ],
    startingPrice: 2500,
    packages: {
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
    },
    faqs: [
      { question: 'Do you provide ready-to-use Figma files?', answer: 'Yes, organized with components, auto-layout 5.0, and variable tokens.' }
    ],
    requirements: ['App concept description', 'Target user demographics', 'Competitor reference links'],
    ordersCompleted: 19,
    createdAt: '2024-03-01'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'Need React & Node.js Developer for E-Commerce Marketplace SaaS',
    clientId: 'user_client_1',
    clientName: 'Sarah Jenkins',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    clientCompany: 'TechScale Innovations',
    budget: 35000,
    category: 'Development',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Escrow Payments'],
    description: 'We are seeking an expert developer to construct a high-throughput multi-vendor e-commerce platform. Requirements include customer accounts, vendor dashboards, secure payment hold/release logic, real-time order notifications, and responsive search filtering.',
    duration: '3-4 Weeks',
    status: 'open',
    proposalCount: 2,
    createdAt: '2024-07-20',
    proposals: [
      {
        id: 'prop_1',
        projectId: 'proj_1',
        freelancerId: 'user_freelancer_1',
        freelancerName: 'Alex Vance',
        freelancerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        freelancerRating: 4.98,
        freelancerTitle: 'Full Stack Architect',
        coverLetter: 'Hi Sarah, I reviewed your multi-vendor marketplace requirement. I have built 4 similar scalable SaaS platforms using React, PostgreSQL, and payment escrow flows. I can structure this with clean microservice APIs, state-of-the-art UI, and milestone release checkpoints.',
        bidAmount: 32000,
        estimatedDays: 20,
        status: 'pending',
        submittedAt: '2024-07-21'
      }
    ]
  },
  {
    id: 'proj_2',
    title: 'AI Resume & Portfolio Analyzer Tool UI Redesign',
    clientId: 'user_client_1',
    clientName: 'Sarah Jenkins',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    clientCompany: 'TechScale Innovations',
    budget: 20000,
    category: 'AI',
    skills: ['Figma', 'UI UX', 'AI Interfaces', 'React'],
    description: 'Looking for a UI designer and frontend engineer to build an interactive AI resume parsing interface with skill gap visualization, resume scoring charts, and dark mode aesthetic.',
    duration: '2 Weeks',
    status: 'hired',
    proposalCount: 4,
    createdAt: '2024-07-10',
    proposals: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order_101',
    type: 'project',
    title: 'AI Resume & Portfolio Analyzer Tool UI Redesign',
    clientId: 'user_client_1',
    clientName: 'Sarah Jenkins',
    freelancerId: 'user_freelancer_1',
    freelancerName: 'Alex Vance',
    totalPrice: 20000,
    escrowBalance: 20000,
    status: 'in_progress',
    createdAt: '2024-07-15',
    milestones: [
      {
        id: 'm1',
        title: 'Phase 1: Architecture & UI Wireframes',
        percentage: 30,
        amount: 6000,
        dueDate: '2024-07-22',
        status: 'released',
        deliverableNote: 'Completed initial UI component architecture and Figma wireframe layout.',
        submittedAt: '2024-07-18'
      },
      {
        id: 'm2',
        title: 'Phase 2: React Frontend & AI API Engine',
        percentage: 50,
        amount: 10000,
        dueDate: '2024-07-28',
        status: 'submitted',
        deliverableFile: 'https://github.com/example/resume-ai-core.zip',
        deliverableNote: 'Implemented React UI components, OpenAI resume parsing parser, and live scoring charts.',
        submittedAt: '2024-07-24'
      },
      {
        id: 'm3',
        title: 'Phase 3: Final Testing & Production Deployment',
        percentage: 20,
        amount: 4000,
        dueDate: '2024-08-02',
        status: 'funded'
      }
    ]
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participant: {
      id: 'user_freelancer_1',
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'freelancer',
      isOnline: true
    },
    lastMessage: 'I have submitted Milestone #2 for your review with the AI resume parser code.',
    lastMessageTime: '10:42 AM',
    unreadCount: 1
  },
  {
    id: 'conv_2',
    participant: {
      id: 'user_freelancer_2',
      name: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      role: 'freelancer',
      isOnline: false
    },
    lastMessage: 'Sure, I can deliver the updated Figma design system by tomorrow evening!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'user_client_1',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      recipientId: 'user_freelancer_1',
      text: 'Hi Alex! How is progress coming along for the AI Resume Analyzer frontend?',
      timestamp: '10:15 AM',
      isRead: true
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'user_freelancer_1',
      senderName: 'Alex Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      recipientId: 'user_client_1',
      text: 'Hello Sarah! Everything is right on track. I just finalized the skill match scoring engine and modern dark UI layout.',
      timestamp: '10:28 AM',
      isRead: true
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'user_freelancer_1',
      senderName: 'Alex Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      recipientId: 'user_client_1',
      text: 'I have submitted Milestone #2 for your review with the AI resume parser code.',
      attachments: ['https://earnbyway.dev/files/milestone2_build.zip'],
      timestamp: '10:42 AM',
      isRead: false
    }
  ]
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    userId: 'user_client_1',
    type: 'order',
    title: 'Milestone Deliverable Submitted',
    message: 'Alex Vance submitted deliverables for Milestone #2: React Frontend & AI API Engine.',
    read: false,
    timestamp: '10 mins ago'
  },
  {
    id: 'n2',
    userId: 'user_client_1',
    type: 'proposal',
    title: 'New Proposal Received',
    message: 'Alex Vance submitted a proposal for "Need React & Node.js Developer for E-Commerce".',
    read: true,
    timestamp: '2 hours ago'
  },
  {
    id: 'n3',
    userId: 'user_freelancer_1',
    type: 'payment',
    title: 'Escrow Milestone Released',
    message: 'Sarah Jenkins approved Milestone #1. ₹6,000 released to your available balance!',
    read: false,
    timestamp: '1 day ago'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    orderId: 'order_99',
    reviewerName: 'Sarah Jenkins',
    reviewerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    targetId: 'user_freelancer_1',
    rating: 5,
    comment: 'Alex is an absolute rockstar developer! Delivered clean typescript code, comprehensive API documentation, and finished 2 days ahead of schedule.',
    pros: 'Lightning fast communication, clean code structure, proactive suggestions.',
    cons: 'None!',
    wouldHireAgain: true,
    createdAt: '2024-06-28'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    orderId: 'order_55',
    orderTitle: 'WordPress Plugin Integration',
    clientName: 'Enterprise Logistics Corp',
    freelancerName: 'DevUser99',
    amount: 8000,
    reason: 'Freelancer submitted non-functional code and missed deadline by 5 days.',
    status: 'open',
    createdAt: '2024-07-22'
  }
];

export const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'w_1',
    freelancerId: 'user_freelancer_1',
    freelancerName: 'Alex Vance',
    amount: 15000,
    method: 'UPI',
    accountDetails: 'alexvance@okicici',
    status: 'pending',
    createdAt: '2024-07-24'
  }
];
