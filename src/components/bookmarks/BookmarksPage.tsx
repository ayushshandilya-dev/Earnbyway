import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GigCard } from '../gigs/GigCard';
import { GigDetail } from '../gigs/GigDetail';
import { FreelancerProfile } from '../profiles/FreelancerProfile';
import { Gig, User } from '../../types';
import { Heart, Users, Briefcase, Bookmark, Star } from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const { gigs, users, bookmarks, profiles } = useApp();
  const [activeTab, setActiveTab] = useState<'gigs' | 'freelancers'>('gigs');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(null);

  const bookmarkedGigs = gigs.filter(g => bookmarks.includes(g.id));
  const bookmarkedFreelancers = users.filter(u => bookmarks.includes(u.id) && u.role === 'freelancer');
  const hasItems = bookmarkedGigs.length > 0 || bookmarkedFreelancers.length > 0;

  if (selectedGig) return <GigDetail gig={selectedGig} onBack={() => setSelectedGig(null)} />;
  if (selectedFreelancer) return <FreelancerProfile freelancerUser={selectedFreelancer} onBack={() => setSelectedFreelancer(null)} />;

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-emerald-400" /> Saved Items
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {bookmarks.length} saved {bookmarks.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {!hasItems ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-zinc-400 mb-2">No saved items yet</h3>
          <p className="text-sm text-zinc-600">Click the heart icon on gigs or freelancer profiles to save them here.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 border-b border-zinc-800 mb-6">
            {(['gigs', 'freelancers'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === tab ? 'text-emerald-400 border-emerald-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}>
                {tab === 'gigs' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {tab === 'gigs' ? `Gigs (${bookmarkedGigs.length})` : `Freelancers (${bookmarkedFreelancers.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'gigs' ? (
            bookmarkedGigs.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No gigs saved yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedGigs.map(gig => <GigCard key={gig.id} gig={gig} onClick={() => setSelectedGig(gig)} />)}
              </div>
            )
          ) : (
            bookmarkedFreelancers.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No freelancers saved yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedFreelancers.map(fl => {
                  const p = profiles[fl.id];
                  if (!p) return null;
                  return (
                    <button key={fl.id} onClick={() => setSelectedFreelancer(fl)}
                      className="glass-card glass-card-hover rounded-2xl overflow-hidden text-left group">
                      <div className="h-20 bg-cover bg-center" style={{ backgroundImage: `url(${p.banner})` }}>
                        <div className="w-full h-full bg-gradient-to-b from-transparent to-zinc-950/90" />
                      </div>
                      <div className="px-5 pb-5 -mt-8 relative z-10">
                        <img src={fl.avatar} alt={fl.name} className="w-16 h-16 rounded-xl object-cover border-4 border-zinc-950 ring-2 ring-emerald-500/40 mb-3" />
                        <h3 className="font-semibold text-white mb-1">{fl.name}</h3>
                        <p className="text-xs text-zinc-400 mb-3">{p.title}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3 fill-amber-400" /> {p.rating}</span>
                          <span className="text-zinc-500">{p.completedJobs} jobs</span>
                          <span className="text-emerald-400 font-semibold">₹{p.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
