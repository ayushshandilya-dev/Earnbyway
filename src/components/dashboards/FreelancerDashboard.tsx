import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  DollarSign, TrendingUp, Briefcase, Eye, Star, Clock, CheckCircle, ArrowRight,
  PlusCircle, Users, Award, Sparkles, Zap, Wallet, Activity, Target, BarChart3
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const earningsData = [
  { name: 'Jan', earnings: 45000, orders: 3 },
  { name: 'Feb', earnings: 62000, orders: 4 },
  { name: 'Mar', earnings: 38000, orders: 2 },
  { name: 'Apr', earnings: 85000, orders: 5 },
  { name: 'May', earnings: 72000, orders: 4 },
  { name: 'Jun', earnings: 95000, orders: 6 },
  { name: 'Jul', earnings: 54000, orders: 3 },
];

const StatCard: React.FC<{
  label: string; value: string; sub?: string; icon: React.ReactNode; gradient: string;
}> = ({ label, value, sub, icon, gradient }) => (
  <Card hover>
    <CardHeader>
      <span className="text-xs text-zinc-400">{label}</span>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} p-0.5`}>
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
          {icon}
        </div>
      </div>
    </CardHeader>
    <div className="text-2xl font-bold text-white">{value}</div>
    {sub && <div className="text-[10px] text-zinc-500 mt-1">{sub}</div>}
  </Card>
);

const chartTooltipStyle = {
  contentStyle: { background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' },
  labelStyle: { color: '#fff' },
};

export const FreelancerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, orders, profiles, projects } = useApp();
  const myProfile = profiles[currentUser.id];

  const activeOrders = orders.filter(o => o.freelancerId === currentUser.id && (o.status === 'in_progress' || o.status === 'under_review')).length;
  const completedOrders = orders.filter(o => o.freelancerId === currentUser.id && o.status === 'completed').length;
  const totalEarned = orders.filter(o => o.freelancerId === currentUser.id).reduce((sum, o) => sum + o.totalPrice, 0);
  const openProjects = projects.filter(p => p.status === 'open').length;

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Freelancer Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Welcome back, {currentUser.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<DollarSign className="w-4 h-4" />} onClick={() => navigate('/earnings')}>
            Withdraw
          </Button>
          <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={() => navigate('/gigs')}>
            Create Gig
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Available Balance"
          value={`₹${currentUser.balance.toLocaleString()}`}
          sub={`₹${currentUser.pendingBalance.toLocaleString()} pending`}
          icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
          gradient="from-emerald-500 to-teal-400"
        />
        <StatCard
          label="Active Orders"
          value={String(activeOrders)}
          icon={<Briefcase className="w-4 h-4 text-blue-400" />}
          gradient="from-blue-500 to-cyan-400"
        />
        {myProfile && (
          <>
            <StatCard
              label="Rating"
              value={String(myProfile.rating)}
              sub={`${myProfile.completedJobs} jobs done`}
              icon={<Star className="w-4 h-4 text-amber-400" />}
              gradient="from-amber-500 to-orange-400"
            />
            <StatCard
              label="Profile Views"
              value={String(myProfile.profileViewsThisMonth)}
              sub="this month"
              icon={<Eye className="w-4 h-4 text-purple-400" />}
              gradient="from-purple-500 to-pink-400"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardTitle icon={<TrendingUp className="w-4 h-4" />}>
            Monthly Earnings
            <Badge variant="emerald" className="ml-auto">+12.5%</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardTitle icon={<Award className="w-4 h-4" />}>
            Orders Completed
            <Badge variant="blue" className="ml-auto">This Year</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardTitle icon={<Activity className="w-4 h-4 text-emerald-400" />}>Your Stats</CardTitle>
          {myProfile && (
            <div className="space-y-4 mt-4">
              {[
                { label: 'Response Rate', value: `${myProfile.responseRate}%`, color: 'bg-emerald-500' },
                { label: 'On-Time Delivery', value: myProfile.avgDeliveryTime, color: 'bg-blue-500' },
                { label: 'Proposal Success', value: `${myProfile.proposalSuccessRate}%`, color: 'bg-purple-500' },
                { label: 'Total Earned', value: `₹${myProfile.totalEarned.toLocaleString()}`, color: 'bg-amber-500' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between py-2 border-b border-zinc-800/40 last:border-0">
                  <span className="text-sm text-zinc-400">{stat.label}</span>
                  <span className="text-sm text-white font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={<Target className="w-4 h-4 text-emerald-400" />}>Open Projects</CardTitle>
            <Badge variant="emerald">{openProjects} available</Badge>
          </CardHeader>
          <p className="text-sm text-zinc-500 mb-5 mt-2">Browse new projects that match your skills and expertise.</p>
          <div className="space-y-3">
            {projects.filter(p => p.status === 'open').slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                <div>
                  <div className="text-xs font-medium text-white">{p.title}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Budget: ₹{p.budget.toLocaleString()}</div>
                </div>
                <Badge variant="emerald">Open</Badge>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full" onClick={() => navigate('/projects')}>
              Browse All Projects <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      </div>

      {/* AI Talent Recommendations */}
      <AITalentRecommendations />
    </div>
  );
};

const AITalentRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { projects, currentUser, users, profiles } = useApp();

  const recommendations = useMemo(() => {
    const openProjs = projects.filter(p => p.status === 'open');
    if (openProjs.length === 0 || !currentUser) return [];
    const currentProfile = profiles[currentUser.id];
    if (!currentProfile) return [];
    const user = users.find(u => u.id === currentUser.id);
    if (!user) return [];
    return openProjs.slice(0, 3).map(proj => ({
      project: proj,
      match: AIService.generateProposal(proj, currentProfile, user)
    }));
  }, [projects, currentUser, users, profiles]);

  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-heading font-bold text-white">AI Recommended Projects</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {recommendations.map(({ project, match }) => (
          <Card key={project.id} hover padding="md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{project.title}</h3>
              <Badge variant="emerald">₹{project.budget.toLocaleString()}</Badge>
            </div>
            <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <Zap className="w-3 h-3" /> {match.suggestedBid.toLocaleString()} suggested bid
              </span>
              <span className="text-[10px] text-zinc-500">· {match.suggestedDays} days</span>
            </div>
            <Button variant="outline" size="xs" className="w-full" onClick={() => navigate('/projects')}>
              View Project <ArrowRight className="w-3 h-3" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
