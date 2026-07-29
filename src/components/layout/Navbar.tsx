import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { requestNotificationPermission } from '../../utils/notifications';
import {
  Hexagon,
  Sparkles,
  Bell,
  MessageSquare,
  Search,
  PlusCircle,
  Menu,
  X,
  Home,
  Briefcase,
  Bookmark,
  ShoppingBag,
  FileText,
  LayoutDashboard,
  Wallet,
  Settings,
  Users,
  ShieldCheck,
  Bot,
  AppWindow,
  ArrowUpRight,
  Crown,
  BellRing
} from 'lucide-react';

interface Props {
  onOpenAuth: () => void;
  onOpenAITools: () => void;
  onOpenPostProject: () => void;
  onOpenCreateGig: () => void;
}

const NAV_ITEMS = [
  { path: '/gigs', label: 'Explore Gigs', icon: Briefcase },
  { path: '/projects', label: 'Projects Board', icon: AppWindow },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, requiresAuth: true },
  { path: '/orders', label: 'Orders', icon: ShoppingBag, requiresAuth: true },
  { path: '/proposals', label: 'Proposals', icon: FileText, requiresAuth: true, hideForFreelancer: true },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  { path: '/earnings', label: 'Earnings', icon: Wallet, requiresAuth: true, hideForClient: true },
  { path: '/profile', label: 'Profile', icon: Users, requiresAuth: true },
  { path: '/ai', label: 'AI Playground', icon: Bot },
  { path: '/admin', label: 'Admin', icon: ShieldCheck, requiresAdmin: true },
  { path: '/subscription', label: 'Subscription', icon: Crown, requiresAuth: true },
  { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
];

export const Navbar: React.FC<Props> = ({
  onOpenAuth,
  onOpenAITools,
  onOpenPostProject,
  onOpenCreateGig,
}) => {
  const { currentUser, currentRole, notifications, conversations } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [pushEnabled, setPushEnabled] = useState(() => {
    if (typeof Notification !== 'undefined') return Notification.permission === 'granted';
    return false;
  });

  useEffect(() => {
    if (pushEnabled) requestNotificationPermission();
  }, []);

  const unreadNotifs = notifications.filter(n => (n.userId === currentUser.id || currentRole === 'admin') && !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const isActive = (path: string) => location.pathname === path;

  const handleMobileNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const visibleNavItems = NAV_ITEMS.filter(item => {
    if (item.requiresAdmin && currentRole !== 'admin') return false;
    if (item.requiresAuth && currentRole === 'guest') return false;
    if ((item as any).hideForClient && currentRole === 'client') return false;
    if ((item as any).hideForFreelancer && currentRole === 'freelancer') return false;
    return true;
  });

  return (
    <header className="glass-panel border-b border-zinc-800/80 sticky top-9 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
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

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && searchInput.trim()) navigate(`/gigs?q=${encodeURIComponent(searchInput.trim())}`); }}
              placeholder="AI Natural Search: 'React dev under ₹25k'..."
              className="w-full pl-10 pr-12 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              onClick={onOpenAITools}
              aria-label="Open AI Tools"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-300">
          {visibleNavItems.slice(0, 6).map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-3 py-2 rounded-lg transition-colors ${isActive(item.path) ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'hover:text-white hover:bg-zinc-800/50'}`}
            >
              {item.label}
            </button>
          ))}
          {visibleNavItems.length > 6 && (
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">More...</button>
              <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="glass-panel rounded-2xl p-2 w-48 space-y-1 shadow-xl">
                  {visibleNavItems.slice(6).map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${isActive(item.path) ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}>
                      <item.icon className="w-3.5 h-3.5 text-zinc-500" /> {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAITools}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-all glow-emerald"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">AI Tools</span>
          </button>

          {currentRole === 'client' && (
            <button onClick={onOpenPostProject}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-md">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Project</span>
            </button>
          )}

          {currentRole === 'freelancer' && (
            <>
              {(!currentUser.proTier || currentUser.proTier === 'none') && (
                <button onClick={() => navigate('/subscription')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-black text-xs font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </button>
              )}
              <button onClick={onOpenCreateGig}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all shadow-md">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Gig</span>
              </button>
            </>
          )}

          {currentRole !== 'guest' && (
            <>
              <button onClick={() => navigate('/chat')} aria-label="Open messages"
                className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                {unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">{unreadMessages}</span>}
              </button>
              <button
                onClick={async () => {
                  const granted = await requestNotificationPermission();
                  setPushEnabled(granted);
                }}
                aria-label="Toggle push notifications"
                className={`p-2 rounded-xl border transition-colors ${pushEnabled ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                title={pushEnabled ? 'Push notifications enabled' : 'Enable push notifications'}
              >
                <BellRing className={`w-4 h-4 ${pushEnabled ? 'animate-pulse' : ''}`} />
              </button>
              <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} aria-label="Toggle notifications"
                  className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors">
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-extrabold rounded-full flex items-center justify-center">{unreadNotifs}</span>}
                </button>
                <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              </div>
            </>
          )}

          {currentRole === 'guest' ? (
            <button onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition-all">
              Sign In
            </button>
          ) : (
              <div onClick={() => navigate('/profile')}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
                <div className="relative">
                  <img src={currentUser.avatar} alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/40" />
                  {currentUser.proTier && currentUser.proTier !== 'none' && (
                    <span className={`absolute -top-1 -right-1 text-[7px] font-extrabold px-1 rounded-sm ${
                      currentUser.proTier === 'pro' ? 'bg-amber-500 text-black' :
                      currentUser.proTier === 'elite' ? 'bg-purple-500 text-white' :
                      'bg-emerald-500 text-black'
                    }`}>
                      {currentUser.proTier === 'pro' ? 'PRO' : currentUser.proTier === 'elite' ? 'ELITE' : 'STD'}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-semibold text-white block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-emerald-400 font-medium">₹{currentUser.balance.toLocaleString()} Available</span>
                </div>
              </div>
          )}

          <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"
            className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide-in mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[#121215] border-l border-zinc-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                <span className="font-heading font-bold text-white">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {currentUser && currentRole !== 'guest' && (
                <div onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 cursor-pointer mb-4">
                  <img src={currentUser.avatar} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/40" />
                  <div>
                    <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                    <div className="text-xs text-zinc-500">₹{currentUser.balance.toLocaleString()} Available</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 ml-auto" />
                </div>
              )}

              {visibleNavItems.map(item => (
                <button key={item.path} onClick={() => handleMobileNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive(item.path) ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'}`}>
                  <item.icon className="w-4 h-4 text-zinc-500" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-800 space-y-2">
              {currentRole === 'client' && (
                <button onClick={() => { onOpenPostProject(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-sm">
                  <PlusCircle className="w-4 h-4" /> Post a Project
                </button>
              )}
              {currentRole === 'freelancer' && (
                <button onClick={() => { onOpenCreateGig(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-sm">
                  <PlusCircle className="w-4 h-4" /> Create a Gig
                </button>
              )}
              <button onClick={() => { navigate('/subscription'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-black font-bold rounded-xl text-sm">
                <Crown className="w-4 h-4" /> {currentUser.proTier && currentUser.proTier !== 'none' ? 'Manage Plan' : 'Upgrade to PRO'}
              </button>
              <button onClick={() => { onOpenAITools(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 text-emerald-300 rounded-xl text-sm font-semibold">
                <Sparkles className="w-4 h-4" /> AI Tools
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
