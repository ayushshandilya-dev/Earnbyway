import React from 'react';
import { X, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  week?: string;
}

export const PlaceholderModal: React.FC<Props> = ({ isOpen, onClose, title, description, week }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121215] p-8 rounded-xl border border-zinc-800 text-center max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        {description && <p className="text-sm text-zinc-400">{description}</p>}
        {week && (
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
            <Clock className="w-3 h-3" /> Scheduled for {week}
          </div>
        )}
      </div>
    </div>
  );
};
