import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, Clock, Wallet, Copy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const WithdrawalApprovals: React.FC = () => {
  const { withdrawals, adminApproveWithdrawal, adminRejectWithdrawal } = useApp();
  const { addToast } = useToast();

  const pending = withdrawals.filter(w => w.status === 'pending');
  const approved = withdrawals.filter(w => w.status === 'approved');
  const rejected = withdrawals.filter(w => w.status === 'rejected');

  const totalPendingAmount = pending.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Withdrawal Approvals</h1>
          <p className="text-sm text-zinc-500 mt-1">{pending.length} pending requests</p>
        </div>
        {pending.length > 0 && (
          <Badge variant="amber" size="md">₹{totalPendingAmount.toLocaleString()} pending</Badge>
        )}
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Pending Approvals ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(w => (
              <Card key={w.id} padding="md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{w.freelancerName}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                        <span className="text-emerald-400 font-bold text-base">₹{w.amount.toLocaleString()}</span>
                        <span className="text-zinc-600">·</span>
                        <span>{w.method}</span>
                        <button onClick={() => navigator.clipboard.writeText(w.accountDetails)}
                          className="flex items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors" title="Copy account details">
                          <Copy className="w-3 h-3" /> {w.accountDetails}
                        </button>
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1">Requested {w.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="xs" icon={<CheckCircle className="w-3.5 h-3.5" />} onClick={() => adminApproveWithdrawal(w.id)}>
                      Approve
                    </Button>
                    <Button variant="danger" size="xs" icon={<XCircle className="w-3.5 h-3.5" />} onClick={() => { adminRejectWithdrawal(w.id); addToast('Withdrawal rejected — funds returned', 'info'); }}>
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" /> Approved ({approved.length})
          </h2>
          <div className="space-y-2">
            {approved.map(w => (
              <Card key={w.id} padding="sm" className="border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">{w.freelancerName}</span>
                  <span className="text-xs text-zinc-500 ml-3">₹{w.amount.toLocaleString()} · {w.method}</span>
                </div>
                <Badge variant="emerald">Approved</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {rejected.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-400" /> Rejected ({rejected.length})
          </h2>
          <div className="space-y-2">
            {rejected.map(w => (
              <Card key={w.id} padding="sm" className="border-rose-500/20 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">{w.freelancerName}</span>
                  <span className="text-xs text-zinc-500 ml-3">₹{w.amount.toLocaleString()} · {w.method}</span>
                </div>
                <Badge variant="rose">Rejected</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {withdrawals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Wallet className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No withdrawal requests</h3>
          <p className="text-sm text-zinc-600">Withdrawals from freelancers will appear here.</p>
        </div>
      )}
    </div>
  );
};
