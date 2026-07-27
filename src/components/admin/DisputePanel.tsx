import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, CheckCircle, X, MessageSquare, AlertTriangle } from 'lucide-react';

export const DisputePanel: React.FC = () => {
  const { disputes, adminResolveDispute } = useApp();
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const openDisputes = disputes.filter(d => d.status === 'open');
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved');

  const handleResolve = (id: string) => {
    const text = resolutionText[id];
    if (!text?.trim()) return;
    adminResolveDispute(id, text.trim());
    setResolvedId(id);
    setResolutionText(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Dispute Resolution</h1>
        <p className="text-sm text-zinc-400 mt-1">{openDisputes.length} open disputes</p>
      </div>

      {openDisputes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Open Disputes ({openDisputes.length})
          </h2>
          <div className="space-y-4">
            {openDisputes.map(d => (
              <div key={d.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{d.orderTitle}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><span className="text-emerald-400 font-medium">{d.freelancerName}</span> (Freelancer)</span>
                      <span>vs</span>
                      <span className="flex items-center gap-1"><span className="text-blue-400 font-medium">{d.clientName}</span> (Client)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-400">₹{d.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">Disputed Amount</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-300">{d.reason}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <input type="text" value={resolutionText[d.id] || ''}
                    onChange={e => setResolutionText(prev => ({ ...prev, [d.id]: e.target.value }))}
                    placeholder="Enter resolution..." className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
                  <button onClick={() => handleResolve(d.id)} disabled={!resolutionText[d.id]?.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-xs">
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolvedDisputes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Resolved Disputes ({resolvedDisputes.length})
          </h2>
          <div className="space-y-3">
            {resolvedDisputes.map(d => (
              <div key={d.id} className="glass-card rounded-2xl p-4 border border-emerald-500/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{d.orderTitle}</h3>
                    <p className="text-xs text-zinc-500">{d.clientName} vs {d.freelancerName} · ₹{d.amount.toLocaleString()}</p>
                    {d.resolution && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-zinc-300">
                        <span className="text-emerald-400 font-medium">Resolution: </span>{d.resolution}
                      </div>
                    )}
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">Resolved</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {disputes.length === 0 && (
        <div className="text-center py-16">
          <Scale className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No disputes</h3>
          <p className="text-sm text-zinc-600">All orders are running smoothly.</p>
        </div>
      )}
    </div>
  );
};
