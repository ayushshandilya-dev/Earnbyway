import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { AIService } from '../../services/aiService';
import { FormField } from '../ui/FormField';
import {
  X, ChevronLeft, ChevronRight, CheckCircle, Send, AlertTriangle,
  Hash, AlignLeft, Tag, Clock
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Development', 'AI', 'Graphic Design', 'Content Writing', 'Video Editing', 'Marketing', 'UI/UX Design', 'Cybersecurity'];

type Step = 'title' | 'description' | 'skills' | 'budget' | 'preview';

export const PostProjectWizard: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, postProject } = useApp();
  const { addToast } = useToast();
  const [step, setStep] = useState<Step>('title');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [budget, setBudget] = useState(25000);
  const [duration, setDuration] = useState('2-3 Weeks');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const scamCheck = description ? AIService.analyzeScamRisk(description) : null;

  const validateStep = (s: Step): boolean => {
    const errs: Record<string, string | null> = {};
    if (s === 'title') { errs.title = title.trim() ? null : 'Enter a project title'; errs.category = category ? null : 'Select a category'; }
    if (s === 'description') errs.description = description.trim().length >= 20 ? null : 'Description must be at least 20 characters';
    if (s === 'budget') errs.budget = budget >= 1000 ? null : 'Minimum budget is ₹1,000';
    const hasErrors = Object.values(errs).some(Boolean);
    setTouched(prev => ({ ...prev, ...Object.fromEntries(Object.keys(errs).map(k => [k, true])) }));
    return !hasErrors;
  };

  if (!isOpen) return null;

  const steps: { key: Step; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'skills', label: 'Skills' },
    { key: 'budget', label: 'Budget' },
    { key: 'preview', label: 'Preview' },
  ];
  const currentIdx = steps.findIndex(s => s.key === step);

  const handlePublish = () => {
    if (!title.trim() || !category || description.trim().length < 20 || budget < 1000) {
      if (!title.trim()) setTouched(p => ({ ...p, title: true }));
      if (!category) setTouched(p => ({ ...p, category: true }));
      if (description.trim().length < 20) setTouched(p => ({ ...p, description: true }));
      if (budget < 1000) setTouched(p => ({ ...p, budget: true }));
      addToast('Please fix validation errors before publishing', 'error');
      return;
    }
    postProject({
      title,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      clientCompany: currentUser.company || '',
      budget,
      category,
      skills,
      description,
      duration,
    });
    setPublishSuccess(true);
    addToast('Project posted successfully!', 'success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('title'); setTitle(''); setCategory(''); setDescription('');
      setSkills([]); setBudget(25000); setDuration('2-3 Weeks');
      setPublishSuccess(false);
    }, 300);
  };

  if (publishSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white mb-2">Project Posted!</h2>
          <p className="text-sm text-zinc-400 mb-6">Your project is live and open for proposals.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleClose} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm">Done</button>
            <button onClick={() => { handleClose(); navigate('/projects'); }} className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl transition-all text-sm">View Projects</button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 'title':
        return (
          <div className="space-y-5">
            <FormField label="Project Title" error={touched.title ? (!title.trim() ? 'Enter a project title' : null) : null} touched required>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Need a React developer for e-commerce platform"
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
            </FormField>
            <FormField label="Category" error={touched.category ? (!category ? 'Select a category' : null) : null} touched required>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setCategory(c)}
                    className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      category === c ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}>{c}</button>
                ))}
              </div>
            </FormField>
          </div>
        );

      case 'description':
        return (
          <div className="space-y-4">
            <FormField label="Detailed Description" error={touched.description ? (description.trim().length < 20 ? 'Description must be at least 20 characters' : null) : null} touched required>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
                placeholder="Describe your project in detail — what you need, tech stack, goals..."
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" />
            </FormField>
            {scamCheck && description.length > 20 && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                scamCheck.riskScore === 'High' ? 'bg-red-500/10 border-red-500/30' :
                scamCheck.riskScore === 'Medium' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                {scamCheck.riskScore !== 'Low' ? <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /> : <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <div className={`text-xs font-bold ${scamCheck.riskScore === 'High' ? 'text-red-400' : scamCheck.riskScore === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    AI Fraud Check: {scamCheck.riskScore} Risk
                  </div>
                  {scamCheck.warnings.map((w, i) => <p key={i} className="text-[10px] text-zinc-400 mt-1">{w}</p>)}
                  {scamCheck.trustSignals.map((t, i) => <p key={i} className="text-[10px] text-emerald-400 mt-1">✓ {t}</p>)}
                </div>
              </div>
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Required Skills</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {['React', 'Node.js', 'TypeScript', 'Python', 'Figma', 'UI/UX', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Next.js', 'Tailwind', 'AI/ML'].map(s => (
                <button key={s} onClick={() => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    skills.includes(s) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}>{s}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customSkill} onChange={e => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..." className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              <button onClick={() => { if (customSkill.trim()) { setSkills(prev => [...prev, customSkill.trim()]); setCustomSkill(''); } }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs transition-colors">Add</button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 flex items-center gap-1">
                    {s}
                    <button onClick={() => setSkills(prev => prev.filter(x => x !== s))} className="hover:text-red-400">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-5">
            <FormField label="Budget (₹)" error={touched.budget ? (budget < 1000 ? 'Minimum budget is ₹1,000' : null) : null} touched required>
              <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} min={1000}
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" />
              <div className="flex gap-1.5 mt-2">
                {[10000, 25000, 50000, 100000].map(v => (
                  <button key={v} type="button" onClick={() => setBudget(v)}
                    className={`px-3 py-1 rounded-lg text-[10px] border transition-colors ${
                      budget === v ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                    }`}>₹{v.toLocaleString()}</button>
                ))}
              </div>
            </FormField>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Estimated Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {['1 Week', '2 Weeks', '2-3 Weeks', '1 Month', '2-3 Months', '3+ Months'].map(d => (
                  <button key={d} onClick={() => setDuration(d)}
                    className={`p-2.5 rounded-xl text-xs border transition-all ${
                      duration === d ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-2">{title || 'Untitled Project'}</h3>
              <div className="flex items-center gap-2 mb-3">
                {category && <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-semibold">{category}</span>}
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400"><Clock className="w-3 h-3" /> {duration}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-4">{description}</p>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skills.map(s => <span key={s} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{s}</span>)}
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">Budget</span>
                <span className="text-xl font-bold text-emerald-400">₹{budget.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-zinc-300">Your project will be posted and open for freelancer proposals immediately.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#121215] z-10 border-b border-zinc-800 p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-white">Post a Project</h2>
            <button onClick={handleClose} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center gap-2 pb-4 overflow-x-auto">
            {steps.map((s, i) => (
              <button key={s.key} onClick={() => i < currentIdx && setStep(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  step === s.key ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' :
                  i < currentIdx ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}>
                {i < currentIdx ? <CheckCircle className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">{renderStep()}</div>
        <div className="border-t border-zinc-800 p-4 flex items-center justify-between">
          <button onClick={() => { if (currentIdx > 0) setStep(steps[currentIdx - 1].key); else handleClose(); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> {currentIdx === 0 ? 'Cancel' : 'Back'}
          </button>
          {step === 'preview' ? (
            <button onClick={handlePublish}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
              <Send className="w-3.5 h-3.5" /> Post Project
            </button>
          ) : (
            <button onClick={() => { if (validateStep(step)) setStep(steps[currentIdx + 1].key); }}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
