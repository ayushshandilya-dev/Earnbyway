import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import {
  Sparkles, Search, FileText, Image, Users, Shield, UserCheck,
  Star, AlertTriangle, CheckCircle, X, ArrowRight, Copy, Loader2
} from 'lucide-react';

type AITab = 'search' | 'proposal' | 'gig' | 'matcher' | 'resume' | 'fraud';

const TABS: { key: AITab; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'search', label: 'Smart Search', icon: <Search className="w-4 h-4" />, desc: 'Parse natural language into structured filters' },
  { key: 'proposal', label: 'Proposal Gen', icon: <FileText className="w-4 h-4" />, desc: 'Auto-generate cover letters with milestones' },
  { key: 'gig', label: 'Gig Desc Gen', icon: <Image className="w-4 h-4" />, desc: 'Generate descriptions & package tiers' },
  { key: 'matcher', label: 'Matcher', icon: <Users className="w-4 h-4" />, desc: 'Rank freelancers by skill match score' },
  { key: 'resume', label: 'Resume Analyzer', icon: <UserCheck className="w-4 h-4" />, desc: 'Score profiles with recommendations' },
  { key: 'fraud', label: 'Fraud Detector', icon: <Shield className="w-4 h-4" />, desc: 'Detect scam & off-platform payment requests' },
];

export const AIToolsPlayground: React.FC = () => {
  const { gigs, users, profiles, projects, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<AITab>('search');
  const [copied, setCopied] = useState<string | null>(null);

  const freelancers = users.filter(u => u.role === 'freelancer' && profiles[u.id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> AI Services Playground
        </div>
        <h1 className="text-3xl font-heading font-bold text-white mb-3">AI-Powered Tools</h1>
        <p className="text-sm text-zinc-400">Explore all 6 intelligent services powering the marketplace.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm'
                : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'search' && <SmartSearchTab gigs={gigs} copyToClipboard={copyToClipboard} copied={copied} />}
        {activeTab === 'proposal' && <ProposalTab projects={projects} profiles={profiles} currentUser={currentUser} copyToClipboard={copyToClipboard} copied={copied} />}
        {activeTab === 'gig' && <GigDescTab copyToClipboard={copyToClipboard} copied={copied} />}
        {activeTab === 'matcher' && <MatcherTab users={freelancers} profiles={profiles} copyToClipboard={copyToClipboard} copied={copied} />}
        {activeTab === 'resume' && <ResumeTab freelancers={freelancers} profiles={profiles} copyToClipboard={copyToClipboard} copied={copied} />}
        {activeTab === 'fraud' && <FraudTab copyToClipboard={copyToClipboard} copied={copied} />}
      </div>
    </div>
  );
};

const ResultBox: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mt-4">
    <h4 className="text-xs font-semibold text-zinc-400 mb-2">{label}</h4>
    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
      {children}
    </div>
  </div>
);

const CopyButton: React.FC<{ text: string; label: string; copied: string | null }> = ({ text, label, copied }) => (
  <button onClick={() => navigator.clipboard.writeText(text)}
    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] transition-colors">
    {copied === label ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    {copied === label ? 'Copied!' : 'Copy'}
  </button>
);

/* ──────────── 1. Smart Search ──────────── */
const SmartSearchTab: React.FC<{ gigs: any[]; copyToClipboard: any; copied: any }> = ({ gigs }) => {
  const [query, setQuery] = useState('Need a React developer under ₹25k with 5★ rating');
  const parsed = AIService.parseNaturalLanguageSearch(query);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Natural Language Search Parser</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Type a search query and see how AI extracts structured filters in real-time.</p>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Type a natural language search..."
        className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60" />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Keyword', value: parsed.keyword || '—' },
          { label: 'Category', value: parsed.category || '—' },
          { label: 'Max Price', value: parsed.maxPrice ? `₹${parsed.maxPrice.toLocaleString()}` : '—' },
          { label: 'Min Rating', value: parsed.minRating ? `${parsed.minRating}★` : '—' },
          { label: 'Skills', value: parsed.skills?.length ? parsed.skills.join(', ') : '—' },
        ].map(item => (
          <div key={item.label} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 mb-1">{item.label}</div>
            <div className="text-xs text-white font-medium truncate">{item.value}</div>
          </div>
        ))}
      </div>
      {gigs.length > 0 && (
        <ResultBox label={`Matching Gigs (${gigs.length} total)`}>
          {gigs.slice(0, 3).map(g => `• ${g.title} — ₹${g.startingPrice.toLocaleString()} (${g.rating}★)`).join('\n')}
        </ResultBox>
      )}
    </div>
  );
};

/* ──────────── 2. Proposal Generator ──────────── */
const ProposalTab: React.FC<{ projects: any[]; profiles: any; currentUser: any; copyToClipboard: any; copied: any }> = ({ projects, profiles, currentUser }) => {
  const [selectedProj, setSelectedProj] = useState(projects[0]?.id || '');
  const project = projects.find(p => p.id === selectedProj);
  const myProfile = profiles[currentUser.id];
  const result = project && myProfile ? AIService.generateProposal(project, myProfile, currentUser) : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">AI Proposal Generator</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Select a project and auto-generate a tailored cover letter with suggested bid and milestones.</p>
      <select value={selectedProj} onChange={e => setSelectedProj(e.target.value)}
        className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 mb-4">
        {projects.map(p => <option key={p.id} value={p.id}>{p.title} — ₹{p.budget.toLocaleString()}</option>)}
      </select>
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-500">Suggested Bid</div>
              <div className="text-sm font-bold text-emerald-400">₹{result.suggestedBid.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-500">Timeline</div>
              <div className="text-sm font-bold text-white">{result.suggestedDays} days</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-[10px] text-zinc-500">Milestones</div>
              <div className="text-sm font-bold text-white">{result.keyMilestones.length}</div>
            </div>
          </div>
          <ResultBox label="Generated Cover Letter">
            {result.coverLetter}
          </ResultBox>
          {result.keyMilestones.length > 0 && (
            <ResultBox label="Suggested Milestones">
              {result.keyMilestones.map(m => `• ${m.title} (${m.percentage}%)`).join('\n')}
            </ResultBox>
          )}
        </div>
      )}
    </div>
  );
};

/* ──────────── 3. Gig Description Generator ──────────── */
const GigDescTab: React.FC<{ copyToClipboard: any; copied: any }> = () => {
  const [title, setTitle] = useState('Full Stack React & Node.js Web Application');
  const [category, setCategory] = useState('Development');
  const result = AIService.generateGigDetails(title, category);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Image className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">Gig Description Generator</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Enter a title + category and AI generates a full description and package tiers.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Gig title" className="px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" />
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500">
          {['Development', 'AI', 'Design', 'Writing', 'Video', 'Marketing'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <ResultBox label="Generated Description">{result.description}</ResultBox>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Basic</div>
          <div className="text-xs text-white font-semibold mb-1">{result.basicTitle}</div>
          <div className="text-[10px] text-zinc-400">{result.basicDesc}</div>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30">
          <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Standard</div>
          <div className="text-xs text-white font-semibold mb-1">{result.standardTitle}</div>
          <div className="text-[10px] text-zinc-400">{result.standardDesc}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Premium</div>
          <div className="text-xs text-white font-semibold mb-1">{result.premiumTitle}</div>
          <div className="text-[10px] text-zinc-400">{result.premiumDesc}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {result.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">{t}</span>)}
      </div>
    </div>
  );
};

/* ──────────── 4. Freelancer Matcher ──────────── */
const MatcherTab: React.FC<{ users: any[]; profiles: any; copyToClipboard: any; copied: any }> = ({ users, profiles }) => {
  const [brief, setBrief] = useState('Looking for a React developer with TypeScript and Node.js experience for a SaaS analytics dashboard.');
  const matches = AIService.matchFreelancers(brief, profiles, users);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">AI Freelancer Matcher</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Paste a project brief and see ranked freelancer matches with scores.</p>
      <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={3}
        placeholder="Describe your project..."
        className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none mb-4" />
      {matches.map((m, i) => (
        <div key={m.user.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-2">
          <span className="text-xs text-zinc-500 w-6">{i + 1}.</span>
          <img src={m.user.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-white">{m.user.name}</div>
            <div className="text-[10px] text-zinc-500">{m.profile.title}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-400">{m.matchPercentage}%</div>
            <div className="text-[10px] text-zinc-500">Match</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ──────────── 5. Resume Analyzer ──────────── */
const ResumeTab: React.FC<{ freelancers: any[]; profiles: any; copyToClipboard: any; copied: any }> = ({ freelancers, profiles }) => {
  const [selectedId, setSelectedId] = useState(freelancers[0]?.id || '');
  const profile = profiles[selectedId];
  const analysis = profile ? AIService.analyzeProfile(profile) : null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <UserCheck className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">AI Resume & Profile Analyzer</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Select a freelancer to see their AI-powered profile score and recommendations.</p>
      <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
        className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 mb-4">
        {freelancers.map(f => <option key={f.id} value={f.id}>{f.name} — {profiles[f.id]?.title}</option>)}
      </select>
      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${analysis.score >= 80 ? 'bg-emerald-500' : analysis.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${analysis.score}%` }} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              analysis.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
              analysis.score >= 60 ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>{analysis.score}/100</span>
          </div>
          {analysis.strengths.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-emerald-400 mb-2">Strengths</h4>
              {analysis.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /> {s}
                </div>
              ))}
            </div>
          )}
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-400 mb-2">Recommendations</h4>
              {analysis.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" /> {r}
                </div>
              ))}
            </div>
          )}
          {analysis.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-400 mb-2">Missing Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missingSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[10px] text-red-400">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ──────────── 6. Fraud Detector ──────────── */
const FraudTab: React.FC<{ copyToClipboard: any; copied: any }> = () => {
  const [text, setText] = useState('Please contact me on Telegram for faster communication. We can arrange payment outside the platform to avoid fees.');
  const result = AIService.analyzeScamRisk(text);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h2 className="text-lg font-semibold text-white">AI Fraud & Scam Detector</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">Paste any text (project description, message, etc.) to check for scam indicators.</p>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
        placeholder="Paste text to analyze..."
        className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none mb-4" />
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        result.riskScore === 'High' ? 'bg-red-500/10 border-red-500/30' :
        result.riskScore === 'Medium' ? 'bg-amber-500/10 border-amber-500/30' :
        'bg-emerald-500/10 border-emerald-500/30'
      }`}>
        {result.riskScore === 'High' ? <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /> :
         result.riskScore === 'Medium' ? <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" /> :
         <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
        <div>
          <div className={`text-sm font-bold ${
            result.riskScore === 'High' ? 'text-red-400' :
            result.riskScore === 'Medium' ? 'text-amber-400' :
            'text-emerald-400'
          }`}>Risk Score: {result.riskScore}</div>
          {result.warnings.map((w, i) => <p key={i} className="text-xs text-zinc-300 mt-1">{w}</p>)}
          {result.trustSignals.map((t, i) => <p key={i} className="text-xs text-emerald-400 mt-1">✓ {t}</p>)}
        </div>
      </div>
    </div>
  );
};
