import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Shield, AlertTriangle, CheckCircle, MessageSquare, Clock, Send } from 'lucide-react';

export const DisputePanel: React.FC = () => {
  const { disputes, adminResolveDispute } = useApp();
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const handleResolve = (id: string, resolution: string) => {
    if (!resolution.trim()) return;
    adminResolveDispute(id, resolution);
    setResolvedId(id);
  };

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Dispute Panel</h1>
          <p className="text-sm text-zinc-500 mt-1">Resolve client-freelancer disputes</p>
        </div>
        {disputes.filter(d => d.status === 'open').length > 0 && (
          <Badge variant="amber" size="md" dot>{disputes.filter(d => d.status === 'open').length} open</Badge>
        )}
      </div>

      {disputes.length === 0 ? (
        <Card padding="lg" className="text-center py-12">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No disputes</h3>
          <p className="text-sm text-zinc-500">All orders are running smoothly.</p>
        </Card>
      ) : (
        disputes.map(dispute => (
          <Card key={dispute.id} padding="lg">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                dispute.status === 'open' ? 'bg-rose-500/10 border border-rose-500/30' : 'bg-emerald-500/10 border border-emerald-500/30'
              }`}>
                {dispute.status === 'open' ? <AlertTriangle className="w-5 h-5 text-rose-400" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{dispute.orderTitle}</h3>
                  <Badge variant={dispute.status === 'open' ? 'rose' : 'emerald'}>
                    {dispute.status === 'open' ? 'Open' : 'Resolved'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {dispute.clientName} vs {dispute.freelancerName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dispute.createdAt}</span>
                </div>
                <p className="text-xs text-zinc-300 mb-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">{dispute.reason}</p>

                {dispute.status === 'open' ? (
                  <div className="space-y-3">
                    <textarea value={resolutionText[dispute.id] || ''} onChange={e => setResolutionText(prev => ({ ...prev, [dispute.id]: e.target.value }))}
                      placeholder="Enter resolution notes..."
                      className="w-full p-3 text-xs bg-zinc-900/80 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none" rows={3} />
                    <Button variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />} onClick={() => handleResolve(dispute.id, resolutionText[dispute.id] || '')}>
                      Resolve Dispute
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 font-semibold mb-1">Resolution:</p>
                    <p className="text-xs text-zinc-300">{dispute.resolution || 'Dispute resolved.'}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
