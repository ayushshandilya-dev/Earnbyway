import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search, Code, Brain, Palette, PenTool, Video, Megaphone, Shield,
  Star, ArrowRight, CheckCircle, Wallet, Users, Trophy, Clock,
  Sparkles, Lock, ChevronRight, Layers, Eye, Zap, Globe,
  ShieldCheck, MessageSquare, BarChart3, HeadphonesIcon,
  Infinity, Quote, ArrowUpRight, Play, ChevronLeft,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Development', icon: Code, jobs: 1240, gradient: 'from-emerald-500 to-teal-400' },
  { name: 'AI & ML', icon: Brain, jobs: 860, gradient: 'from-violet-500 to-purple-400' },
  { name: 'Graphic Design', icon: Palette, jobs: 950, gradient: 'from-orange-500 to-amber-400' },
  { name: 'Content Writing', icon: PenTool, jobs: 720, gradient: 'from-blue-500 to-cyan-400' },
  { name: 'Video Editing', icon: Video, jobs: 530, gradient: 'from-rose-500 to-pink-400' },
  { name: 'Marketing', icon: Megaphone, jobs: 640, gradient: 'from-indigo-500 to-violet-400' },
  { name: 'UI/UX Design', icon: Layers, jobs: 780, gradient: 'from-fuchsia-500 to-pink-400' },
  { name: 'Cybersecurity', icon: Shield, jobs: 310, gradient: 'from-lime-500 to-green-400' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Secure Escrow Payments', desc: 'Funds are locked in escrow and released only when you approve deliverables, ensuring zero payment risk.' },
  { icon: Zap, title: 'AI-Powered Matching', desc: 'Our AI analyzes project requirements and freelancer profiles to find the perfect match in seconds.' },
  { icon: MessageSquare, title: 'Real-Time Communication', desc: 'Built-in messaging with read receipts, file sharing, and instant notifications keeps everyone in sync.' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track earnings, project performance, and profile views with interactive dashboards and insights.' },
  { icon: Globe, title: 'Global Talent Pool', desc: 'Access 10,000+ verified freelancers across 20+ categories from around the world.' },
  { icon: HeadphonesIcon, title: '24/7 Dedicated Support', desc: 'Our support team is available round the clock to resolve disputes and answer your questions.' },
];

const STATS = [
  { label: 'Active Freelancers', value: '10,000+', icon: Users },
  { label: 'Projects Completed', value: '5,000+', icon: Trophy },
  { label: 'Total Paid Out', value: '₹2Cr+', icon: Wallet },
  { label: 'Average Rating', value: '4.9★', icon: Star },
];

const ESCROW_STEPS = [
  { icon: PenTool, title: 'Post Project', desc: 'Define requirements & budget' },
  { icon: Users, title: 'Freelancer Applies', desc: 'Submit proposals with bids' },
  { icon: CheckCircle, title: 'Accept & Escrow', desc: 'Review & select, funds locked' },
  { icon: Code, title: 'Work & Milestones', desc: 'Track progress in real-time' },
  { icon: Eye, title: 'Review & Approve', desc: 'Approve deliverables' },
  { icon: Wallet, title: 'Payment Released', desc: 'Freelancer gets paid' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'CTO, NexaCloud', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', rating: 5, quote: 'Earn By Way completely transformed how we hire developers. The escrow system gave us peace of mind, and the AI matching found us the perfect React engineer in under 24 hours.' },
  { name: 'Rahul Desai', role: 'Freelance Full Stack Dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', rating: 5, quote: 'The milestone payment system means I always get paid for my work. The platform analytics help me optimize my profile and win more projects.' },
  { name: 'Ananya Mehta', role: 'Product Manager, FinEdge', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', rating: 5, quote: 'We hired a UI/UX designer through Earn By Way for our fintech app redesign. The quality of talent here is outstanding and the whole process was seamless.' },
  { name: 'Vikram Patel', role: 'Freelance AI Engineer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', rating: 5, quote: 'The AI-powered matching is incredible. I get project recommendations that perfectly align with my skills, and the escrow system ensures I never worry about payments.' },
];

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${visible ? 'animate-fade-up' : 'opacity-0 translate-y-6'} ${className}`}>{children}</div>;
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { gigs, users, profiles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const freelancers = users.filter(u => u.role === 'freelancer' && profiles[u.id]);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36 px-4">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/8 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-500/8 rounded-full blur-[140px] animate-pulse-slower" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-emerald-400/40 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-teal-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-emerald-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-fade-up shadow-lg shadow-emerald-500/5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Freelance Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 animate-fade-up text-balance">
            <span className="text-white">Hire the perfect</span>
            <br />
            <span className="gradient-text">freelancer.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-1 text-balance">
            Connecting clients with talented freelancers worldwide. Post projects, hire experts,
            and pay securely through our escrow milestone system.
          </p>

          <div className="animate-fade-up animate-fade-up-delay-2">
            <div className="relative max-w-xl mx-auto mb-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-xl">
                <Search className="absolute left-4 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/gigs?q=${encodeURIComponent(searchQuery.trim())}`); }}
                  placeholder="Try: 'React developer under ₹25k' or 'Logo designer with 5★ rating'..."
                  className="w-full pl-12 pr-14 py-4 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none" />
                <button onClick={() => { if (searchQuery.trim()) navigate(`/gigs?q=${encodeURIComponent(searchQuery.trim())}`); else navigate('/gigs'); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25">
                  <Sparkles className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <button onClick={() => navigate('/gigs')}
                className="group relative px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03]">
                Explore Gigs <ArrowRight className="w-4 h-4 inline group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate('/projects')}
                className="group px-8 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all hover:scale-[1.03] hover:shadow-lg">
                Post a Project <ChevronRight className="w-4 h-4 inline group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up animate-fade-up-delay-3">
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-5 text-center hover:border-emerald-500/30 transition-all hover:-translate-y-0.5 duration-300">
                <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST BADGES ═══════════════════════ */}
      <Section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[11px] text-zinc-600 uppercase tracking-[0.2em] font-semibold">Trusted by Industry Leaders</p>
        </div>
        <div className="glass-card-strong rounded-3xl p-8 sm:p-10 overflow-hidden">
          <div className="flex gap-12 sm:gap-16 items-center justify-center flex-wrap opacity-50">
            {['NexaCloud', 'FinEdge', 'TechVista', 'CloudPeak', 'DataForge', 'WebCraft'].map(name => (
              <div key={name} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-700/50">
                  <span className="text-xs font-bold text-zinc-500">{name[0]}</span>
                </div>
                <span className="text-sm font-semibold text-zinc-500">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════ WHY CHOOSE US ═══════════════════════ */}
      <Section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Infinity className="w-3.5 h-3.5" /> Why Earn By Way
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">Built for Modern Freelancing</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">Everything you need to hire top talent or grow your freelance career, all in one platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="group glass-card rounded-2xl p-6 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all duration-300">
                <f.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ CATEGORIES ═══════════════════════ */}
      <Section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">Popular Categories</h2>
          <p className="text-sm text-zinc-500">Browse talent across 20+ professional categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <button key={cat.name} onClick={() => navigate('/gigs')}
              className="group glass-card rounded-2xl p-6 text-left hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
              <p className="text-xs text-zinc-500">{cat.jobs.toLocaleString()} active jobs</p>
            </button>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ TOP FREELANCERS ═══════════════════════ */}
      <Section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">Top Freelancers</h2>
            <p className="text-sm text-zinc-500">Verified experts ready to start today</p>
          </div>
          <button onClick={() => navigate('/gigs')} className="hidden sm:flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.slice(0, 6).map(fl => {
            const prof = profiles[fl.id];
            if (!prof) return null;
            return (
              <div key={fl.id} className="group glass-card rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="h-20 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${prof.banner})` }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/60 to-zinc-950" />
                </div>
                <div className="px-5 pb-5 -mt-10 relative z-10">
                  <img src={fl.avatar} alt={fl.name} className="w-16 h-16 rounded-xl object-cover border-4 border-zinc-950 ring-2 ring-emerald-500/30 mb-3 group-hover:ring-emerald-500/50 transition-all" />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{fl.name}</h3>
                    {fl.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />}
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">{prof.title}</p>
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /> {prof.rating}</span>
                    <span className="text-zinc-500">{prof.completedJobs} jobs</span>
                    <span className="text-emerald-400 font-semibold">₹{prof.hourlyRate}/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prof.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-zinc-500"><Clock className="w-3 h-3" /> {prof.responseTime}</span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-500"><Globe className="w-3 h-3" /> {fl.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════════════════ POPULAR GIGS ═══════════════════════ */}
      <Section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">Popular Gigs</h2>
            <p className="text-sm text-zinc-500">Trending services from top-rated sellers</p>
          </div>
          <button onClick={() => navigate('/gigs')} className="hidden sm:flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-medium group">
            Browse All <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.slice(0, 6).map(gig => (
            <button key={gig.id} onClick={() => navigate('/gigs')}
              className="group glass-card rounded-2xl overflow-hidden text-left hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={gig.coverImage} alt={gig.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                  <img src={gig.freelancerAvatar} alt="" className="w-7 h-7 rounded-lg object-cover border-2 border-zinc-950 ring-1 ring-white/10" />
                  <span className="text-[11px] text-white font-medium drop-shadow-lg">{gig.freelancerName}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-2.5 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">{gig.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /> {gig.rating}</span>
                    <span className="text-zinc-500">({gig.reviewsCount})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">Starting at</span>
                    <span className="text-sm font-bold gradient-text">₹{gig.startingPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ HOW ESCROW WORKS ═══════════════════════ */}
      <Section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" /> Secure Escrow System
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">How It Works</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">Our escrow milestone system ensures safe, transparent transactions for both clients and freelancers.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {ESCROW_STEPS.map((step, i) => (
            <div key={i} className="relative group">
              <div className="glass-card rounded-2xl p-5 text-center hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all h-full">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                  <step.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mb-1 tracking-wider uppercase">Step {i + 1}</div>
                <h4 className="text-xs font-semibold text-white mb-1">{step.title}</h4>
                <p className="text-[11px] text-zinc-500">{step.desc}</p>
              </div>
              {i < ESCROW_STEPS.length - 1 && (
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-700 hidden lg:block">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <Section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">What Our Users Say</h2>
          <p className="text-sm text-zinc-500">Trusted by thousands of clients and freelancers worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="group glass-card rounded-2xl p-6 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="relative">
                <Quote className="w-6 h-6 text-emerald-500/20 absolute -top-1 -left-1" />
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 pl-4 italic">"{t.quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800/60">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-lg object-cover ring-2 ring-emerald-500/20" />
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <Section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="relative overflow-hidden glass-card-strong rounded-3xl p-10 sm:p-16">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 gradient-text" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto mb-10">
              Join thousands of clients and freelancers already growing their businesses on Earn By Way.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => navigate('/gigs')}
                className="group relative px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.03]">
                Find a Freelancer <ArrowRight className="w-4 h-4 inline group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => navigate('/projects')}
                className="group px-8 py-3.5 bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all hover:scale-[1.03] hover:shadow-lg">
                Become a Seller <ArrowUpRight className="w-4 h-4 inline group-hover:translate-x-0.5 -translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
