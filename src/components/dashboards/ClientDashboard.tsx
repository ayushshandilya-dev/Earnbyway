import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { Briefcase, Clock, CheckCircle, DollarSign, TrendingUp, Activity, ArrowRight, PlusCircle, Sparkles, Star, Users as UsersIcon } from 'lucide-react';
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

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, orders, currentUser } = useApp();

  const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'hired').length;
  const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'under_review').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Client Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">Welcome back, {currentUser.name}</p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Post a Project
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: activeProjects, icon: Briefcase, color: 'from-blue-500 to-cyan-400' },
          { label: 'Active Orders', value: activeOrders, icon: Activity, color: 'from-purple-500 to-pink-400' },
          { label: 'Completed', value: completedOrders, icon: CheckCircle, color: 'from-emerald-500 to-teal-400' },
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: DollarSign, color: 'from-amber-500 to-orange-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} p-0.5`}>
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Spend
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="spent" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Project Activity
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
          <button className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {orders.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                <div>
                  <div className="text-sm font-medium text-white">{o.title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{o.freelancerName} · {o.createdAt}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-400">₹{o.totalPrice.toLocaleString()}</div>
                  <div className={`text-[10px] font-medium ${
                    o.status === 'completed' ? 'text-emerald-400' :
                    o.status === 'in_progress' ? 'text-blue-400' :
                    'text-amber-400'
                  }`}>
                    {o.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        <button onClick={() => navigate('/search')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {freelancers.map(({ user, profile, matchPercentage, reason }) => (
          <div key={user.id} onClick={() => navigate(`/search`)}
            className="glass-card rounded-2xl p-5 hover:border-emerald-500/40 transition-all cursor-pointer group">
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
              <span className="text-emerald-400 font-semibold">{matchPercentage}% Match</span>
            </div>
            <p className="text-[10px] text-zinc-500 line-clamp-2">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
