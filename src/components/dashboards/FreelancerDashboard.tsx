import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, Briefcase, Eye, Star, Clock, CheckCircle, ArrowRight, PlusCircle, Users, Award } from 'lucide-react';
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

export const FreelancerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, orders, profiles, projects } = useApp();
  const myProfile = profiles[currentUser.id];

  const activeOrders = orders.filter(o => o.freelancerId === currentUser.id && (o.status === 'in_progress' || o.status === 'under_review')).length;
  const completedOrders = orders.filter(o => o.freelancerId === currentUser.id && o.status === 'completed').length;
  const totalEarned = orders.filter(o => o.freelancerId === currentUser.id).reduce((sum, o) => sum + o.totalPrice, 0);
  const openProjects = projects.filter(p => p.status === 'open').length;

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Freelancer Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">Welcome back, {currentUser.name}</p>
        </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/earnings')}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all text-sm border border-zinc-700"
            >
              <DollarSign className="w-4 h-4" /> Withdraw
            </button>
            <button
              onClick={() => navigate('/gigs')}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm"
            >
              <PlusCircle className="w-4 h-4" /> Create Gig
            </button>
          </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 p-0.5">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">₹{currentUser.balance.toLocaleString()}</div>
          <div className="text-[10px] text-zinc-500 mt-1">₹{currentUser.pendingBalance.toLocaleString()} pending</div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400">Active Orders</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{activeOrders}</div>
        </div>

        {myProfile && (
          <>
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-400">Rating</span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 p-0.5">
                  <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{myProfile.rating}</div>
              <div className="text-[10px] text-zinc-500 mt-1">{myProfile.completedJobs} jobs done</div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-400">Profile Views</span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 p-0.5">
                  <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                    <Eye className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{myProfile.profileViewsThisMonth}</div>
              <div className="text-[10px] text-zinc-500 mt-1">this month</div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Earnings
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Orders Completed
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Your Stats</h3>
          {myProfile && (
            <div className="space-y-4">
              {[
                { label: 'Response Rate', value: `${myProfile.responseRate}%`, color: 'bg-emerald-500' },
                { label: 'On-Time Delivery', value: myProfile.avgDeliveryTime, color: 'bg-blue-500' },
                { label: 'Proposal Success', value: `${myProfile.proposalSuccessRate}%`, color: 'bg-purple-500' },
                { label: 'Total Earned', value: `₹${myProfile.totalEarned.toLocaleString()}`, color: 'bg-amber-500' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">{stat.label}</span>
                  <span className="text-white font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Open Projects</h3>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
              <Users className="w-3 h-3" /> {openProjects} available
            </span>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Browse new projects that match your skills.</p>
          <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-white font-medium transition-colors flex items-center justify-center gap-2">
            Browse Projects <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
