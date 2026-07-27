import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Bell, Shield, CreditCard, Save, CheckCircle, Smartphone, Eye, EyeOff } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { users, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'payments' | 'security'>('profile');

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState('Full-stack developer passionate about building scalable web applications.');
  const [saved, setSaved] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({
    proposals: true,
    payments: true,
    orders: true,
    messages: true,
    reviews: true,
    marketing: false,
  });

  const [twoFA, setTwoFA] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-white mb-8">Settings</h1>

      <div className="flex items-center gap-1 border-b border-zinc-800 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.key ? 'text-emerald-400 border-emerald-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-4 mb-6">
            <img src={currentUser.avatar} alt="" className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40" />
            <div>
              <h3 className="text-sm font-semibold text-white">{currentUser.name}</h3>
              <p className="text-xs text-zinc-500">{currentUser.email}</p>
              <button className="text-xs text-emerald-400 hover:underline mt-1">Change avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm">
              <Save className="w-4 h-4" /> Save Changes
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <p className="text-xs text-zinc-400 mb-4">Choose what notifications you receive.</p>
          {Object.entries(notifPrefs).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
              <span className="text-sm text-zinc-300 capitalize">{key} {key === 'marketing' ? '(optional)' : ''}</span>
              <button onClick={() => setNotifPrefs(prev => ({ ...prev, [key]: !val }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${val ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm mt-4">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <span className="text-xs text-zinc-400">Current Balance</span>
            <div className="text-2xl font-bold text-white mt-1">₹{currentUser.balance.toLocaleString()}</div>
            <div className="text-xs text-zinc-500 mt-0.5">₹{currentUser.pendingBalance.toLocaleString()} pending</div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Saved Payment Methods</h3>
            {[
              { method: 'UPI', detail: 'user@paytm', default: true },
              { method: 'Bank Transfer', detail: 'HDFC Bank · xxxx1234', default: false },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 mb-2">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-sm text-white">{p.method}</span>
                    <span className="text-xs text-zinc-500 ml-2">{p.detail}</span>
                  </div>
                </div>
                {p.default && <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">Default</span>}
              </div>
            ))}
            <button className="text-xs text-emerald-400 hover:underline mt-2">+ Add payment method</button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-sm text-white">Two-Factor Authentication</span>
                <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <button onClick={() => setTwoFA(!twoFA)}
              className={`relative w-11 h-6 rounded-full transition-colors ${twoFA ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${twoFA ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white">Password</span>
              <button className="text-xs text-emerald-400 hover:underline">Change</button>
            </div>
            <p className="text-xs text-zinc-500">Last changed 3 months ago</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-zinc-300">Account security is managed through email verification and password authentication. Enable 2FA for additional protection.</p>
          </div>
        </div>
      )}
    </div>
  );
};
