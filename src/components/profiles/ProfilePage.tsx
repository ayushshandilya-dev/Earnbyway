import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { FreelancerProfile as FreelancerProfileView } from './FreelancerProfile';
import {
  User, Mail, Star, MapPin, Calendar, Briefcase, Heart,
  Edit3, Settings, CheckCircle, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, currentRole, profiles, orders, projects, reviews, bookmarks } = useApp();
  const myProfile = profiles[currentUser.id];
  const [viewingFreelancer, setViewingFreelancer] = useState<string | null>(null);

  if (currentRole === 'freelancer' && myProfile) {
    return <FreelancerProfileView freelancerUser={currentUser} onBack={() => navigate(-1)} />;
  }

  const activeOrders = orders.filter(o => o.clientId === currentUser.id && (o.status === 'in_progress' || o.status === 'under_review')).length;
  const postedProjects = projects.filter(p => p.clientId === currentUser.id).length;
  const myReviews = reviews.filter(r => r.targetId === currentUser.id);

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-8">
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img src={currentUser.avatar} alt={currentUser.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-emerald-500/50" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-heading font-bold text-white">{currentUser.name}</h1>
              {currentUser.isVerified && <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />}
              <Badge
                variant={currentUser.role === 'client' ? 'blue' : currentUser.role === 'freelancer' ? 'emerald' : 'amber'}
                size="md"
                className="uppercase tracking-wider"
              >
                {currentUser.role}
              </Badge>
            </div>
            {currentUser.company && <p className="text-sm text-zinc-400">{currentUser.company}</p>}
            {currentUser.title && <p className="text-xs text-zinc-500">{currentUser.title}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {currentUser.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {currentUser.joinedDate}</span>
            </div>
          </div>
          <Button onClick={() => navigate('/settings')} variant="secondary" size="sm">
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/60">
          <div className="text-center">
            <div className="text-xl font-bold text-white">₹{currentUser.balance.toLocaleString()}</div>
            <div className="text-[10px] text-zinc-500">Available</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{activeOrders}</div>
            <div className="text-[10px] text-zinc-500">Active Orders</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{postedProjects}</div>
            <div className="text-[10px] text-zinc-500">Projects Posted</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{myReviews.length}</div>
            <div className="text-[10px] text-zinc-500">Reviews</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card onClick={() => navigate('/orders')} hover tilt3d className="text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5 mb-3">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center"><Briefcase className="w-5 h-5 text-blue-400" /></div>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">My Orders</h3>
          <p className="text-xs text-zinc-500">Track your active orders and milestones</p>
        </Card>
        <Card onClick={() => navigate('/bookmarks')} hover tilt3d className="text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-400 p-0.5 mb-3">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center"><Heart className="w-5 h-5 text-pink-400" /></div>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Saved Items</h3>
          <p className="text-xs text-zinc-500">{bookmarks.length} saved gigs and freelancers</p>
        </Card>
        <Card onClick={() => navigate('/settings')} hover tilt3d className="text-left cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-500 to-zinc-400 p-0.5 mb-3">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center"><Settings className="w-5 h-5 text-zinc-400" /></div>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">Settings</h3>
          <p className="text-xs text-zinc-500">Manage your account and preferences</p>
        </Card>
      </div>

      {currentRole === 'client' && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold text-white">Your Activity</h2>
            <button onClick={() => navigate('/projects')} className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="glass-card rounded-2xl p-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-zinc-500">No projects posted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                    <div>
                      <div className="text-sm font-medium text-white">{p.title}</div>
                      <div className="text-xs text-zinc-500">{p.category} · ₹{p.budget.toLocaleString()}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      p.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      p.status === 'hired' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}>{p.status}</span>
