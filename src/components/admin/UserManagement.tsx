import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShieldCheck, ShieldOff, CheckCircle, XCircle, Mail, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, profiles, adminToggleVerifyUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'freelancer' | 'admin'>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">User Management</h1>
        <p className="text-sm text-zinc-400 mt-1">{users.length} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'client', 'freelancer', 'admin'] as const).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                roleFilter === r ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white'
              }`}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.map(u => {
          const isExpanded = expandedUser === u.id;
          const prof = profiles[u.id];
          return (
            <div key={u.id} className="glass-card rounded-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <img src={u.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{u.name}</span>
                    {u.isVerified && <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      u.role === 'freelancer' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>{u.role}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {u.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {u.joinedDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adminToggleVerifyUser(u.id)}
                    className={`p-2 rounded-lg border transition-all text-xs ${
                      u.isVerified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                    }`} aria-label={u.isVerified ? 'Unverify user' : 'Verify user'}>
                    {u.isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setExpandedUser(isExpanded ? null : u.id)} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && prof && (
                <div className="px-4 pb-4 border-t border-zinc-800/60 pt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-zinc-900/50">
                      <span className="text-zinc-500 block">Rating</span>
                      <span className="text-white font-semibold">{prof.rating}★</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/50">
                      <span className="text-zinc-500 block">Jobs</span>
                      <span className="text-white font-semibold">{prof.completedJobs}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/50">
                      <span className="text-zinc-500 block">Earned</span>
                      <span className="text-white font-semibold">₹{prof.totalEarned.toLocaleString()}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900/50">
                      <span className="text-zinc-500 block">Rate</span>
                      <span className="text-white font-semibold">₹{prof.hourlyRate}/hr</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      prof.availability === 'Full-time' ? 'bg-emerald-500/10 text-emerald-400' :
                      prof.availability === 'Part-time' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>{prof.availability}</span>
                    <span className="text-[10px] text-zinc-500">Response: {prof.responseTime}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-medium hover:bg-red-500/20 transition-colors">
                      <XCircle className="w-3 h-3 inline mr-1" />Suspend Account
                    </button>
                  </div>
                </div>
              )}

              {isExpanded && !prof && (
                <div className="px-4 pb-4 border-t border-zinc-800/60 pt-3 text-xs text-zinc-500">
                  {u.role === 'client' ? 'Client account — no freelancer profile available.' : 'No additional profile data.'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
