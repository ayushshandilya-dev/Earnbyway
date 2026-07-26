import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { 
  Hexagon, 
  Sparkles, 
  Bell, 
  MessageSquare, 
  Search, 
  PlusCircle, 
  Briefcase, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut,
  Wallet,
  Menu,
  X
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenAITools: () => void;
  onOpenPostProject: () => void;
  onOpenCreateGig: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenAITools,
  onOpenPostProject,
  onOpenCreateGig,
  searchQuery,
  setSearchQuery
}) => {
  const { currentUser, currentRole, notifications, conversations } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => (n.userId === currentUser.id || currentRole === 'admin') && !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="glass-panel border-b border-zinc-800/80 sticky top-9 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('landing')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">EarnBy<span className="text-emerald-400">Way</span></span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">PRO</span>
            </div>
            <span className="text-[10px] text-zinc-400 block -mt-1 hidden sm:block">Scalable Marketplace Platform</span>
          </div>
        </div>

        {/* Global Search Bar with AI Indicator */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="AI Natural Search: 'React dev under ₹25k' or 'Figma UX'..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              onClick={onOpenAITools}
              title="Use AI Smart Natural Search Assistant"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-300">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'gigs' ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'hover:text-white hover:bg-zinc-800/50'}`}
          >
            Explore Gigs
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'projects' ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'hover:text-white hover:bg-zinc-800/50'}`}
          >
            Projects Board
          </button>

          {currentRole !== 'guest' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'hover:text-white hover:bg-zinc-800/50'}`}
            >
              Dashboard
            </button>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'admin' ? 'text-amber-400 bg-amber-500/10 font-semibold' : 'hover:text-white hover:bg-zinc-800/50'}`}
            >
              Admin Moderation
            </button>
          )}
        </nav>

        {/* Action Buttons & Profile Controls */}
        <div className="flex items-center gap-2.5">
          {/* AI Tools Modal Button */}
          <button
            onClick={onOpenAITools}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-all glow-emerald"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI Tools</span>
          </button>

          {/* Conditional Role Action Button */}
          {currentRole === 'client' && (
            <button
              onClick={onOpenPostProject}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Project</span>
            </button>
          )}

          {currentRole === 'freelancer' && (
            <button
              onClick={onOpenCreateGig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Gig</span>
            </button>
          )}

          {/* Messages Counter Icon */}
          {currentRole !== 'guest' && (
            <button
              onClick={() => setActiveTab('chat')}
              className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
          )}

          {/* Notification Bell */}
          {currentRole !== 'guest' && (
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center animate-ping-once">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
          )}

          {/* User Profile Avatar / Login Button */}
          {currentRole === 'guest' ? (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition-all"
            >
              Sign In
            </button>
          ) : (
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/40"
              />
              <div className="hidden lg:block text-left">
                <span className="text-xs font-semibold text-white block leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-emerald-400 font-medium">₹{currentUser.balance.toLocaleString()} Available</span>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs or projects..."
            className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white mb-2"
          />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => { setActiveTab('gigs'); setIsMobileMenuOpen(false); }} className="p-2 bg-zinc-900 rounded-lg text-left text-zinc-300">Explore Gigs</button>
            <button onClick={() => { setActiveTab('projects'); setIsMobileMenuOpen(false); }} className="p-2 bg-zinc-900 rounded-lg text-left text-zinc-300">Projects Board</button>
            <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className="p-2 bg-zinc-900 rounded-lg text-left text-zinc-300">Dashboard</button>
            <button onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }} className="p-2 bg-zinc-900 rounded-lg text-left text-zinc-300">Messages</button>
          </div>
        </div>
      )}
    </header>
  );
};
