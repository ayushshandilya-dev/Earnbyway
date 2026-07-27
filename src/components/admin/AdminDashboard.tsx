import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Briefcase, DollarSign, Clock, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart as RePieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 280000 },
  { name: 'Feb', revenue: 450000 },
  { name: 'Mar', revenue: 380000 },
  { name: 'Apr', revenue: 620000 },
  { name: 'May', revenue: 550000 },
  { name: 'Jun', revenue: 780000 },
  { name: 'Jul', revenue: 520000 },
];

const categoryData = [
  { name: 'Development', value: 35 },
  { name: 'Design', value: 25 },
  { name: 'AI', value: 20 },
  { name: 'Writing', value: 10 },
  { name: 'Marketing', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export const AdminDashboard: React.FC = () => {
  const { users, projects, orders, withdrawals, disputes } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const openDisputes = disputes.filter(d => d.status === 'open').length;
  const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'hired').length;

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Platform overview & moderation tools</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-400' },
          { label: 'Active Projects', value: activeProjects, icon: Briefcase, color: 'from-purple-500 to-pink-400' },
          { label: 'Platform Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: 'from-emerald-500 to-teal-400' },
          { label: 'Pending Withdrawals', value: pendingWithdrawals, icon: Clock, color: 'from-amber-500 to-orange-400' },
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
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Revenue
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} labelStyle={{ color: '#fff' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" /> Categories Distribution
          </h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {c.name} {c.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Pending Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-xs text-zinc-300">Withdrawals to Review</span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold">{pendingWithdrawals} pending</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-xs text-zinc-300">Open Disputes</span>
              <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold">{openDisputes} open</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-xs text-zinc-300">Active Projects</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">{activeProjects} active</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'User Management', path: '/admin/users' },
              { label: 'Disputes', path: '/admin/disputes' },
              { label: 'Withdrawals', path: '/admin/withdrawals' },
              { label: 'Projects Overview', path: '/projects' },
            ].map(link => (
              <a key={link.label} href={link.path}
                className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/40 transition-colors text-xs text-zinc-300 hover:text-white text-center">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
