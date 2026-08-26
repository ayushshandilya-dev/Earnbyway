import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, X, ArrowLeft, Lock, LogIn } from 'lucide-react';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { GitHubCallback } from './components/auth/GitHubCallback';
import { CreateGigWizard } from './components/gigs/CreateGigWizard';
import { PostProjectWizard } from './components/projects/PostProjectWizard';
import { AIToolsPlayground } from './components/ai/AIToolsPlayground';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { CursorGlow } from './components/ui/CursorGlow';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

const LandingPage = lazy(() => import('./components/landing/LandingPage').then(m => ({ default: m.LandingPage })));
const GigCatalog = lazy(() => import('./components/gigs/GigCatalog').then(m => ({ default: m.GigCatalog })));
const GigDetail = lazy(() => import('./components/gigs/GigDetail').then(m => ({ default: m.GigDetail })));
const FreelancerProfile = lazy(() => import('./components/profiles/FreelancerProfile').then(m => ({ default: m.FreelancerProfile })));
const ProjectsBoard = lazy(() => import('./components/projects/ProjectsBoard').then(m => ({ default: m.ProjectsBoard })));
const ClientDashboard = lazy(() => import('./components/dashboards/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const FreelancerDashboard = lazy(() => import('./components/dashboards/FreelancerDashboard').then(m => ({ default: m.FreelancerDashboard })));
const MessagingPage = lazy(() => import('./components/chat/MessagingPage').then(m => ({ default: m.MessagingPage })));
const EarningsPage = lazy(() => import('./components/earnings/EarningsPage').then(m => ({ default: m.EarningsPage })));
const SearchResults = lazy(() => import('./components/search/SearchResults').then(m => ({ default: m.SearchResults })));
const BookmarksPage = lazy(() => import('./components/bookmarks/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const OrderDashboard = lazy(() => import('./components/orders/OrderDashboard').then(m => ({ default: m.OrderDashboard })));
const CollaborativeWorkspace = lazy(() => import('./components/orders/CollaborativeWorkspace').then(m => ({ default: m.CollaborativeWorkspace })));
const ProposalManagement = lazy(() => import('./components/proposals/ProposalManagement').then(m => ({ default: m.ProposalManagement })));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SubscriptionPage = lazy(() => import('./components/subscriptions/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const ProfilePage = lazy(() => import('./components/profiles/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UserManagement = lazy(() => import('./components/admin/UserManagement').then(m => ({ default: m.UserManagement })));
const DisputePanel = lazy(() => import('./components/admin/DisputePanel').then(m => ({ default: m.DisputePanel })));
const WithdrawalApprovals = lazy(() => import('./components/admin/WithdrawalApprovals').then(m => ({ default: m.WithdrawalApprovals })));
const OnboardingPage = lazy(() => import('./components/auth/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const NotFoundPage = lazy(() => import('./components/ui/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center py-32">
    <div className="relative">
      <div className="w-10 h-10 border-2 border-zinc-800 rounded-full" />
      <div className="absolute inset-0 w-10 h-10 border-2 border-emerald-400 rounded-full border-t-transparent animate-spin" />
    </div>
  </div>
);

const AnimatedOutlet: React.FC = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-in">
      <Outlet />
    </div>
  );
};

// ─── AUTH REQUIRED PAGE (shown when guest tries to access protected route) ───
const AuthRequiredPage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-white mb-3">Sign In Required</h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          You need to be signed in to access this page. Create a free account or sign in with your existing credentials.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <button
            onClick={onOpenAuth}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In / Sign Up
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

const GigDetailRoute: React.FC = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { gigs } = useApp();
  const gig = gigs.find(g => g.id === gigId);
  if (!gig) return <NotFoundPage />;
  return (
    <div className="py-4">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <GigDetail gig={gig} onBack={() => navigate(-1)} />
    </div>
  );
};

const FreelancerProfileRoute: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users } = useApp();
  const user = users.find(u => u.id === userId);
  if (!user) return <NotFoundPage />;
  return <FreelancerProfile freelancerUser={user} onBack={() => navigate(-1)} />;
};

const AppLayout: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [isPostProjectOpen, setIsPostProjectOpen] = useState(false);
  const [isCreateGigOpen, setIsCreateGigOpen] = useState(false);
  const location = useLocation();

  // Auto-open auth modal when redirected with ?auth=1
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth') === '1') {
      setIsAuthOpen(true);
      // Clean up the URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search]);

  return (
<div className="min-h-screen bg-[#09090b] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
        <SmoothScroll />
        <ScrollProgress />
        <CursorGlow />
        {/* Full-page aurora backdrop */}
        <div className="aurora-bg">
          <div className="bg-band band-1" />
          <div className="bg-band band-2" />
        </div>
        <div className="fixed inset-0 pointer-events-none bg-grid opacity-40 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAITools={() => setIsAIToolsOpen(true)}
          onOpenPostProject={() => setIsPostProjectOpen(true)}
          onOpenCreateGig={() => setIsCreateGigOpen(true)}
        />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <AnimatedOutlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        {isAIToolsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto" onClick={() => setIsAIToolsOpen(false)}>
            <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-heading font-bold text-white">AI Tools Playground</h2>
                <button onClick={() => setIsAIToolsOpen(false)} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <AIToolsPlayground />
            </div>
          </div>
        )}
        <PostProjectWizard isOpen={isPostProjectOpen} onClose={() => setIsPostProjectOpen(false)} />
        <CreateGigWizard isOpen={isCreateGigOpen} onClose={() => setIsCreateGigOpen(false)} />
      </div>
    </div>
  );
};

// ─── ROUTE GUARD: RequireAuth wrapper ───
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentRole, currentUser } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  if (currentRole === 'guest') {
    return (
      <>
        <AuthRequiredPage onOpenAuth={() => setIsAuthOpen(true)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  // If user is logged in but hasn't completed onboarding, force redirection
  if (currentUser && currentUser.isOnboarded === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const DashboardPage: React.FC = () => {
  const { currentRole } = useApp();
  if (currentRole === 'client') return <ClientDashboard />;
  if (currentRole === 'freelancer') return <FreelancerDashboard />;
  return <AdminDashboard />;
};

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/gigs" element={<GigCatalog />} />
          <Route path="/gigs/:gigId" element={<GigDetailRoute />} />
          <Route path="/profile/:userId" element={<FreelancerProfileRoute />} />
          <Route path="/projects" element={<ProjectsBoard />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/ai" element={<AIToolsPlayground />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          {/* Protected routes — require authentication */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
          <Route path="/earnings" element={<ProtectedRoute><EarningsPage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderDashboard /></ProtectedRoute>} />
          <Route path="/workspace/:orderId" element={<ProtectedRoute><CollaborativeWorkspace /></ProtectedRoute>} />
          <Route path="/proposals" element={<ProtectedRoute><ProposalManagement /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/disputes" element={<ProtectedRoute><DisputePanel /></ProtectedRoute>} />
          <Route path="/admin/withdrawals" element={<ProtectedRoute><WithdrawalApprovals /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </ToastProvider>
    </AppProvider>
  );
}
