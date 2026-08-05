import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Reveal, Stagger } from '../ui/Reveal';
import {
  Briefcase, Clock, CheckCircle, DollarSign, TrendingUp, Activity, ArrowRight,
  PlusCircle, Sparkles, Star, Users as UsersIcon, Target, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const monthlyData = [
  { name: 'Jan', spent: 12000, projects: 2 },
  { name: 'Feb', spent: 45000, projects: 3 },
  { name: 'Mar', spent: 28000, projects: 2 },
  { name: 'Apr', spent: 62000, projects: 4 },
  { name: 'May', spent: 35000, projects: 3 },
  { name: 'Jun', spent: 78000, projects: 5 },
  { name: 'Jul', spent: 52000, projects: 3 },
];

const chartTooltipStyle = {
  contentStyle: { background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' },
  labelStyle: { color: '#fff' },
};

const StatCard: React.FC<{
  label: string; value: string | number; icon: React.ReactNode; gradient: string;
}> = ({ label, value, icon, gradient }) => (
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
  </Card>
);

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, orders, currentUser } = useApp();

  const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'hired').length;
  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'under_review').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      {/* Header */}
      <Reveal direction="down" duration={0.6}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white">Client Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Welcome back, {currentUser.name}</p>
          </div>
          <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={() => navigate('/projects')}>
            Post a Project
          </Button>
        </div>
      </Reveal>

      {/* Stats */}
      <Stagger staggerBy={0.08}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Projects" value={activeProjects} icon={<Briefcase className="w-4 h-4 text-blue-400" />} gradient="from-blue-500 to-cyan-400" />
          <StatCard label="Active Orders" value={activeOrders} icon={<Activity className="w-4 h-4 text-purple-400" />} gradient="from-purple-500 to-pink-400" />
          <StatCard label="Completed" value={completedOrders} icon={<CheckCircle className="w-4 h-4 text-emerald-400" />} gradient="from-emerald-500 to-teal-400" />
          <StatCard label="Total Spent" value={`₹${totalSpent.toLocaleString()}`} icon={<DollarSign className="w-4 h-4 text-amber-400" />} gradient="from-amber-500 to-orange-400" />
        </div>
      </Stagger>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardTitle icon={<TrendingUp className="w-4 h-4" />}>
            Monthly Spend
            <Badge variant="emerald" className="ml-auto">+8.3%</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="spent" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardTitle icon={<Activity className="w-4 h-4" />}>
            Project Activity
            <Badge variant="blue" className="ml-auto">This Year</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle icon={<Target className="w-4 h-4 text-emerald-400" />}>Recent Orders</CardTitle>
          <Button variant="ghost" size="xs" onClick={() => navigate('/orders')}>
            View All <ArrowRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">No orders yet. Post a project to get started.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/60 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    o.status === 'completed' ? 'bg-emerald-500' :
                    o.status === 'in_progress' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-white">{o.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{o.freelancerName} · {o.createdAt}</div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="text-sm font-semibold text-emerald-400">₹{o.totalPrice.toLocaleString()}</div>
                  <Badge variant={
                    o.status === 'completed' ? 'emerald' :
                    o.status === 'in_progress' ? 'blue' : 'amber'
                  }>
                    {o.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* AI Recommended Freelancers */}
      <AIRecommendedFreelancers />
    </div>
  );
};

const AIRecommendedFreelancers: React.FC = () => {
  const navigate = useNavigate();
  const { users, profiles, projects } = useApp();

  const freelancers = useMemo(() => {
    const freelancerUsers = users.filter(u => u.role === 'freelancer' && profiles[u.id]);
    const lastProject = projects.filter(p => p.status === 'open').slice(0, 1);
    const brief = lastProject.length > 0 ? lastProject[0].description : 'full stack developer';
    return AIService.matchFreelancers(brief, profiles, freelancerUsers).slice(0, 3);
  }, [users, profiles, projects]);

  if (freelancers.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-heading font-bold text-white">AI Recommended Freelancers</h2>
        </div>
        <Button variant="ghost" size="xs" onClick={() => navigate('/search')}>
          View All <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {freelancers.map(({ user, profile, matchPercentage, reason }) => (
          <Card key={user.id} hover padding="md" onClick={() => navigate('/search')}>
            <div className="flex items-center gap-3 mb-3">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30" />
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{user.name}</h3>
                <p className="text-[10px] text-zinc-500">{profile.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs mb-3">
              <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3 fill-amber-400" /> {profile.rating}</span>
              <span className="text-zinc-500">{profile.completedJobs} jobs</span>
              <Badge variant="emerald">{matchPercentage}% Match</Badge>
            </div>
            <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{reason}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
