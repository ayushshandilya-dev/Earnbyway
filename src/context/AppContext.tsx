import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestNotificationPermission, sendBrowserNotification } from '../utils/notifications';
import { 
  User, 
  UserRole, 
  SubscriptionTier,
  SubscriptionPlan,
  Gig, 
  Project, 
  Order, 
  Proposal, 
  Conversation, 
  Message, 
  NotificationItem, 
  Review, 
  Dispute, 
  WithdrawalRequest,
  FreelancerProfile,
  WorkspaceTask,
  WorkspaceAsset
} from '../types';
import { 
  INITIAL_USERS, 
  MOCK_FREELANCER_PROFILES, 
  INITIAL_GIGS, 
  INITIAL_PROJECTS, 
  INITIAL_ORDERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REVIEWS, 
  INITIAL_DISPUTES, 
  INITIAL_WITHDRAWALS 
} from '../services/mockData';

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  profiles: Record<string, FreelancerProfile>;
  gigs: Gig[];
  projects: Project[];
  orders: Order[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  notifications: NotificationItem[];
  reviews: Review[];
  disputes: Dispute[];
  withdrawals: WithdrawalRequest[];
  bookmarks: string[];
  subscriptionPlans: SubscriptionPlan[];
  
  workspaceTasks: WorkspaceTask[];
  workspaceNotes: Record<string, string>;
  workspaceAssets: WorkspaceAsset[];

  // Actions
  switchRole: (role: UserRole) => void;
  createGig: (gig: Omit<Gig, 'id' | 'createdAt' | 'ordersCompleted' | 'rating' | 'reviewsCount'>) => void;
  postProject: (project: Omit<Project, 'id' | 'createdAt' | 'status' | 'proposalCount' | 'proposals'>) => void;
  submitProposal: (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => void;
  acceptProposal: (projectId: string, proposalId: string) => void;
  submitMilestoneDeliverable: (orderId: string, milestoneId: string, note: string, file?: string) => void;
  approveMilestoneEscrow: (orderId: string, milestoneId: string) => void;
  sendMessage: (conversationId: string, text: string, attachments?: string[]) => void;
  postReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  requestWithdrawal: (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => void;
  adminApproveWithdrawal: (id: string) => void;
  adminResolveDispute: (id: string, resolution: string) => void;
  adminToggleVerifyUser: (userId: string) => void;
  markNotificationsAsRead: () => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  // Phase 3 Actions
  addWorkspaceTask: (task: Omit<WorkspaceTask, 'id' | 'createdAt'>) => void;
  updateWorkspaceTask: (taskId: string, updates: Partial<WorkspaceTask>) => void;
  deleteWorkspaceTask: (taskId: string) => void;
  updateWorkspaceNotes: (orderId: string, notes: string) => void;
  addWorkspaceAsset: (asset: Omit<WorkspaceAsset, 'id' | 'uploadedAt'>) => void;
  verifySkill: (userId: string, skill: string) => void;
  upgradeSubscription: (tier: 'none' | 'standard' | 'pro' | 'elite', price: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('earnbyway_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('client');

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find(u => u.role === 'client') || users[0];
  });

  const [profiles, setProfiles] = useState<Record<string, FreelancerProfile>>(() => {
    const saved = localStorage.getItem('earnbyway_profiles');
    return saved ? JSON.parse(saved) : MOCK_FREELANCER_PROFILES;
  });

  const [gigs, setGigs] = useState<Gig[]>(INITIAL_GIGS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('earnbyway_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    { tier: 'none', name: 'Free', price: 0, priceYearly: 0, badge: '', features: ['Basic profile', 'Standard search ranking', '5 proposals/month', 'Basic analytics'], color: 'zinc' },
    { tier: 'standard', name: 'Standard', price: 299, priceYearly: 2999, badge: 'STD', features: ['Featured profile badge', 'Boosted search ranking', '50 proposals/month', 'Advanced analytics', 'Priority support'], color: 'emerald' },
    { tier: 'pro', name: 'Pro', price: 999, priceYearly: 9999, badge: 'PRO', features: ['Verified PRO badge', 'Top search placement', 'Unlimited proposals', 'Pro analytics & insights', '24/7 priority support', 'Bid boost (2x visibility)'], color: 'amber', popular: true },
    { tier: 'elite', name: 'Elite', price: 2499, priceYearly: 24999, badge: 'ELITE', features: ['Elite verified badge', '#1 search placement', 'Unlimited everything', 'Elite analytics suite', 'Dedicated account manager', 'Bid boost (5x visibility)', 'Featured on homepage'], color: 'purple' },
  ];

  // Phase 3 States
  const [workspaceTasks, setWorkspaceTasks] = useState<WorkspaceTask[]>(() => {
    const saved = localStorage.getItem('earnbyway_workspace_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'wt_1', orderId: 'order_101', title: 'Conduct Figma User Research & Interviews', status: 'done', assignedTo: 'Sophia Chen', createdAt: '2024-07-16' },
      { id: 'wt_2', orderId: 'order_101', title: 'Draft Component Library in Figma', status: 'in_progress', assignedTo: 'Sophia Chen', createdAt: '2024-07-17' },
      { id: 'wt_3', orderId: 'order_101', title: 'Integrate Tailwind Theme Config', status: 'todo', assignedTo: 'Alex Vance', createdAt: '2024-07-18' },
      { id: 'wt_4', orderId: 'order_101', title: 'Set up OpenAI API Endpoint Client Routing', status: 'todo', assignedTo: 'Alex Vance', createdAt: '2024-07-19' },
    ];
  });

  const [workspaceNotes, setWorkspaceNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('earnbyway_workspace_notes');
    if (saved) return JSON.parse(saved);
    return {
      'order_101': `# Project Specifications\n- Main objective: Redesign the AI resume parsing & feedback tool with dynamic charts.\n- Target Audience: Fresh graduates & professionals.\n- Tech Stack: React, Recharts, Tailwind CSS.\n\n# Access Credentials & APIs\n- API Endpoint: https://api.techscale.io/v1/resume-parser\n- Staging URL: https://staging.techscale-ai.vercel.app`
    };
  });

  const [workspaceAssets, setWorkspaceAssets] = useState<WorkspaceAsset[]>(() => {
    const saved = localStorage.getItem('earnbyway_workspace_assets');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'wa_1', orderId: 'order_101', name: 'UI_Design_System_v1.fig', url: '#', size: '14.2 MB', uploadedBy: 'Sophia Chen', uploadedAt: '2024-07-16' },
      { id: 'wa_2', orderId: 'order_101', name: 'OpenAI_API_Integration_Specs.pdf', url: '#', size: '2.4 MB', uploadedBy: 'Sarah Jenkins', uploadedAt: '2024-07-17' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('earnbyway_users', JSON.stringify(users));
    const active = users.find(u => u.id === currentUser.id);
    if (active && JSON.stringify(active) !== JSON.stringify(currentUser)) {
      setCurrentUser(active);
    }
  }, [users, currentUser.id]);

  useEffect(() => {
    localStorage.setItem('earnbyway_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('earnbyway_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('earnbyway_workspace_tasks', JSON.stringify(workspaceTasks));
  }, [workspaceTasks]);

  useEffect(() => {
    localStorage.setItem('earnbyway_workspace_notes', JSON.stringify(workspaceNotes));
  }, [workspaceNotes]);

  useEffect(() => {
    localStorage.setItem('earnbyway_workspace_assets', JSON.stringify(workspaceAssets));
  }, [workspaceAssets]);

  // Sync users in state when role changes
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'client') {
      const u = users.find(x => x.role === 'client') || users[0];
      setCurrentUser(u);
    } else if (role === 'freelancer') {
      const u = users.find(x => x.role === 'freelancer') || users[1];
      setCurrentUser(u);
    } else if (role === 'admin') {
      const u = users.find(x => x.role === 'admin') || users[3];
      setCurrentUser(u);
    } else {
      // Guest mode
      setCurrentUser({
        id: 'guest_user',
        name: 'Guest Explorer',
        email: 'guest@earnbyway.dev',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'guest',
        location: 'Global',
        isVerified: false,
        joinedDate: 'Today',
        balance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0
      });
    }
  };

  // Create Gig
  const createGig = (gigData: Omit<Gig, 'id' | 'createdAt' | 'ordersCompleted' | 'rating' | 'reviewsCount'>) => {
    const newGig: Gig = {
      ...gigData,
      id: `gig_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      ordersCompleted: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGigs(prev => [newGig, ...prev]);
    
    // Add Notification
    addNotification({
      userId: currentUser.id,
      type: 'system',
      title: 'Gig Published Successfully',
      message: `Your new gig "${newGig.title.slice(0, 30)}..." is now live in search.`
    });
  };

  // Post Project
  const postProject = (projData: Omit<Project, 'id' | 'createdAt' | 'status' | 'proposalCount' | 'proposals'>) => {
    const newProject: Project = {
      ...projData,
      id: `proj_${Date.now()}`,
      status: 'open',
      proposalCount: 0,
      proposals: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);

    addNotification({
      userId: currentUser.id,
      type: 'system',
      title: 'Project Posted',
      message: `Your project "${newProject.title.slice(0, 30)}..." is live and open for proposals.`
    });
  };

  // Submit Proposal
  const submitProposal = (propData: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => {
    const newProposal: Proposal = {
      ...propData,
      id: `prop_${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => prev.map(p => {
      if (p.id === propData.projectId) {
        return {
          ...p,
          proposalCount: p.proposalCount + 1,
          proposals: [newProposal, ...p.proposals]
        };
      }
      return p;
    }));

    const proj = projects.find(p => p.id === propData.projectId);
    if (proj) {
      addNotification({
        userId: proj.clientId,
        type: 'proposal',
        title: 'New Proposal Received',
        message: `${currentUser.name} submitted a proposal for "${proj.title.slice(0, 25)}...".`
      });
    }
  };

  // Accept Proposal & Fund Escrow Order
  const acceptProposal = (projectId: string, proposalId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const prop = proj.proposals.find(pr => pr.id === proposalId);
    if (!prop) return;

    // Update project status
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'hired',
          proposals: p.proposals.map(pr => pr.id === proposalId ? { ...pr, status: 'accepted' } : { ...pr, status: 'rejected' })
        };
      }
      return p;
    }));

    // Create Order with Escrow Milestones
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      type: 'project',
      title: proj.title,
      clientId: proj.clientId,
      clientName: proj.clientName,
      freelancerId: prop.freelancerId,
      freelancerName: prop.freelancerName,
      totalPrice: prop.bidAmount,
      escrowBalance: prop.bidAmount,
      status: 'in_progress',
      createdAt: new Date().toISOString().split('T')[0],
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          title: 'Milestone 1: Prototype & Initial Delivery',
          percentage: 50,
          amount: Math.round(prop.bidAmount * 0.5),
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'funded'
        },
        {
          id: `m_${Date.now()}_2`,
          title: 'Milestone 2: Final Build & Handover',
          percentage: 50,
          amount: Math.round(prop.bidAmount * 0.5),
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: 'funded'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Notify Freelancer
    addNotification({
      userId: prop.freelancerId,
      type: 'order',
      title: 'Proposal Accepted & Escrow Funded!',
      message: `${proj.clientName} accepted your proposal for "${proj.title}". Escrow of ₹${prop.bidAmount.toLocaleString()} is locked.`
    });
  };

  // Submit Milestone Deliverable
  const submitMilestoneDeliverable = (orderId: string, milestoneId: string, note: string, file?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          milestones: o.milestones.map(m => {
            if (m.id === milestoneId) {
              return {
                ...m,
                status: 'submitted',
                deliverableNote: note,
                deliverableFile: file || 'https://earnbyway.dev/deliverables/submission.zip',
                submittedAt: new Date().toISOString().split('T')[0]
              };
            }
            return m;
          })
        };
      }
      return o;
    }));

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      addNotification({
        userId: targetOrder.clientId,
        type: 'order',
        title: 'Milestone Submitted for Review',
        message: `${targetOrder.freelancerName} submitted work for review on order #${orderId}.`
      });
    }
  };

  // Approve Milestone Escrow Release (with dependency checking)
  const approveMilestoneEscrow = (orderId: string, milestoneId: string) => {
    let releasedAmount = 0;
    let freelancerId = '';

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const milestone = order.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    // Check dependencies: all depended-on milestones must be 'released'
    if (milestone.dependsOn && milestone.dependsOn.length > 0) {
      for (const depId of milestone.dependsOn) {
        const depMilestone = order.milestones.find(m => m.id === depId);
        if (depMilestone && depMilestone.status !== 'released') {
          addNotification({
            userId: currentUser.id,
            type: 'order',
            title: 'Milestone Dependency Not Met',
            message: `"${milestone.title}" depends on "${depMilestone?.title}" which has not been released yet.`
          });
          return; // Block release
        }
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        freelancerId = o.freelancerId;
        const updatedMilestones = o.milestones.map(m => {
          if (m.id === milestoneId) {
            releasedAmount = m.amount;
            return { ...m, status: 'released' as const };
          }
          return m;
        });

        const allReleased = updatedMilestones.every(m => m.status === 'released');

        return {
          ...o,
          escrowBalance: Math.max(0, o.escrowBalance - releasedAmount),
          status: allReleased ? ('completed' as const) : o.status
        };
      }
      return o;
    }));

    // Credit Freelancer Balance
    if (releasedAmount > 0 && freelancerId) {
      setUsers(prev => prev.map(u => {
        if (u.id === freelancerId) {
          return {
            ...u,
            balance: u.balance + releasedAmount
          };
        }
        return u;
      }));

      addNotification({
        userId: freelancerId,
        type: 'payment',
        title: 'Payment Released from Escrow!',
        message: `₹${releasedAmount.toLocaleString()} has been credited to your available balance.`
      });
    }
  };

  // Send Message + Simulated Bot Response
  const sendMessage = (conversationId: string, text: string, attachments?: string[]) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: 'user_freelancer_1',
      text,
      attachments,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: 'Just now'
        };
      }
      return c;
    }));

    // Trigger simulated response after 2 seconds
    setTimeout(() => {
      const autoReply: Message = {
        id: `msg_${Date.now() + 1}`,
        conversationId,
        senderId: 'user_freelancer_1',
        senderName: 'Alex Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        recipientId: currentUser.id,
        text: `Thanks for your message, ${currentUser.name}! I received your note regarding "${text.slice(0, 20)}...". I will get back to you shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };

      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), autoReply]
      }));

      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: autoReply.text,
            lastMessageTime: 'Just now',
            unreadCount: c.unreadCount + 1
          };
        }
        return c;
      }));
    }, 2000);
  };

  // Post Review
  const postReview = (revData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...revData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);

    addNotification({
      userId: revData.targetId,
      type: 'review',
      title: 'New Client Review Received',
      message: `${revData.reviewerName} left a ${revData.rating}★ rating review for your work.`
    });
  };

  // Request Withdrawal
  const requestWithdrawal = (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => {
    const newW: WithdrawalRequest = {
      id: `w_${Date.now()}`,
      freelancerId: currentUser.id,
      freelancerName: currentUser.name,
      amount,
      method,
      accountDetails,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWithdrawals(prev => [newW, ...prev]);

    // Deduct available balance and add to withdrawn/pending
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          balance: Math.max(0, u.balance - amount),
          pendingBalance: u.pendingBalance + amount
        };
      }
      return u;
    }));
  };

  // Admin Actions
  const adminApproveWithdrawal = (id: string) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        // Move user pending balance to withdrawn
        setUsers(uPrev => uPrev.map(u => {
          if (u.id === w.freelancerId) {
            return {
              ...u,
              pendingBalance: Math.max(0, u.pendingBalance - w.amount),
              withdrawnBalance: u.withdrawnBalance + w.amount
            };
          }
          return u;
        }));
        return { ...w, status: 'approved' as const };
      }
      return w;
    }));
  };

  const adminResolveDispute = (id: string, resolution: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as const, resolution } : d));
  };

  const adminToggleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => {
    const notif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      read: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);

    // Send browser push notification
    requestNotificationPermission().then(granted => {
      if (granted) {
        sendBrowserNotification(item.title, {
          body: item.message,
          tag: notif.id,
        });
      }
    });
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  // Phase 3 Actions
  const addWorkspaceTask = (taskData: Omit<WorkspaceTask, 'id' | 'createdAt'>) => {
    const newTask: WorkspaceTask = {
      ...taskData,
      id: `wt_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWorkspaceTasks(prev => [...prev, newTask]);
  };

  const updateWorkspaceTask = (taskId: string, updates: Partial<WorkspaceTask>) => {
    setWorkspaceTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const deleteWorkspaceTask = (taskId: string) => {
    setWorkspaceTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateWorkspaceNotes = (orderId: string, notes: string) => {
    setWorkspaceNotes(prev => ({
      ...prev,
      [orderId]: notes
    }));
  };

  const addWorkspaceAsset = (assetData: Omit<WorkspaceAsset, 'id' | 'uploadedAt'>) => {
    const newAsset: WorkspaceAsset = {
      ...assetData,
      id: `wa_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setWorkspaceAssets(prev => [...prev, newAsset]);
  };

  const verifySkill = (userId: string, skill: string) => {
    setProfiles(prev => {
      const userProfile = prev[userId] || {
        userId,
        banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        bio: '',
        title: 'Freelancer',
        hourlyRate: 1000,
        skills: [skill],
        languages: [],
        education: [],
        certificates: [],
        experience: [],
        portfolio: [],
        socialLinks: {},
        availability: 'Full-time',
        rating: 5,
        completedJobs: 0,
        totalEarned: 0,
        responseTime: '< 1 hour',
        avgDeliveryTime: '3 Days',
        responseRate: 100,
        proposalSuccessRate: 100,
        profileViewsThisMonth: 10
      };
      
      const verified = userProfile.verifiedSkills || [];
      if (!verified.includes(skill)) {
        return {
          ...prev,
          [userId]: {
            ...userProfile,
            verifiedSkills: [...verified, skill],
            skills: userProfile.skills.includes(skill) ? userProfile.skills : [...userProfile.skills, skill]
          }
        };
      }
      return prev;
    });

    addNotification({
      userId,
      type: 'system',
      title: 'Skill Verified!',
      message: `Congratulations! You successfully passed the assessment and verified your skill: ${skill}.`
    });
  };

  const upgradeSubscription = (tier: SubscriptionTier, price: number): boolean => {
    let success = false;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        if (u.balance >= price) {
          success = true;
          return {
            ...u,
            balance: u.balance - price,
            proTier: tier
          };
        }
      }
      return u;
    }));

    if (success) {
      addNotification({
        userId: currentUser.id,
        type: 'system',
        title: `Upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`,
        message: `Your account has been upgraded to ${tier}. ₹${price.toLocaleString()} was deducted from your wallet balance.`
      });
    }
    return success;
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentRole,
      users,
      profiles,
      gigs,
      projects,
      orders,
      conversations,
      messages,
      notifications,
      reviews,
      disputes,
      withdrawals,
      bookmarks,
      subscriptionPlans: SUBSCRIPTION_PLANS,
      switchRole,
      createGig,
      postProject,
      submitProposal,
      acceptProposal,
      submitMilestoneDeliverable,
      approveMilestoneEscrow,
      sendMessage,
      postReview,
      requestWithdrawal,
      adminApproveWithdrawal,
      adminResolveDispute,
      adminToggleVerifyUser,
      markNotificationsAsRead,
      toggleBookmark,
      isBookmarked,
      workspaceTasks,
      workspaceNotes,
      workspaceAssets,
      addWorkspaceTask,
      updateWorkspaceTask,
      deleteWorkspaceTask,
      updateWorkspaceNotes,
      addWorkspaceAsset,
      verifySkill,
      upgradeSubscription
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

