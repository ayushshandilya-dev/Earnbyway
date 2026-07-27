import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { GigCard } from '../gigs/GigCard';
import { GigDetail } from '../gigs/GigDetail';
import { FreelancerProfile } from '../profiles/FreelancerProfile';
import { Gig, User } from '../../types';
import {
  Search, Sparkles, SlidersHorizontal, X, Users, Briefcase, Star,
  ChevronRight, MapPin, Clock, Filter
} from 'lucide-react';

export const SearchResults: React.FC = () => {
  const { gigs, users, profiles, currentRole } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'gigs' | 'freelancers'>('gigs');
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);

  const aiFilter = useMemo(() => AIService.parseNaturalLanguageSearch(query), [query]);

  const filteredGigs = useMemo(() => {
    let result = [...gigs];
    const q = query.toLowerCase();
    if (q) {
      result = result.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (aiFilter.maxPrice && aiFilter.maxPrice > 0) result = result.filter(g => g.startingPrice <= aiFilter.maxPrice!);
    if (maxPrice > 0) result = result.filter(g => g.startingPrice <= maxPrice);
    if (aiFilter.minRating) result = result.filter(g => g.rating >= aiFilter.minRating!);
    if (aiFilter.skills && aiFilter.skills.length > 0) {
      result = result.filter(g => g.tags.some(t => aiFilter.skills!.some(s => t.toLowerCase().includes(s.toLowerCase()))));
    }
    if (aiFilter.category) result = result.filter(g => g.category === aiFilter.category);
    return result;
  }, [gigs, query, maxPrice, aiFilter]);

  const filteredFreelancers = useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u => {
      if (u.role !== 'freelancer' || !profiles[u.id]) return false;
      const p = profiles[u.id];
      if (q) {
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSkills = p.skills.some(s => s.toLowerCase().includes(q));
        const matchesBio = p.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesTitle && !matchesSkills && !matchesBio) return false;
      }
      if (minRating > 0 && p.rating < minRating) return false;
      return true;
    });
  }, [users, profiles, query, minRating]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query.trim() });
  };

  if (selectedGig) return <GigDetail gig={selectedGig} onBack={() => setSelectedGig(null)} />;
  if (selectedFreelancer) return <FreelancerProfile freelancerUser={selectedFreelancer} onBack={() => setSelectedFreelancer(null)} />;

  return (
    <div className="py-8">
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="AI Natural Search: 'Need a React developer under ₹25k with 5★ rating'..."
          className="w-full pl-12 pr-24 py-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-colors ${showFilters ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
            <Filter className="w-4 h-4" />
          </button>
          <button type="submit" className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors">
            <Sparkles className="w-4 h-4 text-black" />
          </button>
        </div>
      </form>

      {query && aiFilter && (
        <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
          <span className="text-xs text-zinc-500">AI detected:</span>
          {aiFilter.category && <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-medium">Category: {aiFilter.category}</span>}
          {aiFilter.maxPrice && <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[10px] text-blue-400 font-medium">Max: ₹{aiFilter.maxPrice.toLocaleString()}</span>}
          {aiFilter.minRating && <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-medium">{aiFilter.minRating}★+</span>}
          {aiFilter.skills && aiFilter.skills.map(s => (
            <span key={s} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-400 font-medium">{s}</span>
          ))}
        </div>
      )}

      {showFilters && (
        <div className="glass-panel rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Max Price (₹)</label>
            <input type="range" min={0} max={50000} step={1000} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-emerald-500" />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>Any</span>
              <span className="text-emerald-400 font-semibold">₹{maxPrice.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Min Rating</label>
            <div className="flex gap-1.5">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button key={r} onClick={() => setMinRating(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                    minRating === r ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}>
                  {r === 0 ? 'Any' : `${r}★`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setMaxPrice(0); setMinRating(0); }}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors">
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 border-b border-zinc-800 mb-6">
        {(['gigs', 'freelancers'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === tab ? 'text-emerald-400 border-emerald-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}>
            {tab === 'gigs' ? <Briefcase className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            {tab === 'gigs' ? `Gigs (${filteredGigs.length})` : `Freelancers (${filteredFreelancers.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'gigs' ? (
        filteredGigs.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No gigs found</h3>
            <p className="text-sm text-zinc-600">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map(gig => <GigCard key={gig.id} gig={gig} onSelect={setSelectedGig} />)}
          </div>
        )
      ) : (
        filteredFreelancers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No freelancers found</h3>
            <p className="text-sm text-zinc-600">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.map(fl => {
              const p = profiles[fl.id];
              if (!p) return null;
              const matchResult = AIService.matchFreelancers(query, profiles, filteredFreelancers);
              const myMatch = matchResult.find(m => m.user.id === fl.id);
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
                    <div className="flex items-center gap-3 text-xs mb-3">
                      <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating}</span>
                      <span className="text-zinc-500">{p.completedJobs} jobs</span>
                      <span className="text-emerald-400 font-semibold">₹{p.hourlyRate}/hr</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.skills.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">{s}</span>
                      ))}
                    </div>
                    {myMatch && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Sparkles className="w-3 h-3" /> {myMatch.matchPercentage}% Match
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
