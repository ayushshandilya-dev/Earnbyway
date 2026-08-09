import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Users, Shield, DollarSign, Activity, TrendingUp, ArrowRight, BarChart3, PieChart, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 85000, users: 120 },
  { name: 'Feb', revenue: 102000, users: 145 },
  { name: 'Mar', revenue: 95000, users: 132 },
  { name: 'Apr', revenue: 128000, users: 168 },
  { name: 'May', revenue: 115000, users: 155 },
  { name: 'Jun', revenue: 142000, users: 180 },
  { name: 'Jul', revenue: 138000, users: 172 },
];

const chartTooltipStyle = {
  contentStyle: { background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' },
  labelStyle: { color: '#fff' },
};

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode; gradient: string; sub?: string }> = ({ label, value, icon, gradient, sub }) => (
  <Card hover>
    <CardHeader>
      <span className="text-xs text-zinc-400">{label}</span>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} p-0.5`}>
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">{icon}</div>
      </div>
    </CardHeader>
    <div className="text-2xl font-bold text-white">{value}</div>
    {sub && <div className="text-[10px] text-zinc-500 mt-1">{sub}</div>}
  </Card>
);

const QuickLink: React.FC<{ label: string; path: string; icon: React.ReactNode; gradient: string }> = ({ label, path, icon, gradient }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)}
      className="card-3d-tilt glossy glass-card rounded-2xl p-5 text-left hover:border-teal-500/40 transition-all group aurora-top">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-0.5 mb-4`}>
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-teal-300 transition-colors">{label}</h3>
      <p className="text-xs text-zinc-500">Manage &amp; oversee</p>
    </button>
  );
};

export const AdminDashboard: React.FC = () => {
  const { users, orders, projects } = useApp();
  const navigate = useNavigate();

  const totalUsers = users.length;
  const activeOrders = orders.filter(o => o.status === 'in_progress').length;
  const openProjects = projects.filter(p => p.status === 'open').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Platform overview and management</p>
        </div>
        <Badge variant="emerald" size="md" dot>All systems operational</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(totalUsers)} icon={<Users className="w-4 h-4 text-blue-400" />} gradient="from-blue-500 to-cyan-400" />
        <StatCard label="Active Orders" value={String(activeOrders)} icon={<Activity className="w-4 h-4 text-purple-400" />} gradient="from-purple-500 to-pink-400" />
        <StatCard label="Open Projects" value={String(openProjects)} icon={<Shield className="w-4 h-4 text-emerald-400" />} gradient="from-emerald-500 to-teal-400" />
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<DollarSign className="w-4 h-4 text-amber-400" />} gradient="from-amber-500 to-orange-400" sub="Platform all-time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardTitle icon={<BarChart3 className="w-4 h-4" />}>
            Platform Revenue
            <Badge variant="emerald" className="ml-auto">+16.2%</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <CardTitle icon={<TrendingUp className="w-4 h-4" />}>
            User Growth
            <Badge variant="blue" className="ml-auto">+14.5%</Badge>
          </CardTitle>
          <div className="h-52 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="users" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-heading font-bold text-white mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickLink label="User Management" path="/admin/users" icon={<Users className="w-5 h-5 text-blue-400" />} gradient="from-blue-500 to-cyan-400" />
          <QuickLink label="Dispute Panel" path="/admin/disputes" icon={<Shield className="w-5 h-5 text-amber-400" />} gradient="from-amber-500 to-orange-400" />
          <QuickLink label="Withdrawals" path="/admin/withdrawals" icon={<DollarSign className="w-5 h-5 text-emerald-400" />} gradient="from-emerald-500 to-teal-400" />
          <QuickLink label="Analytics" path="/admin" icon={<PieChart className="w-5 h-5 text-purple-400" />} gradient="from-purple-500 to-pink-400" />
        </div>
      </div>
    </div>
  );
};
