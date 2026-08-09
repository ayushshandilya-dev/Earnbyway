import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { requestNotificationPermission } from '../../utils/notifications';
import { Avatar } from '../ui/Avatar';
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
  BellRing,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
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
  { path: '/profile', label: 'Profile', icon: User, requiresAuth: true },
  { path: '/ai', label: 'AI Playground', icon: Bot },
  { path: '/admin', label: 'Admin', icon: ShieldCheck, requiresAdmin: true },
  { path: '/subscription', label: 'Subscription', icon: Crown, requiresAuth: true },
  { path: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
];

const DASHBOARD_ACTIONS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Subscription', path: '/subscription', icon: CreditCard },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Navbar: React.FC<Props> = ({
  onOpenAuth,
  onOpenAITools,
  onOpenPostProject,
  onOpenCreateGig,
}) => {
  const { currentUser, currentRole, notifications, conversations, signOut } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [pushEnabled, setPushEnabled] = useState(() => {
    if (typeof Notification !== 'undefined') return Notification.permission === 'granted';
    return false;
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (pushEnabled) requestNotificationPermission();
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const unreadNotifs = notifications.filter(n => (n.userId === currentUser.id || currentRole === 'admin') && !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

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
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-xl shadow-black/20' : ''}`}>
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-[#121215]/95 backdrop-blur-2xl border-b border-zinc-800/60' : 'glass-panel border-b border-zinc-800/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-400 to-violet-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-violet-500/30 transition-all group-hover:scale-105 duration-300">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">EarnBy<span className="gradient-text">Way</span></span>
                {currentUser.proTier && currentUser.proTier !== 'none' && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    currentUser.proTier === 'pro' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    currentUser.proTier === 'elite' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {currentUser.proTier.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500 block -mt-1 hidden sm:block">Scalable Marketplace Platform</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && searchInput.trim()) navigate(`/gigs?q=${encodeURIComponent(searchInput.trim())}`); }}
                placeholder="AI Natural Search: 'React dev under ₹25k'..."
                className="w-full pl-10 pr-12 py-2.5 text-xs bg-zinc-900/80 border border-zinc-800 rounded-xl text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all group-focus-within:shadow-md group-focus-within:shadow-emerald-500/5"
              />
              <button
                onClick={onOpenAITools}
                aria-label="Open AI Tools"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-300">
            {visibleNavItems.slice(0, 5).map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold shadow-sm'
                    : 'hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
            {visibleNavItems.length > 5 && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-all flex items-center gap-1">
                  More <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-[#121215]/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-2 w-52 space-y-1 shadow-2xl shadow-black/40">
                    {visibleNavItems.slice(5).map(item => (
                      <button key={item.path} onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                          isActive(item.path)
                            ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                        }`}>
                        <item.icon className="w-3.5 h-3.5 text-zinc-500" /> {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* AI Tools (mobile) */}
            <button
              onClick={onOpenAITools}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-violet-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:border-violet-500/40 hover:bg-emerald-500/20 transition-all btn-3d"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Tools</span>
            </button>

            {currentRole === 'client' && (
              <button onClick={onOpenPostProject}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all btn-3d">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Project</span>
              </button>
            )}

            {currentRole === 'freelancer' && (
              <>
                {(!currentUser.proTier || currentUser.proTier === 'none') && (
                  <button onClick={() => navigate('/subscription')}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 text-black text-xs font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all btn-3d">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Upgrade</span>
                  </button>
                )}
                <button onClick={onOpenCreateGig}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all btn-3d">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Gig</span>
                </button>
              </>
            )}

            {currentRole !== 'guest' && (
              <>
                <button onClick={() => navigate('/chat')} aria-label="Open messages"
                  className="relative p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-black text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#09090b]">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>
                <button
                  onClick={async () => { const granted = await requestNotificationPermission(); setPushEnabled(granted); }}
                  aria-label="Toggle push notifications"
                  className={`p-2 rounded-xl border transition-all ${
                    pushEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                  title={pushEnabled ? 'Push notifications enabled' : 'Enable push notifications'}
                >
                  <BellRing className={`w-4 h-4 ${pushEnabled ? 'animate-pulse' : ''}`} />
                </button>
                <div className="relative">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} aria-label="Toggle notifications"
                    className="relative p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    <Bell className="w-4 h-4" />
                    {unreadNotifs > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-black text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#09090b]">
                        {unreadNotifs > 9 ? '9+' : unreadNotifs}
                      </span>
                    )}
                  </button>
                  <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </div>
              </>
            )}

            {currentRole === 'guest' ? (
              <button onClick={onOpenAuth}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-white transition-all hover:shadow-md">
                Sign In
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-zinc-800/60 transition-all border border-transparent hover:border-zinc-800"
                >
                  <div className="relative">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size="sm"
                      rounded="rounded-lg"
                      ring="ring-2 ring-emerald-500/30"
                    />
                    {currentUser.proTier && currentUser.proTier !== 'none' && (
                      <span className={`absolute -top-1.5 -right-1.5 text-[7px] font-extrabold px-1 rounded-sm ring-2 ring-[#09090b] ${
                        currentUser.proTier === 'pro' ? 'bg-amber-500 text-black' :
                        currentUser.proTier === 'elite' ? 'bg-purple-500 text-white' :
                        'bg-emerald-500 text-black'
                      }`}>
                        {currentUser.proTier === 'pro' ? 'PRO' : currentUser.proTier === 'elite' ? 'ELITE' : 'STD'}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">₹{currentUser.balance.toLocaleString()} Available</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 top-full pt-2 z-50 animate-scale-in">
                      <div className="bg-[#121215]/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl p-2 w-60 shadow-2xl shadow-black/40">
                        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800 mb-1">
                          <Avatar
                            src={currentUser.avatar}
                            name={currentUser.name}
                            size="md"
                            rounded="rounded-xl"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                          </div>
                        </div>
                        {DASHBOARD_ACTIONS.map(item => (
                          <button key={item.path} onClick={() => { navigate(item.path); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all">
                            <item.icon className="w-3.5 h-3.5 text-zinc-500" /> {item.label}
                          </button>
                        ))}
                        <div className="border-t border-zinc-800 my-1" />
                        <button onClick={() => { signOut(); setIsProfileOpen(false); navigate('/'); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"
              className="lg:hidden p-2 rounded-xl bg-zinc-900/80 text-zinc-300 border border-zinc-800">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[#121215] border-l border-zinc-800 shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                <span className="font-heading font-bold text-white">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {currentUser && currentRole !== 'guest' && (
                <div onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 cursor-pointer mb-4 hover:border-emerald-500/30 transition-all group">
                  <div className="relative">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size="md"
                      rounded="rounded-xl"
                      ring="ring-2 ring-emerald-500/30"
                    />
                    {currentUser.proTier && currentUser.proTier !== 'none' && (
                      <span className={`absolute -top-1.5 -right-1.5 text-[7px] font-extrabold px-1 rounded-sm ring-2 ring-zinc-900 ${
                        currentUser.proTier === 'pro' ? 'bg-amber-500 text-black' :
                        currentUser.proTier === 'elite' ? 'bg-purple-500 text-white' :
                        'bg-emerald-500 text-black'
                      }`}>
                        {currentUser.proTier.toUpperCase().slice(0, 3)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{currentUser.name}</div>
                    <div className="text-xs text-zinc-500">₹{currentUser.balance.toLocaleString()} Available</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 ml-auto group-hover:text-emerald-400 transition-colors" />
                </div>
              )}

              {visibleNavItems.map(item => (
                <button key={item.path} onClick={() => handleMobileNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive(item.path)
                      ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}>
                  <item.icon className="w-4 h-4 text-zinc-500" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-800 space-y-2">
              {currentRole === 'client' && (
                <button onClick={() => { onOpenPostProject(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all">
                  <PlusCircle className="w-4 h-4" /> Post a Project
                </button>
              )}
              {currentRole === 'freelancer' && (
                <button onClick={() => { onOpenCreateGig(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all">
                  <PlusCircle className="w-4 h-4" /> Create a Gig
                </button>
              )}
              <button onClick={() => { navigate('/subscription'); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-black font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                <Crown className="w-4 h-4" /> {currentUser.proTier && currentUser.proTier !== 'none' ? 'Manage Plan' : 'Upgrade to PRO'}
              </button>
              <button onClick={() => { onOpenAITools(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 border border-zinc-800 text-emerald-300 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all">
                <Sparkles className="w-4 h-4" /> AI Tools
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
