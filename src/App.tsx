import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { GigCatalog } from './components/gigs/GigCatalog';
import { ProjectsBoard } from './components/projects/ProjectsBoard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { FreelancerDashboard } from './components/dashboards/FreelancerDashboard';
import { MessagingPage } from './components/chat/MessagingPage';
import { EarningsPage } from './components/earnings/EarningsPage';
import { SearchResults } from './components/search/SearchResults';
import { BookmarksPage } from './components/bookmarks/BookmarksPage';
import { CreateGigWizard } from './components/gigs/CreateGigWizard';
import { PostProjectWizard } from './components/projects/PostProjectWizard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { DisputePanel } from './components/admin/DisputePanel';
import { WithdrawalApprovals } from './components/admin/WithdrawalApprovals';
import { OrderDashboard } from './components/orders/OrderDashboard';
import { ProposalManagement } from './components/proposals/ProposalManagement';
import { SettingsPage } from './components/settings/SettingsPage';
import { AIToolsPlayground } from './components/ai/AIToolsPlayground';
import { NotFoundPage } from './components/ui/NotFoundPage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ProfilePage } from './components/profiles/ProfilePage';
import { AppProvider, useApp } from './context/AppContext';

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
  </div>
);

const AppLayout: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [isPostProjectOpen, setIsPostProjectOpen] = useState(false);
  const [isCreateGigOpen, setIsCreateGigOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      <RoleSwitcher />
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAITools={() => setIsAIToolsOpen(true)}
        onOpenPostProject={() => setIsPostProjectOpen(true)}
        onOpenCreateGig={() => setIsCreateGigOpen(true)}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      {isAIToolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setIsAIToolsOpen(false)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-heading font-bold text-white">AI Tools Playground</h2>
              <button onClick={() => setIsAIToolsOpen(false)} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <AIToolsPlayground />
          </div>
        </div>
      )}
      <PostProjectWizard
        isOpen={isPostProjectOpen}
        onClose={() => setIsPostProjectOpen(false)}
      />
      <CreateGigWizard
        isOpen={isCreateGigOpen}
        onClose={() => setIsCreateGigOpen(false)}
      />
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
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gigs" element={<GigCatalog />} />
          <Route path="/projects" element={<ProjectsBoard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<MessagingPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrderDashboard />} />
          <Route path="/proposals" element={<ProposalManagement />} />
          <Route path="/ai" element={<AIToolsPlayground />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/disputes" element={<DisputePanel />} />
          <Route path="/admin/withdrawals" element={<WithdrawalApprovals />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
