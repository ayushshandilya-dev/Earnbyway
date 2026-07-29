import React from 'react';
import { Gig } from '../../types';
import { Star, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  gig: Gig;
  onSelect: (gig: Gig) => void;
}

export const GigCard: React.FC<Props> = ({ gig, onSelect }) => {
  const { users } = useApp();
  const seller = users.find(u => u.id === gig.freelancerId);
  const isPro = seller?.proTier && seller.proTier !== 'none';

  return (
    <button
      onClick={() => onSelect(gig)}
      className={`glass-card glass-card-hover rounded-2xl overflow-hidden text-left group w-full transition-all duration-300 ${
        isPro ? 'ring-1 ring-amber-500/30 hover:ring-amber-500/60 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/10' : ''
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={gig.coverImage}
          alt={gig.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <img src={gig.freelancerAvatar} alt="" className="w-7 h-7 rounded-lg object-cover border-2 border-zinc-950" />
          <div className="flex flex-col">
            <span className="text-[11px] text-white font-medium flex items-center gap-1">
              {gig.freelancerName}
              {isPro && (
                <span className="text-[8px] bg-gradient-to-r from-amber-500 to-orange-500 text-black px-1 rounded-sm font-extrabold flex items-center gap-0.5">
                  <Sparkles className="w-2 h-2" /> PRO
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] text-emerald-400 font-semibold border border-emerald-500/30">
          {gig.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug">{gig.title}</h3>
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{gig.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {gig.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {gig.rating}
            </span>
            <span className="text-zinc-500">({gig.reviewsCount})</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Clock className="w-3 h-3" /> {gig.packages.basic.deliveryDays}d
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block">Starting at</span>
            <span className="text-sm font-bold text-emerald-400">₹{gig.startingPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

