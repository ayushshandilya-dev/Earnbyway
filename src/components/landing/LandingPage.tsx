import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search, Code, Brain, Palette, PenTool, Video, Megaphone, Shield,
  Star, ArrowRight, CheckCircle, Wallet, Users, Trophy, Clock,
  Sparkles, Lock, ChevronRight, Layers, Eye, Zap, Globe
} from 'lucide-react';

interface Props {
  onExploreGigs: () => void;
  onExploreProjects: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const CATEGORIES = [
  { name: 'Development', icon: Code, jobs: 1240, color: 'from-blue-500 to-cyan-400' },
  { name: 'AI & ML', icon: Brain, jobs: 860, color: 'from-purple-500 to-pink-400' },
  { name: 'Graphic Design', icon: Palette, jobs: 950, color: 'from-orange-500 to-amber-400' },
  { name: 'Content Writing', icon: PenTool, jobs: 720, color: 'from-emerald-500 to-teal-400' },
  { name: 'Video Editing', icon: Video, jobs: 530, color: 'from-red-500 to-rose-400' },
  { name: 'Marketing', icon: Megaphone, jobs: 640, color: 'from-indigo-500 to-violet-400' },
  { name: 'UI/UX Design', icon: Layers, jobs: 780, color: 'from-pink-500 to-fuchsia-400' },
  { name: 'Cybersecurity', icon: Shield, jobs: 310, color: 'from-green-500 to-lime-400' },
];

const ESCROW_STEPS = [
  { icon: PenTool, title: 'Client Posts Project', desc: 'Define requirements & budget' },
  { icon: Users, title: 'Freelancer Applies', desc: 'Submit proposals with bids' },
  { icon: CheckCircle, title: 'Client Accepts', desc: 'Review & select best match' },
  { icon: Lock, title: 'Payment Escrow', desc: 'Funds locked securely' },
  { icon: Code, title: 'Work & Milestones', desc: 'Track progress in real-time' },
  { icon: Eye, title: 'Client Reviews', desc: 'Approve deliverables' },
  { icon: Wallet, title: 'Money Released', desc: 'Freelancer gets paid' },
  { icon: Star, title: 'Leave Review', desc: 'Rate the experience' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'CTO, NexaCloud',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'Earn By Way completely transformed how we hire developers. The escrow system gave us peace of mind, and the AI matching found us the perfect React engineer in under 24 hours.'
  },
  {
    name: 'Rahul Desai',
    role: 'Freelance Full Stack Dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'As a freelancer, the milestone payment system means I always get paid for my work. The platform analytics help me optimize my profile and win more projects.'
  },
  {
    name: 'Ananya Mehta',
    role: 'Product Manager, FinEdge',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'We hired a UI/UX designer through Earn By Way for our fintech app redesign. The quality of talent here is outstanding and the whole process was seamless.'
  }
];

export const LandingPage: React.FC<Props> = ({ onExploreGigs, onExploreProjects, searchQuery, setSearchQuery }) => {
  const { gigs, users, profiles } = useApp();
  const freelancers = users.filter(u => u.role === 'freelancer' && profiles[u.id]);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-4">
        {/* Animated background glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Freelance Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Hire the perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              freelancer.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connecting clients with talented freelancers worldwide. Post projects, hire experts,
            and pay securely through our escrow milestone system.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try: 'React developer under ₹25k' or 'Logo designer with 5★ rating'..."
              className="w-full pl-12 pr-14 py-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-colors">
              <Sparkles className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={onExploreGigs}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
            >
              Explore Gigs
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreProjects}
              className="flex items-center gap-2 px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all hover:scale-105"
            >
              Post a Project
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Freelancers', value: '10,000+', icon: Users },
              { label: 'Projects Done', value: '5,000+', icon: Trophy },
              { label: 'Paid Out', value: '₹2Cr+', icon: Wallet },
              { label: 'Avg Rating', value: '4.9★', icon: Star },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ POPULAR CATEGORIES ═══════════════════════ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white mb-3">Popular Categories</h2>
          <p className="text-sm text-zinc-400">Browse talent across 20+ professional categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={onExploreGigs}
              className="glass-card glass-card-hover rounded-2xl p-6 text-left group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} p-0.5 mb-4 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-zinc-500">{cat.jobs.toLocaleString()} active jobs</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ TOP FREELANCERS ═══════════════════════ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Top Freelancers</h2>
            <p className="text-sm text-zinc-400">Verified experts ready to start today</p>
          </div>
          <button onClick={onExploreGigs} className="flex items-center gap-1 text-sm text-emerald-400 hover:underline font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map(fl => {
            const prof = profiles[fl.id];
            if (!prof) return null;
            return (
              <div key={fl.id} className="glass-card glass-card-hover rounded-2xl overflow-hidden">
                {/* Banner strip */}
                <div className="h-20 bg-cover bg-center" style={{ backgroundImage: `url(${prof.banner})` }}>
                  <div className="w-full h-full bg-gradient-to-b from-transparent to-zinc-950/90" />
                </div>
                <div className="px-5 pb-5 -mt-8 relative z-10">
                  <img
                    src={fl.avatar}
                    alt={fl.name}
                    className="w-16 h-16 rounded-xl object-cover border-4 border-zinc-950 ring-2 ring-emerald-500/40 mb-3"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{fl.name}</h3>
                    {fl.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />}
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{prof.title}</p>

                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {prof.rating}
                    </span>
                    <span className="text-zinc-500">{prof.completedJobs} jobs</span>
                    <span className="text-emerald-400 font-semibold">₹{prof.hourlyRate}/hr</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prof.skills.slice(0, 4).map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Clock className="w-3 h-3" /> {prof.responseTime}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                      <Globe className="w-3 h-3" /> {fl.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════ POPULAR GIGS ═══════════════════════ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Popular Gigs</h2>
            <p className="text-sm text-zinc-400">Trending services from top-rated sellers</p>
          </div>
          <button onClick={onExploreGigs} className="flex items-center gap-1 text-sm text-emerald-400 hover:underline font-medium">
            Browse All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <button
              key={gig.id}
              onClick={onExploreGigs}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden text-left group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={gig.coverImage}
                  alt={gig.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <img src={gig.freelancerAvatar} alt="" className="w-7 h-7 rounded-lg object-cover border-2 border-zinc-950" />
                  <span className="text-[11px] text-white font-medium">{gig.freelancerName}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug">{gig.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {gig.rating}
                    </span>
                    <span className="text-zinc-500">({gig.reviewsCount})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">Starting at</span>
                    <span className="text-sm font-bold text-emerald-400">₹{gig.startingPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ HOW ESCROW WORKS ═══════════════════════ */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" /> Secure Escrow System
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-3">How It Works</h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">Our escrow milestone system ensures safe, transparent transactions for both clients and freelancers.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ESCROW_STEPS.map((step, i) => (
            <div key={i} className="relative group">
              <div className="glass-card rounded-2xl p-5 text-center group-hover:border-emerald-500/40 transition-colors h-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <step.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mb-1">STEP {i + 1}</div>
                <h4 className="text-xs font-semibold text-white mb-1">{step.title}</h4>
                <p className="text-[11px] text-zinc-500">{step.desc}</p>
              </div>
              {/* Connector arrow (hidden on last) */}
              {i < ESCROW_STEPS.length - 1 && (
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-700 hidden sm:block">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-white mb-3">What Our Users Say</h2>
          <p className="text-sm text-zinc-400">Trusted by thousands of clients and freelancers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="relative z-10">
            <Zap className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8">Join thousands of clients and freelancers already growing their businesses on Earn By Way.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={onExploreGigs} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25">
                Find a Freelancer
              </button>
              <button onClick={onExploreProjects} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-700 transition-all">
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
