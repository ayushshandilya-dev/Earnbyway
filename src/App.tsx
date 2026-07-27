import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { GigCatalog } from './components/gigs/GigCatalog';
import { ProjectsBoard } from './components/projects/ProjectsBoard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { FreelancerDashboard } from './components/dashboards/FreelancerDashboard';
import { PlaceholderModal } from './components/ui/PlaceholderModal';
import { NotFoundPage } from './components/ui/NotFoundPage';
import { AppProvider, useApp } from './context/AppContext';

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
        <Outlet />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PlaceholderModal
        isOpen={isAIToolsOpen}
        onClose={() => setIsAIToolsOpen(false)}
        title="AI Tools Suite"
        description="Interactive AI playground is scheduled for Week 6 development."
        week="Week 6"
      />
      <PlaceholderModal
        isOpen={isPostProjectOpen}
        onClose={() => setIsPostProjectOpen(false)}
        title="Post a Project"
        description="Project Posting Wizard is scheduled for Week 3 development."
        week="Week 3"
      />
      <PlaceholderModal
        isOpen={isCreateGigOpen}
        onClose={() => setIsCreateGigOpen(false)}
        title="Create a Gig"
        description="Gig Creation Wizard is scheduled for Week 3 development."
        week="Week 3"
      />
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { currentRole } = useApp();

  if (currentRole === 'client') return <ClientDashboard />;
  if (currentRole === 'freelancer') return <FreelancerDashboard />;
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-zinc-400">Admin Dashboard</h2>
      <p className="text-sm text-zinc-600 mt-2">Coming in Week 6</p>
    </div>
  );
};

const ComingSoon: React.FC<{ title: string; week: string }> = ({ title, week }) => (
  <div className="p-8 text-center">
    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
      <Clock className="w-8 h-8 text-emerald-400" />
    </div>
    <h2 className="text-2xl font-bold text-zinc-300 mb-2">{title}</h2>
    <p className="text-sm text-zinc-600">Coming in {week}</p>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gigs" element={<GigCatalog />} />
          <Route path="/projects" element={<ProjectsBoard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ComingSoon title="Messages" week="Week 5" />} />
          <Route path="/profile" element={<ComingSoon title="Profile View" week="Week 3" />} />
          <Route path="/admin" element={<ComingSoon title="Admin Panel" week="Week 6" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
