import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle, X, Zap, Shield, Star, Crown, TrendingUp,
  ArrowRight, Sparkles, Users, BarChart3, MessageSquare, Clock
} from 'lucide-react';

const TIER_ICONS: Record<string, React.ReactNode> = {
  none: <Zap className="w-6 h-6" />,
  standard: <Star className="w-6 h-6" />,
  pro: <Shield className="w-6 h-6" />,
  elite: <Crown className="w-6 h-6" />,
};

const TIER_BENEFITS: Record<string, { icon: React.ReactNode; label: string }[]> = {
  standard: [
    { icon: <Users className="w-4 h-4" />, label: '50 proposals/month' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Advanced analytics' },
    { icon: <MessageSquare className="w-4 h-4" />, label: 'Priority support' },
  ],
  pro: [
    { icon: <TrendingUp className="w-4 h-4" />, label: 'Top search placement' },
    { icon: <Sparkles className="w-4 h-4" />, label: 'Bid boost (2x visibility)' },
    { icon: <Users className="w-4 h-4" />, label: 'Unlimited proposals' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Pro analytics & insights' },
    { icon: <Clock className="w-4 h-4" />, label: '24/7 priority support' },
  ],
  elite: [
    { icon: <Crown className="w-4 h-4" />, label: '#1 search placement' },
    { icon: <Sparkles className="w-4 h-4" />, label: 'Bid boost (5x visibility)' },
    { icon: <Star className="w-4 h-4" />, label: 'Featured on homepage' },
    { icon: <Users className="w-4 h-4" />, label: 'Dedicated account manager' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Elite analytics suite' },
  ],
};

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, subscriptionPlans, upgradeSubscription } = useApp();
  const { addToast } = useToast();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentTier = currentUser.proTier || 'none';
  const currentPlan = subscriptionPlans.find(p => p.tier === currentTier) || subscriptionPlans[0];

  const handleUpgrade = (tier: string) => {
    setSelectedTier(tier);
    setShowConfirm(true);
  };

  const confirmUpgrade = () => {
    if (!selectedTier) return;
    const plan = subscriptionPlans.find(p => p.tier === selectedTier);
    if (!plan || plan.price === 0) return;

    const price = billing === 'monthly' ? plan.price : plan.priceYearly;
    const success = upgradeSubscription(selectedTier as any, price);

    if (success) {
      addToast(`Upgraded to ${plan.name}! Enjoy your new benefits.`, 'success');
    } else {
      addToast('Insufficient balance. Please add funds to your wallet.', 'error');
    }
    setShowConfirm(false);
    setSelectedTier(null);
  };

  return (
    <div className="py-8 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Upgrade Your Experience
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-white mb-3">
          Choose Your <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Plan</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Unlock more features, boost your visibility, and grow your freelance career with our subscription tiers.
        </p>

        <div className="flex items-center justify-center gap-2 mt-8 p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl w-fit mx-auto">
          <button onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${billing === 'monthly' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
            Monthly
          </button>
          <button onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${billing === 'yearly' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
            Yearly <span className="text-[10px] text-emerald-400 ml-1">Save 15%</span>
          </button>
        </div>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-3xl p-6 max-w-lg mx-auto border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 p-0.5`}>
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                {TIER_ICONS[currentTier]}
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Current Plan</p>
              <p className="text-lg font-bold text-white">{currentPlan.name}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
            currentTier === 'none' ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' :
            currentTier === 'standard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            currentTier === 'pro' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            'bg-purple-500/10 text-purple-400 border border-purple-500/30'
          }`}>
            {currentTier === 'none' ? 'Free Tier' : `${currentPlan.name.toUpperCase()} ACTIVE`}
          </span>
        </div>
        {currentTier !== 'none' && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 mb-2">Your benefits:</p>
            <div className="flex flex-wrap gap-2">
              {currentPlan.features.slice(0, 4).map((f, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-900 text-[10px] text-zinc-300">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {subscriptionPlans.map(plan => {
          const isCurrent = currentTier === plan.tier;
          const isUpgrade = plan.tier !== 'none' && !isCurrent;
          const isDowngrade = isCurrent;

          const getTierColor = () => {
            switch (plan.tier) {
              case 'standard': return { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-400' };
              case 'pro': return { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', gradient: 'from-amber-500 to-orange-400' };
              case 'elite': return { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-400' };
              default: return { border: 'border-zinc-700', bg: 'bg-zinc-900', text: 'text-zinc-400', gradient: 'from-zinc-500 to-zinc-400' };
            }
          };

          const colors = getTierColor();
          const price = billing === 'monthly' ? plan.price : plan.priceYearly;
          const isLTE = currentTier === 'none' || plan.tier === 'none';

          return (
            <div key={plan.tier} className={`relative glass-card rounded-3xl p-6 flex flex-col transition-all duration-300 ${
              plan.popular ? 'ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10 scale-[1.02]' : ''
            } ${isCurrent ? `ring-1 ${colors.border}` : 'hover:border-zinc-700'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-black" /> MOST POPULAR
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} p-0.5 mb-4`}>
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <span className={colors.text}>{TIER_ICONS[plan.tier]}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-zinc-500 mb-4">
                {plan.tier === 'none' ? 'Getting started' :
                 plan.tier === 'standard' ? 'Growing your presence' :
                 plan.tier === 'pro' ? 'Serious freelancers' :
                 'Top-tier professionals'}
              </p>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className="text-3xl font-extrabold text-white">Free</div>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-extrabold text-white">₹{price.toLocaleString()}</span>
                      <span className="text-sm text-zinc-500 mb-1">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {billing === 'yearly' && plan.price > 0 && (
                      <p className="text-[10px] text-emerald-400 mt-1">Save ₹{(plan.price * 12 - plan.priceYearly).toLocaleString()}/year</p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.tier === 'none' ? 'text-zinc-600' : colors.text}`} />
                    <span className={`text-xs ${plan.tier === 'none' ? 'text-zinc-500' : 'text-zinc-300'}`}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => isUpgrade ? handleUpgrade(plan.tier) : navigate('/settings')}
                disabled={isCurrent}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isCurrent ? 'bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-default' :
                  plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-black hover:shadow-lg hover:shadow-amber-500/20' :
                  'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md'
                }`}
              >
                {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                {isUpgrade && <ArrowRight className="w-3.5 h-3.5" />}
              </button>

              {plan.tier !== 'none' && TIER_BENEFITS[plan.tier] && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-[10px] text-zinc-500 mb-2 font-semibold uppercase tracking-wider">Key Benefits</p>
                  <div className="space-y-1.5">
                    {TIER_BENEFITS[plan.tier]?.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <span className={colors.text}>{b.icon}</span> {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto text-center">
        <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4 text-left">
          {[
            { q: 'Can I downgrade my plan?', a: 'Yes, you can switch to a lower tier at any time. Your new plan will take effect immediately, and any remaining balance will be credited as pro-rated account credit.' },
            { q: 'How does the bid boost work?', a: 'Bid boost multiplies your proposal visibility. Pro members get 2x visibility, Elite members get 5x visibility on project proposals, meaning clients see your proposal first.' },
            { q: 'What payment methods do you accept?', a: 'We accept UPI, Bank Transfer, Razorpay, and PayPal. All subscription payments are processed through our secure escrow system.' },
            { q: 'Is there a free trial for paid plans?', a: 'Yes! Pro and Elite plans come with a 7-day free trial. You can cancel anytime during the trial and you won\'t be charged.' },
          ].map((faq, i) => (
            <details key={i} className="group">
              <summary className="text-sm font-semibold text-white cursor-pointer hover:text-emerald-400 transition-colors list-none flex items-center justify-between">
                {faq.q}
                <span className="text-zinc-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed ml-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">Confirm Upgrade</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Upgrade to <span className="font-semibold text-white">{subscriptionPlans.find(p => p.tier === selectedTier)?.name}</span>?
              </p>
            </div>
            <div className="bg-zinc-900/60 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Plan</span>
                <span className="text-white font-semibold">{subscriptionPlans.find(p => p.tier === selectedTier)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Billing</span>
                <span className="text-white font-semibold">{billing === 'monthly' ? 'Monthly' : 'Yearly'}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Amount</span>
                <span className="text-emerald-400 font-bold">
                  ₹{(billing === 'monthly'
                    ? subscriptionPlans.find(p => p.tier === selectedTier)?.price
                    : subscriptionPlans.find(p => p.tier === selectedTier)?.priceYearly
                  )?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors">
                Cancel
              </button>
              <button onClick={confirmUpgrade}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-400 text-black font-bold rounded-xl text-xs transition-all hover:shadow-lg">
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
