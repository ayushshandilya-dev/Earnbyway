import React from 'react';

const Shimmer: React.FC = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
);

export const GigCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="h-44 bg-zinc-900 relative overflow-hidden"><Shimmer /></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-zinc-800 rounded-lg w-3/4 relative overflow-hidden"><Shimmer /></div>
      <div className="h-3 bg-zinc-800/60 rounded-lg w-full relative overflow-hidden"><Shimmer /></div>
      <div className="flex gap-2">
        <div className="h-5 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
        <div className="h-5 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="flex justify-between pt-2 border-t border-zinc-800/60">
        <div className="h-4 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
        <div className="h-5 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
  </div>
);

export const ProfileCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="h-20 bg-zinc-900 relative overflow-hidden"><Shimmer /></div>
    <div className="px-5 pb-5 -mt-8 relative z-10">
      <div className="w-16 h-16 rounded-xl bg-zinc-800 border-4 border-zinc-950 mb-3 relative overflow-hidden"><Shimmer /></div>
      <div className="h-4 bg-zinc-800 rounded-lg w-32 mb-2 relative overflow-hidden"><Shimmer /></div>
      <div className="h-3 bg-zinc-800/60 rounded-lg w-48 mb-3 relative overflow-hidden"><Shimmer /></div>
      <div className="flex gap-3 mb-3">
        <div className="h-4 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
        <div className="h-4 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
        <div className="h-5 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
  </div>
);

export const OrderCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
          <div className="h-5 bg-zinc-800 rounded-lg w-24 relative overflow-hidden"><Shimmer /></div>
        </div>
        <div className="h-5 bg-zinc-800 rounded-lg w-3/4 relative overflow-hidden"><Shimmer /></div>
        <div className="h-3 bg-zinc-800/60 rounded-lg w-1/2 relative overflow-hidden"><Shimmer /></div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-3 bg-zinc-800 rounded-lg w-12 relative overflow-hidden"><Shimmer /></div>
        <div className="h-6 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
  </div>
);

export const StatsCardSkeleton: React.FC = () => (
  <div className="glass-card rounded-2xl p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="h-3 bg-zinc-800 rounded-lg w-20 relative overflow-hidden"><Shimmer /></div>
      <div className="w-9 h-9 rounded-xl bg-zinc-800 relative overflow-hidden"><Shimmer /></div>
    </div>
    <div className="h-7 bg-zinc-800 rounded-lg w-16 relative overflow-hidden"><Shimmer /></div>
  </div>
);

export const ChatBubbleSkeleton: React.FC<{ isMine?: boolean }> = ({ isMine }) => (
  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
    <div className={`max-w-[70%] ${isMine ? 'order-1' : 'order-1'}`}>
      <div className={`p-3 rounded-2xl ${isMine ? 'bg-zinc-800/60' : 'bg-zinc-900'} relative overflow-hidden`}>
        <div className="h-3 bg-zinc-700/60 rounded w-48 relative overflow-hidden"><Shimmer /></div>
        <div className="h-3 bg-zinc-700/60 rounded w-32 mt-2 relative overflow-hidden"><Shimmer /></div>
      </div>
    </div>
  </div>
);
