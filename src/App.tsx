import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { GigCatalog } from './components/gigs/GigCatalog';
import { ProjectsBoard } from './components/projects/ProjectsBoard';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { FreelancerDashboard } from './components/dashboards/FreelancerDashboard';
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
      {isAIToolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121215] p-8 rounded-xl border border-zinc-800 text-center max-w-md w-full relative">
            <button onClick={() => setIsAIToolsOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold mb-2">AI Tools Suite</h2>
            <p className="text-zinc-400">Interactive AI playground is scheduled for Week 6 development.</p>
          </div>
        </div>
      )}
      {isPostProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121215] p-8 rounded-xl border border-zinc-800 text-center max-w-md w-full relative">
            <button onClick={() => setIsPostProjectOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold mb-2">Post a Project</h2>
            <p className="text-zinc-400">Project Posting Wizard is scheduled for Week 3 development.</p>
          </div>
        </div>
      )}
      {isCreateGigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121215] p-8 rounded-xl border border-zinc-800 text-center max-w-md w-full relative">
            <button onClick={() => setIsCreateGigOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold mb-2">Create a Gig</h2>
            <p className="text-zinc-400">Gig Creation Wizard is scheduled for Week 3 development.</p>
          </div>
        </div>
      )}
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

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gigs" element={<GigCatalog />} />
          <Route path="/projects" element={<ProjectsBoard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-400">Messages</h2>
              <p className="text-sm text-zinc-600 mt-2">Coming in Week 5</p>
            </div>
          } />
          <Route path="/profile" element={
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-400">Profile View</h2>
              <p className="text-sm text-zinc-600 mt-2">Coming in Week 3</p>
            </div>
          } />
          <Route path="/admin" element={
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-zinc-400">Admin Panel</h2>
              <p className="text-sm text-zinc-600 mt-2">Coming in Week 6</p>
            </div>
          } />
        </Route>
      </Routes>
    </AppProvider>
  );
}
