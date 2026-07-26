import React, { useState } from 'react';
import { RoleSwitcher } from './components/layout/RoleSwitcher';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { GigCatalog } from './components/gigs/GigCatalog';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAIToolsOpen, setIsAIToolsOpen] = useState(false);
  const [isPostProjectOpen, setIsPostProjectOpen] = useState(false);
  const [isCreateGigOpen, setIsCreateGigOpen] = useState(false);

  // Render view based on active tab
  const renderView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onExploreGigs={() => setActiveTab('gigs')}
            onExploreProjects={() => setActiveTab('projects')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'gigs':
        return <GigCatalog />;
      case 'projects':
        return <div className="p-8"><h2 className="text-2xl font-bold">Projects Board (Coming Soon)</h2></div>;
      case 'dashboard':
        return <div className="p-8"><h2 className="text-2xl font-bold">{currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Dashboard (Coming Soon)</h2></div>;
      case 'chat':
        return <div className="p-8"><h2 className="text-2xl font-bold">Messages (Coming Soon)</h2></div>;
      case 'profile':
        return <div className="p-8"><h2 className="text-2xl font-bold">Profile View (Coming Soon)</h2></div>;
      case 'admin':
        return <div className="p-8"><h2 className="text-2xl font-bold">Admin Panel (Coming Soon)</h2></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-black">
      <RoleSwitcher />
      
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAITools={() => setIsAIToolsOpen(true)}
        onOpenPostProject={() => setIsPostProjectOpen(true)}
        onOpenCreateGig={() => setIsCreateGigOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        {renderView()}
      </main>
      
      <Footer />
      
      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      {/* Placeholders for other modals */}
      {isAIToolsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121215] p-8 rounded-xl border border-zinc-800 text-center max-w-md w-full relative">
            <button onClick={() => setIsAIToolsOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold mb-2">AI Tools Suite</h2>
            <p className="text-zinc-400">Interactive AI playground is scheduled for Week 5 development.</p>
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
            <p className="text-zinc-400">Gig Creation Wizard is scheduled for Week 2 development.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
