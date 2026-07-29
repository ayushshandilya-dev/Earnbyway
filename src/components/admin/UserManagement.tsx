import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Users, Search, Shield, ShieldOff, UserCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, adminToggleVerifyUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">User Management</h1>
          <p className="text-sm text-zinc-500 mt-1">{users.length} total users on the platform</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="blue" size="md" dot>{users.filter(u => u.role === 'freelancer').length} Freelancers</Badge>
          <Badge variant="emerald" size="md" dot>{users.filter(u => u.role === 'client').length} Clients</Badge>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all" />
      </div>

      <div className="space-y-3">
        {filtered.map(user => (
          <Card key={user.id} padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    {user.isVerified && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={user.role === 'freelancer' ? 'blue' : 'emerald'}>{user.role}</Badge>
                <Button variant={user.isVerified ? 'danger' : 'primary'} size="xs"
                  icon={user.isVerified ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  onClick={() => adminToggleVerifyUser(user.id)}>
                  {user.isVerified ? 'Unverify' : 'Verify'}
                </Button>
                <button onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                  {expandedUser === user.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {expandedUser === user.id && (
              <div className="mt-4 pt-4 border-t border-zinc-800/60 grid grid-cols-3 gap-4 text-xs">
                <div><span className="text-zinc-500">Joined:</span> <span className="text-white ml-1">{user.joinedDate}</span></div>
                <div><span className="text-zinc-500">Location:</span> <span className="text-white ml-1">{user.location}</span></div>
                <div><span className="text-zinc-500">Balance:</span> <span className="text-emerald-400 ml-1">₹{user.balance.toLocaleString()}</span></div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
