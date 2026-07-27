import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-4">
          404
        </div>
        <h1 className="text-2xl font-heading font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
          <button
            onClick={() => navigate('/gigs')}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 rounded-xl transition-all"
          >
            <Search className="w-4 h-4" /> Browse Gigs
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded-xl transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
