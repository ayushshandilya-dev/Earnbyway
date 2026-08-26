import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Settings, Bell, Shield, Smartphone, Save, User, Mail, Lock, Globe, Clock, Building, Briefcase } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const { addToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title || '',
    company: currentUser.company || '',
    location: currentUser.location || 'Global',
    language: 'English',
    timezone: 'IST (UTC+5:30)',
    emailNotifs: true,
    pushNotifs: true,
    smsNotifs: false,
  });

  const handleSave = () => {
    updateProfile({
      name: form.name.trim() || currentUser.name,
      email: form.email.trim() || currentUser.email,
      title: form.title.trim(),
      company: currentUser.role === 'client' ? form.company.trim() : undefined,
      location: form.location.trim(),
    });
    localStorage.setItem('earnbyway_prefs', JSON.stringify({
      language: form.language,
      timezone: form.timezone,
      emailNotifs: form.emailNotifs,
      pushNotifs: form.pushNotifs,
      smsNotifs: form.smsNotifs,
    }));
    setSaved(true);
    addToast('Settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-6 space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account preferences</p>
      </div>

      <Card padding="lg">
        <CardTitle icon={<User className="w-4 h-4 text-emerald-400" />}>Profile Information</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} icon={<User className="w-4 h-4" />} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} icon={<Mail className="w-4 h-4" />} />
          <Input label="Location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} icon={<Globe className="w-4 h-4" />} />
          <Input label="Job Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} icon={<Briefcase className="w-4 h-4" />} />
          {currentUser.role === 'client' && (
            <Input label="Company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} icon={<Building className="w-4 h-4" />} />
          )}
        </div>
      </Card>

      <Card padding="lg">
        <CardTitle icon={<Globe className="w-4 h-4 text-emerald-400" />}>Preferences</CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input label="Language" value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} icon={<Globe className="w-4 h-4" />} />
          <Input label="Timezone" value={form.timezone} onChange={e => setForm(p => ({ ...p, timezone: e.target.value }))} icon={<Clock className="w-4 h-4" />} />
        </div>
      </Card>

      <Card padding="lg">
        <CardTitle icon={<Bell className="w-4 h-4 text-emerald-400" />}>Notifications</CardTitle>
        <div className="space-y-4 mt-4">
          {[
            { label: 'Email Notifications', key: 'emailNotifs' as const, desc: 'Receive updates via email' },
            { label: 'Push Notifications', key: 'pushNotifs' as const, desc: 'Receive browser notifications' },
            { label: 'SMS Notifications', key: 'smsNotifs' as const, desc: 'Receive text message alerts' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
              <div>
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="text-[11px] text-zinc-500">{item.desc}</div>
              </div>
              <button onClick={() => setForm(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form[item.key] ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${form[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end pt-2">
        <Button variant="primary" size="md" icon={<Save className="w-4 h-4" />} onClick={handleSave} btn3d>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
