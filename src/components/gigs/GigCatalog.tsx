import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { GigCard } from './GigCard';
import { GigDetail } from './GigDetail';
import { Gig } from '../../types';
import { AIService } from '../../services/aiService';
import { Search, SlidersHorizontal, X, Code, Brain, Palette, PenTool, Video, Megaphone, Layers, Shield } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

const CATEGORIES = [
  { name: 'All', icon: null },
  { name: 'Development', icon: Code },
  { name: 'AI', icon: Brain },
  { name: 'Graphic Design', icon: Palette },
  { name: 'Content Writing', icon: PenTool },
  { name: 'Video Editing', icon: Video },
  { name: 'Marketing', icon: Megaphone },
  { name: 'UI/UX Design', icon: Layers },
  { name: 'Cybersecurity', icon: Shield },
];

type SortOption = 'newest' | 'highest_rated' | 'lowest_price' | 'best_selling';

export const GigCatalog: React.FC = () => {
  const { gigs } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  const filteredGigs = useMemo(() => {
    let result = [...gigs];

    const aiFilter = AIService.parseNaturalLanguageSearch(searchQuery);
    if (aiFilter.keyword) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }
    if (aiFilter.maxPrice && aiFilter.maxPrice > 0) {
      result = result.filter(g => g.startingPrice <= aiFilter.maxPrice!);
    }
    if (maxPrice > 0) {
      result = result.filter(g => g.startingPrice <= maxPrice);
    }
    if (aiFilter.minRating) {
      result = result.filter(g => g.rating >= aiFilter.minRating!);
    }
    if (aiFilter.skills && aiFilter.skills.length > 0) {
      result = result.filter(g =>
        g.tags.some(t => aiFilter.skills!.some(s => t.toLowerCase().includes(s.toLowerCase())))
      );
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'highest_rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest_price':
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'best_selling':
        result.sort((a, b) => b.ordersCompleted - a.ordersCompleted);
        break;
    }

    return result;
  }, [gigs, searchQuery, selectedCategory, sortBy, maxPrice]);

  const priceRanges = [0, 5000, 10000, 20000, 50000];

  if (selectedGig) {
    return <GigDetail gig={selectedGig} onBack={() => setSelectedGig(null)} />;
  }

  return (
    <div className="py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Explore Gigs</h1>
          <p className="text-sm text-zinc-400 mt-1">{filteredGigs.length} services available</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchParams(e.target.value ? { q: e.target.value } : {}); }}
              placeholder="AI Search: 'React dev under ₹25k'..."
              className="w-full sm:w-72 pl-10 pr-10 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-slate-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchParams({}); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors ${showFilters ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat.name
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
            {cat.name}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="glass-panel rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest</option>
              <option value="highest_rated">Highest Rated</option>
              <option value="lowest_price">Lowest Price</option>
              <option value="best_selling">Best Selling</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-2 block">Max Price (₹)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={50000}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-emerald-500"
              />
              <span className="text-xs text-emerald-400 font-semibold w-16 text-right">₹{maxPrice.toLocaleString()}</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {priceRanges.map(p => (
                <button
                  key={p}
                  onClick={() => setMaxPrice(p)}
                  className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                    maxPrice === p ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                  }`}
                >
                  {p === 0 ? 'Any' : `≤₹${p/1000}k`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('newest'); setMaxPrice(0); }}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {filteredGigs.length === 0 ? (
        <EmptyState icon="search" title="No gigs found" description="Try adjusting your filters or search query." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map(gig => (
            <GigCard key={gig.id} gig={gig} onClick={() => setSelectedGig(gig)} />
          ))}
        </div>
      )}
    </div>
  );
};
