import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Wallet, TrendingUp, ArrowUpRight, CheckCircle, Clock, X, Sparkles, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const EarningsPage: React.FC = () => {
  const { currentUser, withdrawals, requestWithdrawal, upgradeSubscription, depositFunds } = useApp();
  const { addToast } = useToast();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [method, setMethod] = useState<'UPI' | 'Bank Transfer' | 'Razorpay' | 'PayPal'>('UPI');
  const [depositMethod, setDepositMethod] = useState<'UPI' | 'Card' | 'Razorpay'>('Razorpay');
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

  const handleDeposit = async () => {
    if (depositAmount <= 0) return;
    try {
      await depositFunds(depositAmount, depositMethod);
      addToast(`₹${depositAmount.toLocaleString()} added to your wallet!`, 'success');
      setShowDeposit(false);
      setDepositAmount(0);
    } catch (err: any) {
      addToast(err.message || 'Deposit failed', 'error');
    }
  };

  return (
    <div className="py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Earnings & Wallet</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your earnings and withdrawals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowDeposit(true)}
            btn3d
            variant="primary"
            size="md"
          >
            <Wallet className="w-4 h-4" /> Deposit Funds
          </Button>
          {currentUser.role === 'freelancer' && (
            <Button
              onClick={() => setShowWithdraw(true)}
              disabled={currentUser.balance <= 0}
              btn3d
              variant="secondary"
              size="md"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw Funds
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Available Balance', value: currentUser.balance, icon: Wallet, color: 'from-emerald-500 via-teal-400 to-violet-500' },
          { label: 'Pending Clearance', value: currentUser.pendingBalance, icon: Clock, color: 'from-amber-500 to-orange-400' },
          { label: 'Total Withdrawn', value: currentUser.withdrawnBalance, icon: TrendingUp, color: 'from-blue-500 to-cyan-400' },
        ].map(stat => (
          <Card key={stat.label} float3d className="relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl rounded-full pointer-events-none`} />
            <CardHeader className="mb-3">
              <span className="text-xs text-zinc-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} p-0.5`}>
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <div className="text-3xl font-bold text-white">₹{stat.value.toLocaleString()}</div>
          </Card>
        ))}
      </div>

      {/* Pro Tiers */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-6 glossy aurora-top">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> WorkHive Pro Memberships
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Boost your visibility, rank bids higher, and stand out in searches.</p>
          </div>
          {currentUser.proTier && currentUser.proTier !== 'none' && (
            <Badge variant="amber" size="md" className="uppercase tracking-wider self-start sm:self-center" dot>
              <Crown className="w-3 h-3" /> Active Tier: {currentUser.proTier}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              id: 'none' as const,
              title: 'Basic Member',
              price: 0,
              featured: false,
              gradient: 'from-zinc-500 to-zinc-400',
              features: ['Standard search results', 'Default proposal ordering', 'Basic profile design'],
              btnLabel: 'Default Tier'
            },
            {
              id: 'pro' as const,
              title: 'Hive Pro',
              price: 2500,
              featured: true,
              gradient: 'from-amber-500 to-orange-500',
              features: ['PRO Badge on all cards', 'Orange profile ring & glowing cards', '2x Proposal list boost multiplier', 'Detailed profile analytics access'],
              btnLabel: 'Upgrade to Pro'
            },
            {
              id: 'elite' as const,
              title: 'Hive Elite',
              price: 5000,
              featured: false,
              gradient: 'from-purple-500 to-indigo-500',
              features: ['ELITE Badge on all cards', 'Purple neon glow card style', '5x Proposal list boost (sorted first)', 'Priority admin dispute support', 'Zero commission withdrawals'],
              btnLabel: 'Upgrade to Elite'
            }
          ].map(tier => {
            const isActive = (currentUser.proTier || 'none') === tier.id;
            const canAfford = currentUser.balance >= tier.price;
            return (
              <Card
                key={tier.id}
                tilt3d
                className={`flex flex-col justify-between ${
                  isActive
                    ? 'ring-1 ring-emerald-500/30'
                    : tier.featured ? 'ring-1 ring-amber-500/20' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-white text-sm">{tier.title}</h3>
                    {isActive && <Badge variant="emerald">Active</Badge>}
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl font-black text-white">₹{tier.price.toLocaleString()}</span>
                    {tier.price > 0 && <span className="text-[10px] text-zinc-500 font-medium"> / month</span>}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <li key={i} className="text-[10px] text-zinc-400 flex items-start gap-1.5">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${tier.featured && !isActive ? 'text-amber-500' : 'text-zinc-600'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tier.price > 0 && (
                  <Button
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
                    variant={tier.id === 'elite' ? 'gradient' : 'primary'}
                    className="w-full"
                    size="sm"
                  >
                    {isActive ? 'Current Tier' : !canAfford ? 'Insufficient Funds' : tier.btnLabel}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={<Clock className="w-4 h-4 text-amber-400" />}>Pending Withdrawals</CardTitle>
          </CardHeader>
          {pendingWithdrawals.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">No pending withdrawals.</p>
          ) : (
            <div className="space-y-3">
              {pendingWithdrawals.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-amber-500/30 transition-colors">
                  <div>
                    <div className="text-sm font-semibold text-emerald-400">₹{w.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">{w.method} · {w.accountDetails}</div>
                  </div>
                  <Badge variant="amber">Pending</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}>Withdrawal History</CardTitle>
          </CardHeader>
          {completedWithdrawals.length === 0 && myWithdrawals.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">No withdrawal history yet.</p>
          ) : (
            <div className="space-y-3">
              {myWithdrawals.slice(0, 10).map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="text-sm font-semibold text-white">₹{w.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500">{w.method} · {w.createdAt}</div>
                  </div>
                  <Badge
                    variant={w.status === 'approved' ? 'emerald' : w.status === 'rejected' ? 'rose' : 'amber'}
                  >
                    {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {showWithdraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdraw(false)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-3d-lg animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white">Withdraw Funds</h2>
              <Button variant="ghost" size="xs" onClick={() => setShowWithdraw(false)} aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <span className="text-xs text-zinc-400">Available Balance</span>
                <div className="text-2xl font-bold text-white">₹{(currentUser.balance ?? 0).toLocaleString()}</div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.min(Number(e.target.value), currentUser.balance))}
                  placeholder="Enter amount"
                  max={currentUser.balance}
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <div className="flex gap-1.5 mt-2">
                  {[5000, 10000, 25000, 50000].filter(v => v <= currentUser.balance).map(v => (
                    <Button
                      key={v}
                      size="xs"
                      variant={amount === v ? 'primary' : 'secondary'}
                      onClick={() => setAmount(v)}
                    >
                      ₹{v.toLocaleString()}
                    </Button>
                  ))}
                  <Button
                    size="xs"
                    variant={amount === currentUser.balance ? 'primary' : 'secondary'}
                    onClick={() => setAmount(currentUser.balance)}
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['UPI', 'Bank Transfer', 'Razorpay', 'PayPal'] as const).map(m => (
                    <Button
                      key={m}
                      onClick={() => setMethod(m)}
                      variant={method === m ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {m}
                    </Button>
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
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={amount <= 0 || amount > currentUser.balance || !accountDetails.trim()}
                className="w-full"
                size="md"
                btn3d
              >
                Withdraw ₹{amount.toLocaleString()}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeposit(false)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-3d-lg animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white">Deposit Funds</h2>
              <Button variant="ghost" size="xs" onClick={() => setShowDeposit(false)} aria-label="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Amount (₹)</label>
                <input
                  type="number"
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  placeholder="Enter deposit amount"
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                />
                <div className="flex gap-1.5 mt-2">
                  {[5000, 10000, 25000, 50000].map(v => (
                    <Button
                      key={v}
                      size="xs"
                      variant={depositAmount === v ? 'primary' : 'secondary'}
                      onClick={() => setDepositAmount(v)}
                    >
                      ₹{v.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'Razorpay'] as const).map(m => (
                    <Button
                      key={m}
                      onClick={() => setDepositMethod(m)}
                      variant={depositMethod === m ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={depositAmount <= 0}
                className="w-full mt-4"
                size="md"
                btn3d
              >
                Deposit ₹{depositAmount.toLocaleString()}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
