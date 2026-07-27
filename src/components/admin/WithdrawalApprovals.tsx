import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, Clock, Wallet, Copy } from 'lucide-react';

export const WithdrawalApprovals: React.FC = () => {
  const { withdrawals, adminApproveWithdrawal } = useApp();

  const pending = withdrawals.filter(w => w.status === 'pending');
  const approved = withdrawals.filter(w => w.status === 'approved');
  const rejected = withdrawals.filter(w => w.status === 'rejected');

  const totalPendingAmount = pending.reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Withdrawal Approvals</h1>
          <p className="text-sm text-zinc-400 mt-1">{pending.length} pending requests</p>
        </div>
        {pending.length > 0 && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold">
            ₹{totalPendingAmount.toLocaleString()} pending
          </div>
        )}
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Pending Approvals ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map(w => (
              <div key={w.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{w.freelancerName}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-0.5">
                        <span className="text-emerald-400 font-bold text-base">₹{w.amount.toLocaleString()}</span>
                        <span>·</span>
                        <span>{w.method}</span>
                        <button onClick={() => navigator.clipboard.writeText(w.accountDetails)}
                          className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors" title="Copy account details">
                          <Copy className="w-3 h-3" /> {w.accountDetails}
                        </button>
                      </div>
                      <div className="text-[10px] text-zinc-600 mt-1">Requested {w.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adminApproveWithdrawal(w.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-xl transition-all text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
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
              <div key={w.id} className="glass-card rounded-2xl p-4 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">{w.freelancerName}</span>
                  <span className="text-xs text-zinc-500 ml-3">₹{w.amount.toLocaleString()} · {w.method}</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">Approved</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {withdrawals.length === 0 && (
        <div className="text-center py-16">
          <Wallet className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No withdrawal requests</h3>
          <p className="text-sm text-zinc-600">Withdrawals from freelancers will appear here.</p>
        </div>
      )}
    </div>
  );
};
