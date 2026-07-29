import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Wallet, TrendingUp, ArrowUpRight, CheckCircle, Clock, X, ExternalLink, Sparkles } from 'lucide-react';

export const EarningsPage: React.FC = () => {
  const { currentUser, withdrawals, requestWithdrawal, upgradeSubscription } = useApp();
  const { addToast } = useToast();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState<'UPI' | 'Bank Transfer' | 'Razorpay' | 'PayPal'>('UPI');
  const [accountDetails, setAccountDetails] = useState('');

  const myWithdrawals = withdrawals.filter(w => w.freelancerId === currentUser.id);
  const pendingWithdrawals = myWithdrawals.filter(w => w.status === 'pending');
  const completedWithdrawals = myWithdrawals.filter(w => w.status === 'approved');

  const handleWithdraw = () => {
    if (amount <= 0 || amount > currentUser.balance || !accountDetails.trim()) return;
    requestWithdrawal(amount, method, accountDetails);
    addToast(`₹${amount.toLocaleString()} withdrawal requested!`, 'success');
    setShowWithdraw(false);
    setAmount(0);
    setAccountDetails('');
  };

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Earnings & Wallet</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your earnings and withdrawals</p>
        </div>
        <button
          onClick={() => setShowWithdraw(true)}
          disabled={currentUser.balance <= 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm"
        >
          <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Available Balance', value: currentUser.balance, icon: Wallet, color: 'from-emerald-500 to-teal-400' },
          { label: 'Pending Clearance', value: currentUser.pendingBalance, icon: Clock, color: 'from-amber-500 to-orange-400' },
          { label: 'Total Withdrawn', value: currentUser.withdrawnBalance, icon: TrendingUp, color: 'from-blue-500 to-cyan-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-zinc-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-0.5`}>
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">₹{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Pro Tiers */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> WorkHive Pro Memberships
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Boost your visibility, rank bids higher, and stand out in searches.</p>
          </div>
          {currentUser.proTier && currentUser.proTier !== 'none' && (
            <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-center">
              Active Tier: {currentUser.proTier}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              id: 'none' as const,
              title: 'Basic Member',
              price: 0,
              badgeColor: 'bg-zinc-800 text-zinc-400 border-zinc-700',
              features: ['Standard search results', 'Default proposal ordering', 'Basic profile design'],
              btnLabel: 'Default Tier'
            },
            {
              id: 'pro' as const,
              title: 'Hive Pro',
              price: 2500,
              badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black',
              features: ['PRO Badge on all cards', 'Orange profile ring & glowing cards', '2x Proposal list boost multiplier', 'Detailed profile analytics access'],
              btnLabel: 'Upgrade to Pro'
            },
            {
              id: 'elite' as const,
              title: 'Hive Elite',
              price: 5000,
              badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
              features: ['ELITE Badge on all cards', 'Purple neon glow card style', '5x Proposal list boost (sorted first)', 'Priority admin dispute support', 'Zero commission withdrawals'],
              btnLabel: 'Upgrade to Elite'
            }
          ].map(tier => {
            const isActive = (currentUser.proTier || 'none') === tier.id;
            const canAfford = currentUser.balance >= tier.price;
            return (
              <div 
                key={tier.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'bg-zinc-900/80 border-emerald-500/50 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20' 
                    : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-750 hover:bg-zinc-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-white text-sm">{tier.title}</h3>
                    {isActive && <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">Active</span>}
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-white">₹{tier.price.toLocaleString()}</span>
                    {tier.price > 0 && <span className="text-[10px] text-zinc-500 font-medium"> / month</span>}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="text-[10px] text-zinc-400 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tier.price > 0 && (
                  <button
                    onClick={() => {
                      if (isActive) return;
                      const ok = upgradeSubscription(tier.id, tier.price);
                      if (ok) {
                        addToast(`Successfully upgraded to ${tier.title}!`, 'success');
                      } else {
                        addToast('Insufficient wallet balance for this upgrade', 'error');
                      }
                    }}
                    disabled={isActive || !canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-zinc-850 text-zinc-500 cursor-default border border-zinc-800' 
                        : canAfford 
                          ? tier.id === 'elite' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-md' 
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isActive ? 'Current Tier' : !canAfford ? 'Insufficient Funds' : tier.btnLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Pending Withdrawals
          </h3>
          {pendingWithdrawals.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">No pending withdrawals.</p>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                  <div>
                    <div className="text-sm font-semibold text-emerald-400">₹{w.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">{w.method} · {w.accountDetails}</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-semibold">
                    Pending
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Withdrawal History
          </h3>
          {completedWithdrawals.length === 0 && myWithdrawals.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">No withdrawal history yet.</p>
          ) : (
            <div className="space-y-3">
              {myWithdrawals.slice(0, 10).map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
                  <div>
                    <div className="text-sm font-semibold text-white">₹{w.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">{w.method} · {w.createdAt}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                    w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    w.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdraw(false)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white">Withdraw Funds</h2>
              <button onClick={() => setShowWithdraw(false)} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-xs text-zinc-400">Available Balance</span>
                <div className="text-2xl font-bold text-white">₹{currentUser.balance.toLocaleString()}</div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.min(Number(e.target.value), currentUser.balance))}
                  placeholder="Enter amount"
                  max={currentUser.balance}
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-1.5 mt-2">
                  {[5000, 10000, 25000, 50000].filter(v => v <= currentUser.balance).map(v => (
                    <button
                      key={v}
                      onClick={() => setAmount(v)}
                      className={`px-3 py-1 rounded-lg text-[10px] border transition-colors ${
                        amount === v ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                      }`}
                    >
                      ₹{v.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => setAmount(currentUser.balance)}
                    className="px-3 py-1 rounded-lg text-[10px] border bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Bank Transfer', 'Razorpay', 'PayPal'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`p-3 rounded-xl text-xs font-medium border transition-all ${
                        method === m ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Account Details</label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder={method === 'UPI' ? 'username@upi' : method === 'PayPal' ? 'email@example.com' : 'Account number / IFSC'}
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleWithdraw}
                disabled={amount <= 0 || amount > currentUser.balance || !accountDetails.trim()}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm"
              >
                Withdraw ₹{amount.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
