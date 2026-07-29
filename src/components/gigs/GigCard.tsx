import React from 'react';
import { Gig } from '../../types';
import { Star } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface Props {
  gig: Gig;
  onClick: () => void;
}

export const GigCard: React.FC<Props> = ({ gig, onClick }) => (
  <button onClick={onClick}
    className="card-3d-tilt glossy glass-card rounded-2xl overflow-hidden text-left group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
    <div className="relative h-44 overflow-hidden">
      <img src={gig.coverImage} alt={gig.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
      <div className="absolute top-3 right-3">
        <Badge variant="emerald" size="sm">₹{gig.startingPrice.toLocaleString()}</Badge>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
        <img src={gig.freelancerAvatar} alt={gig.freelancerName}
          className="w-7 h-7 rounded-lg object-cover border-2 border-zinc-950 ring-1 ring-white/10" />
        <span className="text-[11px] text-white font-medium drop-shadow-lg">{gig.freelancerName}</span>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center gap-1 mb-1.5">
        <Badge variant="zinc" size="sm">{gig.category}</Badge>
      </div>
      <h3 className="text-sm font-semibold text-white mb-2.5 line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">{gig.title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /> {gig.rating}</span>
          <span className="text-zinc-500">({gig.reviewsCount})</span>
        </div>
      </div>
    </div>
  </button>
);
