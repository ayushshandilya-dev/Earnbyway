import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '../services/api';
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

  typingUsers: Record<string, { senderId: string; isTyping: boolean }>;
  usingBackend: boolean;

  // Actions
  switchRole: (role: UserRole) => void;
  signIn: (role: 'client' | 'freelancer', email?: string, name?: string) => User;
  loginUser: (email: string, password: string) => Promise<User>;
  registerUser: (name: string, email: string, role: 'client' | 'freelancer', password?: string, title?: string, location?: string) => Promise<User>;
  signOut: () => void;
  createGig: (gig: Omit<Gig, 'id' | 'createdAt' | 'ordersCompleted' | 'rating' | 'reviewsCount'>) => void;
  postProject: (project: Omit<Project, 'id' | 'createdAt' | 'status' | 'proposalCount' | 'proposals'>) => void;
  submitProposal: (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => void;
  acceptProposal: (projectId: string, proposalId: string) => void;
  rejectProposal: (projectId: string, proposalId: string) => void;
  createOrderFromGig: (gig: Gig, packageKey: 'basic' | 'standard' | 'premium') => Order | Promise<Order>;
  submitMilestoneDeliverable: (orderId: string, milestoneId: string, note: string, file?: string) => void;
  approveMilestoneEscrow: (orderId: string, milestoneId: string) => void;
  sendMessage: (conversationId: string, text: string, attachments?: string[]) => void;
  startConversation: (participantId: string) => Promise<string>;
  joinChatRoom: (conversationId: string) => void;
  leaveChatRoom: (conversationId: string) => void;
  sendTypingStatus: (conversationId: string, isTyping: boolean) => void;
  markConversationRead: (conversationId: string) => void;
  postReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  updateProfile: (updates: Partial<User>) => void;
  depositFunds: (amount: number, paymentMethod: string) => Promise<any>;
  requestWithdrawal: (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => void;
  adminApproveWithdrawal: (id: string) => void;
  adminRejectWithdrawal: (id: string) => void;
  adminResolveDispute: (id: string, resolution: string) => void;
  adminToggleVerifyUser: (userId: string) => void;
  markNotificationsAsRead: () => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  loadOrderWorkspace: (orderId: string) => Promise<void>;

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
  const isBackendEnabled = !!import.meta.env.VITE_API_URL;
  const [usingBackend, setUsingBackend] = useState(isBackendEnabled);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('earnbyway_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const token = localStorage.getItem('earnbyway_token') || localStorage.getItem('earnbyway_access_token');
    if (!token) return 'guest';
    const saved = localStorage.getItem('earnbyway_role');
    return (saved as UserRole) || 'guest';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('earnbyway_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (_) {}
    }
    const token = localStorage.getItem('earnbyway_token') || localStorage.getItem('earnbyway_access_token');
    if (!token) {
      return {
        id: 'guest_user',
        name: 'Guest Explorer',
        email: 'guest@earnbyway.dev',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'guest',
        location: 'Global',
        isVerified: false,
        isOnboarded: true,
        joinedDate: 'Today',
        balance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0
      };
    }
    const role = localStorage.getItem('earnbyway_role') as UserRole;
    const user = users.find(u => u.role === role) || users.find(u => u.role === 'client') || users[0];
    return { ...user, isOnboarded: true }; // default mock users to onboarded
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
  const [typingUsers, setTypingUsers] = useState<Record<string, { senderId: string; isTyping: boolean }>>({});
  const socketRef = useRef<Socket | null>(null);
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
    const initData = async () => {
      if (!isBackendEnabled) return;
      try {
        const token = api.getToken();
        let activeUser = currentUser;
        
        if (token) {
          try {
            const me = await api.getMe();
            activeUser = me;
            setCurrentUser(me);
            if (me.role) {
              setCurrentRole(me.role);
              localStorage.setItem('earnbyway_role', me.role);
            }
          } catch (err) {
            console.warn('API getMe failed, clearing token:', err);
            api.setToken(null);
            switchRole('guest');
          }
        }
        
        const [gigsData, projectsData, freelancersData] = await Promise.all([
          api.getGigs(),
          api.getProjects(),
          api.getFreelancers()
        ]);
        
        setGigs(gigsData);
        setProjects(projectsData);
        
        const profilesMap: Record<string, FreelancerProfile> = {};
        const usersList: User[] = [];
        
        freelancersData.forEach((f: any) => {
          const { freelancerProfile, ...userWithoutProfile } = f;
          usersList.push(userWithoutProfile);
          if (freelancerProfile) {
            profilesMap[f.id] = freelancerProfile;
          }
        });
        
        setProfiles(profilesMap);
        setUsers(prev => {
          const merged = [...prev];
          usersList.forEach(u => {
            if (!merged.some(x => x.id === u.id)) {
              merged.push(u);
            }
          });
          return merged;
        });

        if (token && activeUser) {
          const [ordersData, convsData, withdrawalsData] = await Promise.all([
            api.getOrders(),
            api.getConversations(),
            activeUser.role === 'admin' ? api.getAdminWithdrawals() : api.getWithdrawals()
          ]);
          setOrders(ordersData);
          setConversations(convsData);
          setWithdrawals(withdrawalsData || []);
          
          if (convsData.length > 0) {
            const messagesMap: Record<string, Message[]> = {};
            await Promise.all(
              convsData.slice(0, 3).map(async (c: any) => {
                try {
                  const msgs = await api.getMessages(c.id);
                  messagesMap[c.id] = msgs;
                } catch (e) {}
              })
            );
            setMessages(messagesMap);
          }
        }
      } catch (error) {
        console.error('Failed to load database. Falling back to mock data:', error);
        setUsingBackend(false);
      }
    };
    initData();
  }, [usingBackend]);

  // Connect/disconnect Socket.io based on auth status and backend flag
  useEffect(() => {
    if (usingBackend && currentUser && currentUser.id !== 'guest_user') {
      const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';
      const s = io(socketUrl);
      socketRef.current = s;

      s.on('connect', () => {
        console.log('Socket.IO connected to backend server');
      });

      // Listen for incoming messages
      s.on('receive_message', (message: any) => {
        // Format database message to match frontend expectations
        const formattedMsg: Message = {
          id: message.id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          recipientId: message.recipientId,
          text: message.text,
          attachments: typeof message.attachments === 'string' ? JSON.parse(message.attachments) : (message.attachments || []),
          timestamp: new Date(message.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: message.isRead
        };

        setMessages(prev => {
          const roomMsgs = prev[message.conversationId] || [];
          if (roomMsgs.some(m => m.id === message.id)) {
            return prev;
          }
          return {
            ...prev,
            [message.conversationId]: [...roomMsgs, formattedMsg]
          };
        });

        // Update conversation last message details
        setConversations(prev => prev.map(c => {
          if (c.id === message.conversationId) {
            return {
              ...c,
              lastMessage: message.text || '[Attachment]',
              lastMessageTime: new Date(message.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unreadCount: message.senderId !== currentUser.id ? c.unreadCount + 1 : c.unreadCount
            };
          }
          return c;
        }));
      });

      s.on('user_typing', (data: { conversationId: string; senderId: string; isTyping: boolean }) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: { senderId: data.senderId, isTyping: data.isTyping }
        }));
      });

      return () => {
        s.off('receive_message');
        s.off('user_typing');
        s.disconnect();
        socketRef.current = null;
      };
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [usingBackend, currentUser.id]);

  const joinChatRoom = useCallback((conversationId: string) => {
    if (usingBackend && socketRef.current) {
      socketRef.current.emit('join_room', conversationId);
    }
  }, [usingBackend]);

  const leaveChatRoom = useCallback((conversationId: string) => {
    // leave room logic if needed
  }, []);

  const sendTypingStatus = useCallback((conversationId: string, isTyping: boolean) => {
    if (usingBackend && socketRef.current) {
      socketRef.current.emit('typing', { conversationId, senderId: currentUser.id, isTyping });
    }
  }, [usingBackend, currentUser.id]);

  useEffect(() => {
    if (!usingBackend) {
      localStorage.setItem('earnbyway_users', JSON.stringify(users));
    }
  }, [users, usingBackend]);

  useEffect(() => {
    if (currentUser && currentUser.id !== 'guest_user') {
      localStorage.setItem('earnbyway_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('earnbyway_user');
    }
  }, [currentUser]);

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
    localStorage.setItem('earnbyway_role', role);
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

  // Sign in: find or create a user by role + email, persist identity
  const signIn = (role: 'client' | 'freelancer', email?: string, name?: string) => {
    let target = users.find(u => u.role === role && (!email || u.email === email));
    if (!target) {
      target = users.find(u => u.role === role);
    }
    if (!target) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name || (role === 'client' ? 'New Client' : 'New Freelancer'),
        email: email || `${role}@earnbyway.dev`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role,
        location: 'Global',
        isVerified: false,
        joinedDate: new Date().toISOString().split('T')[0],
        balance: 0,
        pendingBalance: 0,
        withdrawnBalance: 0
      };
      setUsers(prev => [newUser, ...prev]);
      target = newUser;
    }
    setCurrentRole(role);
    localStorage.setItem('earnbyway_role', role);
    setCurrentUser(target);
    return target;
  };

  const loginUser = async (emailInput: string, passwordInput: string) => {
    if (usingBackend) {
      const user = await api.login({ email: emailInput, password: passwordInput });
      setCurrentUser(user);
      setCurrentRole(user.role);
      localStorage.setItem('earnbyway_role', user.role);
      const [ordersData, convsData] = await Promise.all([
        api.getOrders(),
        api.getConversations()
      ]);
      setOrders(ordersData);
      setConversations(convsData);
      return user;
    } else {
      return signIn('client', emailInput);
    }
  };

  const registerUser = async (nameInput: string, emailInput: string, role: 'client' | 'freelancer', passwordInput?: string) => {
    if (usingBackend) {
      const user = await api.register({
        name: nameInput,
        email: emailInput,
        password: passwordInput || 'password123',
        role,
        title: role === 'freelancer' ? 'Specialist' : undefined,
        location: 'Global'
      });
      setCurrentUser(user);
      setCurrentRole(user.role);
      localStorage.setItem('earnbyway_role', user.role);
      return user;
    } else {
      return signIn(role, emailInput, nameInput);
    }
  };

  // Sign out: return to guest view
  const signOut = () => {
    if (usingBackend) {
      api.setToken(null);
    }
    switchRole('guest');
  };

  // Create Gig
  const createGig = async (gigData: Omit<Gig, 'id' | 'createdAt' | 'ordersCompleted' | 'rating' | 'reviewsCount'>) => {
    if (usingBackend) {
      try {
        const gig = await api.createGig(gigData);
        setGigs(prev => [gig, ...prev]);
        addNotification({
          userId: currentUser.id,
          type: 'system',
          title: 'Gig Published Successfully',
          message: `Your new gig "${gig.title.slice(0, 30)}..." is now live in search.`
        });
      } catch (err) {
        console.error('Failed to publish gig:', err);
      }
    } else {
      const newGig: Gig = {
        ...gigData,
        id: `gig_${Date.now()}`,
        rating: 5.0,
        reviewsCount: 0,
        ordersCompleted: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGigs(prev => [newGig, ...prev]);
      
      addNotification({
        userId: currentUser.id,
        type: 'system',
        title: 'Gig Published Successfully',
        message: `Your new gig "${newGig.title.slice(0, 30)}..." is now live in search.`
      });
    }
  };

  // Post Project
  const postProject = async (projData: Omit<Project, 'id' | 'createdAt' | 'status' | 'proposalCount' | 'proposals'>) => {
    if (usingBackend) {
      try {
        const project = await api.postProject(projData);
        setProjects(prev => [project, ...prev]);
        addNotification({
          userId: currentUser.id,
          type: 'system',
          title: 'Project Posted',
          message: `Your project "${project.title.slice(0, 30)}..." is live and open for proposals.`
        });
      } catch (err) {
        console.error('Failed to post project:', err);
      }
    } else {
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
    }
  };

  // Submit Proposal
  const submitProposal = async (propData: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => {
    if (usingBackend) {
      try {
        const proposal = await api.submitProposal(propData.projectId, propData);
        setProjects(prev => prev.map(p => {
          if (p.id === propData.projectId) {
            return {
              ...p,
              proposalCount: p.proposalCount + 1,
              proposals: [proposal, ...p.proposals]
            };
          }
          return p;
        }));
      } catch (err) {
        console.error('Failed to submit proposal:', err);
      }
    } else {
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
    }
  };

  // Accept Proposal & Fund Escrow Order
  const acceptProposal = async (projectId: string, proposalId: string) => {
    if (usingBackend) {
      try {
        await api.manageProposal(projectId, proposalId, 'accepted');
        const [projectsData, ordersData] = await Promise.all([
          api.getProjects(),
          api.getOrders()
        ]);
        setProjects(projectsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to accept proposal:', err);
      }
    } else {
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
    }
  };

  // Submit Milestone Deliverable
  const submitMilestoneDeliverable = async (orderId: string, milestoneId: string, note: string, file?: string) => {
    if (usingBackend) {
      try {
        await api.submitMilestone(orderId, milestoneId, { note, file });
        const ordersData = await api.getOrders();
        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to submit milestone:', err);
      }
    } else {
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
    }
  };

  // Approve Milestone Escrow Release (with dependency checking)
  const approveMilestoneEscrow = async (orderId: string, milestoneId: string) => {
    if (usingBackend) {
      try {
        await api.releaseMilestone(orderId, milestoneId);
        const [ordersData, me] = await Promise.all([
          api.getOrders(),
          api.getMe()
        ]);
        setOrders(ordersData);
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to release milestone:', err);
      }
    } else {
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
    }
  };

  // Mark conversation read + clear unread
  const markConversationRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
    if (usingBackend && socketRef.current) {
      socketRef.current.emit('join_room', conversationId);
    }
  }, [usingBackend]);

  // Send Message + Simulated Bot Response
  const sendMessage = async (conversationId: string, text: string, attachments?: string[]) => {
    if (usingBackend) {
      try {
        if (socketRef.current) {
          socketRef.current.emit('send_message', {
            conversationId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            content: text,
            attachments: attachments || []
          });
        }
      } catch (err) {
        console.error('Failed to send socket message:', err);
      }
    } else {
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
    }
  };

  const startConversation = useCallback(async (participantId: string): Promise<string> => {
    if (usingBackend) {
      try {
        const newConv = await api.createConversation(participantId);
        setConversations(prev => {
          if (prev.some(c => c.id === newConv.id)) return prev;
          return [newConv, ...prev];
        });
        try {
          const msgs = await api.getMessages(newConv.id);
          setMessages(prev => ({ ...prev, [newConv.id]: msgs }));
        } catch (e) {
          console.error('Failed to load messages for conversation:', e);
        }
        return newConv.id;
      } catch (err) {
        console.error('Failed to start conversation:', err);
        throw err;
      }
    } else {
      const existing = conversations.find(c => c.participant.id === participantId);
      if (existing) return existing.id;

      const otherUser = users.find(u => u.id === participantId) || {
        id: participantId,
        name: 'Alex Vance',
        email: 'alex@techscale.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'freelancer'
      };

      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participant: {
          id: otherUser.id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          role: otherUser.role as any,
          isOnline: true
        },
        lastMessage: 'Conversation started',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };

      setConversations(prev => [newConv, ...prev]);
      setMessages(prev => ({ ...prev, [newConv.id]: [] }));
      return newConv.id;
    }
  }, [usingBackend, conversations, users]);

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

  // Update current user's profile (settings & onboarding)
  const updateProfile = async (updates: any) => {
    if (usingBackend) {
      try {
        const updatedUser = await api.updateProfile(updates);
        setCurrentUser(updatedUser);
        if (updatedUser.freelancerProfile) {
          setProfiles(prev => ({
            ...prev,
            [updatedUser.id]: updatedUser.freelancerProfile
          }));
        }
        return updatedUser;
      } catch (err) {
        console.error('Failed to update profile:', err);
        throw err;
      }
    } else {
      const isFreelancer = currentUser.role === 'freelancer';
      const updatedUser = {
        ...currentUser,
        name: updates.name || currentUser.name,
        location: updates.location || currentUser.location,
        title: updates.title || currentUser.title,
        avatar: updates.avatar || currentUser.avatar,
        company: currentUser.role === 'client' ? (updates.company || currentUser.company) : undefined,
        isOnboarded: true,
      };

      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);

      if (isFreelancer && updates.freelancerProfile) {
        const mockProfile = {
          ...updates.freelancerProfile,
          userId: currentUser.id,
          rating: 5.0,
          completedJobs: 0,
          totalEarned: 0,
          responseTime: '< 1 hour',
          avgDeliveryTime: '3 Days',
          responseRate: 100,
          proposalSuccessRate: 100,
          profileViewsThisMonth: 0,
          verifiedSkills: [],
        };
        setProfiles(prev => ({
          ...prev,
          [currentUser.id]: mockProfile
        }));
      }
      return updatedUser;
    }
  };

  // Reject a proposal (persists status so it can't reappear)
  const rejectProposal = async (projectId: string, proposalId: string) => {
    if (usingBackend) {
      try {
        await api.manageProposal(projectId, proposalId, 'rejected');
        setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              proposals: p.proposals.map(pr => pr.id === proposalId ? { ...pr, status: 'rejected' as const } : pr)
            };
          }
          return p;
        }));
      } catch (err) {
        console.error('Failed to reject proposal:', err);
      }
    } else {
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            proposals: p.proposals.map(pr => pr.id === proposalId ? { ...pr, status: 'rejected' as const } : pr)
          };
        }
        return p;
      }));
    }
  };

  // Admin reject withdrawal (persists status)
  const adminRejectWithdrawal = async (id: string) => {
    if (usingBackend) {
      try {
        await api.rejectWithdrawal(id);
        const withdrawalsData = await api.getAdminWithdrawals();
        setWithdrawals(withdrawalsData);
        const me = await api.getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to reject withdrawal:', err);
      }
    } else {
      const target = withdrawals.find(w => w.id === id);
      if (!target) return;
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected' as const } : w));
      setUsers(uPrev => uPrev.map(u => {
        if (u.id === target.freelancerId) {
          return {
            ...u,
            balance: u.balance + target.amount,
            pendingBalance: Math.max(0, u.pendingBalance - target.amount)
          };
        }
        return u;
      }));
      addNotification({
        userId: target.freelancerId,
        type: 'payment',
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request of ₹${target.amount.toLocaleString()} was rejected. Funds returned to balance.`
      });
    }
  };

  // Buy a gig → create an escrow order (Order Now flow)
  const createOrderFromGig = async (gig: Gig, packageKey: 'basic' | 'standard' | 'premium') => {
    if (usingBackend) {
      try {
        const order = await api.createOrderFromGig(gig.id, packageKey);
        setOrders(prev => [order, ...prev]);
        const gigPackages = typeof gig.packages === 'string' ? JSON.parse(gig.packages) : gig.packages;
        const price = gigPackages[packageKey].price;
        setCurrentUser(prev => ({
          ...prev,
          balance: Math.max(0, prev.balance - price),
          pendingBalance: prev.pendingBalance + price
        }));
        return order;
      } catch (err) {
        console.error('Failed to create order from gig:', err);
        throw err;
      }
    } else {
      const gigPackages = typeof gig.packages === 'string' ? JSON.parse(gig.packages) : gig.packages;
      const pkg = gigPackages[packageKey];
      const freelancerUser = users.find(u => u.id === gig.freelancerId);

      const newOrder: Order = {
        id: `order_${Date.now()}`,
        type: 'gig',
        title: gig.title,
        clientId: currentUser.id,
        clientName: currentUser.name,
        freelancerId: gig.freelancerId,
        freelancerName: gig.freelancerName,
        totalPrice: pkg.price,
        escrowBalance: pkg.price,
        status: 'funded',
        createdAt: new Date().toISOString().split('T')[0],
        milestones: [{
          id: `m_${Date.now()}_1`,
          title: `${pkg.title} — Final Delivery`,
          percentage: 100,
          amount: pkg.price,
          dueDate: new Date(Date.now() + pkg.deliveryDays * 86400000).toISOString().split('T')[0],
          status: 'funded'
        }]
      };

      setOrders(prev => [newOrder, ...prev]);

      addNotification({
        userId: gig.freelancerId,
        type: 'order',
        title: 'New Order!',
        message: `${currentUser.name} ordered "${gig.title}" (${pkg.title}). ₹${pkg.price.toLocaleString()} is in escrow.`
      });
      return newOrder;
    }
  };

  // Deposit Funds (Wallet Top-Up)
  const depositFunds = async (amount: number, paymentMethod: string) => {
    if (usingBackend) {
      try {
        if (paymentMethod === 'Razorpay') {
          // 1. Create order on backend
          const orderData = await api.createPaymentOrder(amount);

          return new Promise((resolve, reject) => {
            const options = {
              key: orderData.key_id,
              amount: orderData.amount,
              currency: orderData.currency,
              name: 'EarnByWay Platform',
              description: `Wallet deposit of ₹${amount}`,
              order_id: orderData.orderId,
              handler: async (response: any) => {
                try {
                  // 2. Verify payment signature on backend
                  const res = await api.verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  });
                  setCurrentUser(res.user);
                  resolve(res);
                } catch (err) {
                  reject(err);
                }
              },
              prefill: {
                name: currentUser.name,
                email: currentUser.email,
              },
              theme: {
                color: '#10b981', // emerald-500 brand color
              },
              modal: {
                ondismiss: () => {
                  reject(new Error('Payment cancelled by user'));
                }
              }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          });
        } else {
          const res = await api.depositFunds(amount, paymentMethod);
          setCurrentUser(res.user);
          return res;
        }
      } catch (err) {
        console.error('Deposit failed:', err);
        throw err;
      }
    } else {
      setCurrentUser(prev => ({
        ...prev,
        balance: prev.balance + amount
      }));
      addNotification({
        userId: currentUser.id,
        type: 'payment',
        title: 'Wallet Funded Successfully (Demo)',
        message: `₹${amount.toLocaleString()} has been added to your available balance via ${paymentMethod}.`
      });
    }
  };

  // Request Withdrawal
  const requestWithdrawal = async (amount: number, method: WithdrawalRequest['method'], accountDetails: string) => {
    if (usingBackend) {
      try {
        const res = await api.requestWithdrawal(amount, method, accountDetails);
        setCurrentUser(res.user);
        setWithdrawals(prev => [res.withdrawal, ...prev]);
      } catch (err) {
        console.error('Withdrawal failed:', err);
      }
    } else {
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
    }
  };

  // Admin Actions
  const adminApproveWithdrawal = async (id: string) => {
    if (usingBackend) {
      try {
        await api.approveWithdrawal(id);
        const withdrawalsData = await api.getAdminWithdrawals();
        setWithdrawals(withdrawalsData);
        const me = await api.getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error('Failed to approve withdrawal:', err);
      }
    } else {
      const target = withdrawals.find(w => w.id === id);
      if (!target) return;

      // Move user pending balance to withdrawn (outside any state updater)
      setUsers(uPrev => uPrev.map(u => {
        if (u.id === target.freelancerId) {
          return {
            ...u,
            pendingBalance: Math.max(0, u.pendingBalance - target.amount),
            withdrawnBalance: u.withdrawnBalance + target.amount
          };
        }
        return u;
      }));

      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved' as const } : w));

      addNotification({
        userId: target.freelancerId,
        type: 'payment',
        title: 'Withdrawal Approved',
        message: `Your withdrawal of ₹${target.amount.toLocaleString()} has been approved and paid out.`
      });
    }
  };

  const adminResolveDispute = (id: string, resolution: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: 'resolved' as const, resolution } : d));
  };

  const adminToggleVerifyUser = async (userId: string) => {
    if (usingBackend) {
      try {
        const res = await api.toggleVerifyUser(userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: res.isVerified } : u));
      } catch (err) {
        console.error('Failed to toggle user verification status:', err);
      }
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    }
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
    setNotifications(prev => prev.map(n =>
      (n.userId === currentUser.id || currentRole === 'admin') ? { ...n, read: true } : n
    ));
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const loadOrderWorkspace = async (orderId: string) => {
    if (usingBackend) {
      try {
        const order = await api.getOrderById(orderId);
        setWorkspaceTasks(order.workspaceTasks || []);
        setWorkspaceAssets(order.workspaceAssets || []);
        if (order.workspaceNotes) {
          setWorkspaceNotes(prev => ({
            ...prev,
            [orderId]: order.workspaceNotes.notes || ''
          }));
        } else {
          setWorkspaceNotes(prev => ({
            ...prev,
            [orderId]: ''
          }));
        }
      } catch (err) {
        console.error('Failed to load order workspace data:', err);
      }
    }
  };

  // Phase 3 Actions
  const addWorkspaceTask = async (taskData: Omit<WorkspaceTask, 'id' | 'createdAt'>) => {
    if (usingBackend) {
      try {
        const task = await api.addWorkspaceTask(taskData.orderId, { title: taskData.title, assignedTo: taskData.assignedTo || '' });
        setWorkspaceTasks(prev => [...prev, task]);
      } catch (err) {
        console.error('Failed to add workspace task:', err);
      }
    } else {
      const newTask: WorkspaceTask = {
        ...taskData,
        id: `wt_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setWorkspaceTasks(prev => [...prev, newTask]);
    }
  };

  const updateWorkspaceTask = async (taskId: string, updates: Partial<WorkspaceTask>) => {
    if (usingBackend) {
      try {
        const task = workspaceTasks.find(t => t.id === taskId);
        if (task) {
          const updated = await api.updateWorkspaceTask(task.orderId, taskId, {
            status: updates.status || task.status,
            assignedTo: updates.assignedTo || task.assignedTo || ''
          });
          setWorkspaceTasks(prev => prev.map(t => t.id === taskId ? updated : t));
        }
      } catch (err) {
        console.error('Failed to update workspace task:', err);
      }
    } else {
      setWorkspaceTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    }
  };

  const deleteWorkspaceTask = (taskId: string) => {
    setWorkspaceTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const updateWorkspaceNotes = async (orderId: string, notes: string) => {
    if (usingBackend) {
      try {
        await api.updateWorkspaceNotes(orderId, notes);
        setWorkspaceNotes(prev => ({
          ...prev,
          [orderId]: notes
        }));
      } catch (err) {
        console.error('Failed to update workspace notes:', err);
      }
    } else {
      setWorkspaceNotes(prev => ({
        ...prev,
        [orderId]: notes
      }));
    }
  };

  const addWorkspaceAsset = async (assetData: Omit<WorkspaceAsset, 'id' | 'uploadedAt'>) => {
    if (usingBackend) {
      try {
        const asset = await api.addWorkspaceAsset(assetData.orderId, {
          name: assetData.name,
          url: assetData.url,
          size: assetData.size || 'Unknown'
        });
        setWorkspaceAssets(prev => [...prev, asset]);
      } catch (err) {
        console.error('Failed to add workspace asset:', err);
      }
    } else {
      const newAsset: WorkspaceAsset = {
        ...assetData,
        id: `wa_${Date.now()}`,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setWorkspaceAssets(prev => [...prev, newAsset]);
    }
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
    const user = users.find(u => u.id === currentUser.id);
    if (!user || user.balance < price) {
      return false;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          balance: u.balance - price,
          proTier: tier
        };
      }
      return u;
    }));

    addNotification({
      userId: currentUser.id,
      type: 'system',
      title: `Upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`,
      message: `Your account has been upgraded to ${tier}. ₹${price.toLocaleString()} was deducted from your wallet balance.`
    });
    return true;
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
      typingUsers,
      usingBackend,
      switchRole,
      signIn,
      loginUser,
      registerUser,
      joinChatRoom,
      leaveChatRoom,
      sendTypingStatus,
      signOut,
      createGig,
      postProject,
      submitProposal,
      acceptProposal,
      rejectProposal,
      createOrderFromGig,
      submitMilestoneDeliverable,
      approveMilestoneEscrow,
      sendMessage,
      startConversation,
      markConversationRead,
      postReview,
      updateProfile,
      depositFunds,
      requestWithdrawal,
      adminApproveWithdrawal,
      adminRejectWithdrawal,
      adminResolveDispute,
      adminToggleVerifyUser,
      markNotificationsAsRead,
      toggleBookmark,
      isBookmarked,
      loadOrderWorkspace,
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

