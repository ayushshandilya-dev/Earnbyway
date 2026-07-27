import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import {
  X, Sparkles, ChevronLeft, ChevronRight, CheckCircle, Send,
  Hash, AlignLeft, Tag, Package, HelpCircle, Eye, Layers
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Development', 'AI', 'Graphic Design', 'Content Writing', 'Video Editing', 'Marketing', 'UI/UX Design', 'Cybersecurity'];
const SUBCATEGORIES: Record<string, string[]> = {
  'Development': ['Web Development', 'Mobile Apps', 'Backend', 'Full Stack', 'DevOps'],
  'AI': ['Machine Learning', 'Chatbots', 'Data Analysis', 'Computer Vision'],
  'Graphic Design': ['Logo Design', 'Brand Identity', 'Illustration', 'Print Design'],
  'Content Writing': ['Blog Posts', 'Copywriting', 'Technical Writing', 'Script Writing'],
  'Video Editing': ['Short Form', 'Long Form', 'Motion Graphics', '3D Animation'],
  'Marketing': ['Social Media', 'SEO', 'Email Marketing', 'PPC'],
  'UI/UX Design': ['Web Design', 'Mobile UI', 'Design Systems', 'Prototyping'],
  'Cybersecurity': ['Penetration Testing', 'Security Audit', 'Compliance'],
};

const TAGS_BY_CATEGORY: Record<string, string[]> = {
  'Development': ['React', 'Node.js', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Next.js'],
  'AI': ['GPT', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'LangChain', 'RAG'],
  'Graphic Design': ['Figma', 'Photoshop', 'Illustrator', 'Branding', 'Typography'],
  'Content Writing': ['SEO', 'Blog', 'Copywriting', 'Research', 'Editing'],
  'Video Editing': ['Premiere Pro', 'After Effects', 'DaVinci', 'Blender'],
  'Marketing': ['Meta Ads', 'Google Ads', 'Analytics', 'Content Strategy'],
  'UI/UX Design': ['Figma', 'Sketch', 'User Research', 'Wireframing', 'Prototyping'],
  'Cybersecurity': ['Network Security', 'Ethical Hacking', 'Compliance', 'Risk Assessment'],
};

type Step = 'title' | 'description' | 'pricing' | 'faqs' | 'preview';

export const CreateGigWizard: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, createGig } = useApp();
  const [step, setStep] = useState<Step>('title');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [basicPrice, setBasicPrice] = useState(3000);
  const [standardPrice, setStandardPrice] = useState(8000);
  const [premiumPrice, setPremiumPrice] = useState(15000);
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!isOpen) return null;

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'title', label: 'Title & Category', icon: <Hash className="w-4 h-4" /> },
    { key: 'description', label: 'Description', icon: <AlignLeft className="w-4 h-4" /> },
    { key: 'pricing', label: 'Pricing', icon: <Package className="w-4 h-4" /> },
    { key: 'faqs', label: 'FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  const handleAIGenerate = () => {
    if (!title.trim() || !category) return;
    const result = AIService.generateGigDetails(title, category);
    setDescription(result.description);
    setTags(result.tags);
  };

  const handlePublish = () => {
    createGig({
      title,
      freelancerId: currentUser.id,
      freelancerName: currentUser.name,
      freelancerAvatar: currentUser.avatar,
      freelancerTitle: currentUser.title || '',
      category,
      subcategory: subcategory || category,
      tags,
      description,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      galleryImages: [],
      startingPrice: basicPrice,
      packages: {
        basic: { name: 'Basic', title: 'Starter Package', price: basicPrice, description: 'Essential deliverables with 2 revisions.', deliveryDays: 3, revisions: 2, features: ['Core deliverable', '2 revisions', 'Source files'] },
        standard: { name: 'Standard', title: 'Professional Package', price: standardPrice, description: 'Extended features with 4 revisions.', deliveryDays: 5, revisions: 4, features: ['Everything in Basic', 'Extended features', '4 revisions', 'Priority support'] },
        premium: { name: 'Premium', title: 'Enterprise Package', price: premiumPrice, description: 'Full solution with unlimited revisions.', deliveryDays: 7, revisions: 99, features: ['Everything in Standard', 'Unlimited revisions', '24/7 priority support', 'Full ownership'] },
      },
      faqs: faqs.map(f => ({ question: f.q, answer: f.a })),
      requirements: requirements.length > 0 ? requirements : ['Project brief', 'Brand assets', 'Reference examples'],
    });
    setPublishSuccess(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('title');
      setTitle(''); setCategory(''); setSubcategory(''); setDescription(''); setTags([]);
      setBasicPrice(3000); setStandardPrice(8000); setPremiumPrice(15000);
      setFaqs([]); setRequirements([]); setPublishSuccess(false);
    }, 300);
  };

  const renderStep = () => {
    switch (step) {
      case 'title':
        return (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Gig Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., I will build a modern React & Node.js web application"
                className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => { setCategory(c); setSubcategory(''); }}
                    className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      category === c ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}>{c}</button>
                ))}
              </div>
            </div>
            {category && (
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Subcategory</label>
                <div className="flex flex-wrap gap-2">
                  {SUBCATEGORIES[category]?.map(s => (
                    <button key={s} onClick={() => setSubcategory(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                        subcategory === s ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'description':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-400">Description</label>
              <button onClick={handleAIGenerate}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:border-emerald-400 transition-all">
                <Sparkles className="w-3 h-3" /> AI Generate
              </button>
            </div>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe your gig in detail..."
              rows={6} className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" />
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(category ? TAGS_BY_CATEGORY[category] || [] : []).map(t => (
                  <button key={t} onClick={() => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                    className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                      tags.includes(t) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}>{t}</button>
                ))}
              </div>
              <input type="text" placeholder="Type a custom tag and press Enter"
                onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) { setTags(prev => [...prev, (e.target as HTMLInputElement).value.trim()]); (e.target as HTMLInputElement).value = ''; } }}
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-5">
            {(['basic', 'standard', 'premium'] as const).map(tier => {
              const label = tier.charAt(0).toUpperCase() + tier.slice(1);
              const price = tier === 'basic' ? basicPrice : tier === 'standard' ? standardPrice : premiumPrice;
              const setPrice = tier === 'basic' ? setBasicPrice : tier === 'standard' ? setStandardPrice : setPremiumPrice;
              return (
                <div key={tier} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">{label} Package</span>
                    <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white text-right focus:outline-none focus:border-emerald-500" />
                  </div>
                  <p className="text-xs text-zinc-500">
                    {tier === 'basic' ? 'Essential starter package with core deliverables and 2 revisions.'
                    : tier === 'standard' ? 'Most popular — extended features, 4 revisions, and priority support.'
                    : 'Full enterprise solution with unlimited revisions and 24/7 priority support.'}
                  </p>
                </div>
              );
            })}
          </div>
        );

      case 'faqs':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Requirements (one per line)</label>
              <textarea value={requirements.join('\n')} onChange={e => setRequirements(e.target.value.split('\n').filter(Boolean))}
                placeholder="What do you need from buyers?"
                rows={3} className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">FAQs</label>
              {faqs.map((faq, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input type="text" value={faq.q} onChange={e => { const n = [...faqs]; n[i].q = e.target.value; setFaqs(n); }}
                    placeholder="Question" className="flex-1 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500" />
                  <input type="text" value={faq.a} onChange={e => { const n = [...faqs]; n[i].a = e.target.value; setFaqs(n); }}
                    placeholder="Answer" className="flex-1 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500" />
                  <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:text-red-300">&times;</button>
                </div>
              ))}
              <button onClick={() => setFaqs([...faqs, { q: '', a: '' }])}
                className="text-xs text-emerald-400 hover:underline">+ Add FAQ</button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-white mb-1">{title || 'Untitled Gig'}</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{category || 'Category'}</span>
                {subcategory && <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">{subcategory}</span>}
              </div>
              <p className="text-xs text-zinc-400 mb-4">{description || 'No description yet.'}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{t}</span>)}
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[{ name: 'Basic', price: basicPrice }, { name: 'Standard', price: standardPrice }, { name: 'Premium', price: premiumPrice }].map(p => (
                  <div key={p.name} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                    <div className="text-[10px] font-bold text-zinc-500 mb-1">{p.name}</div>
                    <div className="text-sm font-bold text-emerald-400">₹{p.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-zinc-300">Your gig will be published immediately and visible in search results.</p>
            </div>
          </div>
        );
    }
  };

  if (publishSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-white mb-2">Gig Published!</h2>
          <p className="text-sm text-zinc-400 mb-6">Your gig "{title}" is now live on the marketplace.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleClose}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm">Done</button>
            <button onClick={() => { handleClose(); navigate('/gigs'); }}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl transition-all text-sm">View Gigs</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#121215] z-10 border-b border-zinc-800 p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-white">Create a Gig</h2>
            <button onClick={handleClose} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 pb-4 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <button onClick={() => setStep(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                    step === s.key ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' :
                    i < currentIdx ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-zinc-900 border-zinc-800 text-zinc-500'
                  }`}>
                  {i < currentIdx ? <CheckCircle className="w-3 h-3" /> : s.icon}
                  {s.label}
                </button>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-zinc-700" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {renderStep()}
        </div>

        <div className="border-t border-zinc-800 p-4 flex items-center justify-between">
          <button onClick={() => { if (currentIdx > 0) setStep(steps[currentIdx - 1].key); else handleClose(); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs text-zinc-300 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> {currentIdx === 0 ? 'Cancel' : 'Back'}
          </button>
          {step === 'preview' ? (
            <button onClick={handlePublish}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
              <Send className="w-3.5 h-3.5" /> Publish Gig
            </button>
          ) : (
            <button onClick={() => setStep(steps[currentIdx + 1].key)}
              className="flex items-center gap-1.5 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
