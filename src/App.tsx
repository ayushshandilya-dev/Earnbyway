import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Loader2, X, ArrowLeft } from 'lucide-react';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { CreateGigWizard } from './components/gigs/CreateGigWizard';
import { PostProjectWizard } from './components/projects/PostProjectWizard';
import { AIToolsPlayground } from './components/ai/AIToolsPlayground';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
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

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      <div className="fixed inset-0 pointer-events-none bg-grid opacity-40 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <RoleSwitcher />
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/gigs" element={<GigCatalog />} />
          <Route path="/gigs/:gigId" element={<GigDetailRoute />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<FreelancerProfileRoute />} />
          <Route path="/projects" element={<ProjectsBoard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<MessagingPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/orders" element={<OrderDashboard />} />
          <Route path="/workspace/:orderId" element={<CollaborativeWorkspace />} />
          <Route path="/proposals" element={<ProposalManagement />} />
          <Route path="/ai" element={<AIToolsPlayground />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/disputes" element={<DisputePanel />} />
          <Route path="/admin/withdrawals" element={<WithdrawalApprovals />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      </ToastProvider>
    </AppProvider>
  );
}
