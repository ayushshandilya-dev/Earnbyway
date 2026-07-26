import React from 'react';
import { Hexagon, ShieldCheck, Lock, Cpu, Globe, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 pt-12 pb-8 mt-20 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-zinc-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
              <span className="font-heading font-extrabold text-lg text-white">Earn By Way</span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Connecting clients with talented freelancers worldwide through secure escrow milestone payment processing, real-time communication, and AI recommendation engines.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Protection
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium">
                <Lock className="w-3.5 h-3.5" /> SSL 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              <li><a href="#dev" className="hover:text-emerald-400 transition-colors">Web Development</a></li>
              <li><a href="#ai" className="hover:text-emerald-400 transition-colors">AI & Machine Learning</a></li>
              <li><a href="#uiux" className="hover:text-emerald-400 transition-colors">Graphic Design & UI/UX</a></li>
              <li><a href="#content" className="hover:text-emerald-400 transition-colors">Content & Copywriting</a></li>
              <li><a href="#video" className="hover:text-emerald-400 transition-colors">Video Editing & 3D</a></li>
            </ul>
          </div>

          {/* Platform Architecture */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">System Features</h4>
            <ul className="space-y-2">
              <li><a href="#escrow" className="hover:text-emerald-400 transition-colors">Escrow Milestone Engine</a></li>
              <li><a href="#ai-proposal" className="hover:text-emerald-400 transition-colors">AI Proposal Generator</a></li>
              <li><a href="#chat" className="hover:text-emerald-400 transition-colors">Real-Time Web Chat</a></li>
              <li><a href="#dispute" className="hover:text-emerald-400 transition-colors">Dispute Arbitration</a></li>
              <li><a href="#analytics" className="hover:text-emerald-400 transition-colors">Earnings & Spend Analytics</a></li>
            </ul>
          </div>

          {/* Tech Stack Summary */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Engineered With</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'TypeScript', 'Tailwind CSS', 'Escrow Engine', 'Prisma ORM', 'JWT Auth', 'WebSockets', 'Lucide Icons'].map(t => (
                <span key={t} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 Earn By Way SaaS Inc. All rights reserved. Portfolio System Design Showcase.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-400 cursor-pointer">API Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
