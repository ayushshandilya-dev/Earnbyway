export type UserRole = 'client' | 'freelancer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  company?: string;
  title?: string;
  location: string;
  isVerified: boolean;
  joinedDate: string;
  balance: number;
  pendingBalance: number;
  withdrawnBalance: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface FreelancerProfile {
  userId: string;
  banner: string;
  bio: string;
  title: string;
  hourlyRate: number;
  skills: string[];
  languages: string[];
  education: string[];
  certificates: Certification[];
  experience: ExperienceItem[];
  portfolio: PortfolioItem[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    dribbble?: string;
    website?: string;
  };
  resumeUrl?: string;
  availability: 'Full-time' | 'Part-time' | 'Contract';
  rating: number;
  completedJobs: number;
  totalEarned: number;
  responseTime: string;
  avgDeliveryTime: string;
  responseRate: number;
  proposalSuccessRate: number;
  profileViewsThisMonth: number;
}

export interface Package {
  name: 'Basic' | 'Standard' | 'Premium';
  title: string;
  price: number;
  description: string;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Gig {
  id: string;
  title: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerTitle: string;
  rating: number;
  reviewsCount: number;
  category: string;
  subcategory: string;
  tags: string[];
  description: string;
  coverImage: string;
  galleryImages: string[];
  startingPrice: number;
  packages: {
    basic: Package;
    standard: Package;
    premium: Package;
  };
  faqs: FAQ[];
  requirements: string[];
  ordersCompleted: number;
  createdAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerRating: number;
  freelancerTitle: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
  attachments?: string[];
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientCompany?: string;
  budget: number;
  category: string;
  skills: string[];
  description: string;
  duration: string;
  status: 'open' | 'hired' | 'completed' | 'cancelled';
  proposalCount: number;
  proposals: Proposal[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'funded' | 'submitted' | 'approved' | 'released';
  deliverableFile?: string;
  deliverableNote?: string;
  submittedAt?: string;
}

export interface Order {
  id: string;
  type: 'gig' | 'project';
  title: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  totalPrice: number;
  escrowBalance: number;
  status: 'funded' | 'in_progress' | 'under_review' | 'completed' | 'disputed';
  milestones: Milestone[];
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  attachments?: string[];
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'proposal' | 'payment' | 'order' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Review {
  id: string;
  orderId: string;
  reviewerName: string;
  reviewerAvatar: string;
  targetId: string;
  rating: number;
  comment: string;
  pros?: string;
  cons?: string;
  wouldHireAgain: boolean;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderTitle: string;
  clientName: string;
  freelancerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'resolved';
  resolution?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer' | 'Razorpay' | 'PayPal';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
