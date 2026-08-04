import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Project } from '../../types';
import { AIService } from '../../services/aiService';
import { ArrowLeft, Clock, Users, CheckCircle, Send, Sparkles, X, AlertTriangle } from 'lucide-react';

interface Props {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<Props> = ({ project, onBack }) => {
  const { currentRole, currentUser, profiles, submitProposal } = useApp();
  const { addToast } = useToast();
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState(project.budget);
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [submitted, setSubmitted] = useState(false);

  const isFreelancer = currentRole === 'freelancer';
  const isClient = currentRole === 'client';
  const myProposal = project.proposals.find(p => p.freelancerId === currentUser.id);
  const scamCheck = AIService.analyzeScamRisk(project.description);

  const handleAIGenerate = () => {
    const myProfile = profiles[currentUser.id];
    if (!myProfile) {
      addToast('Add your freelancer profile first to use AI generation', 'error');
      return;
    }
    const result = AIService.generateProposal(project, myProfile, currentUser);
    setCoverLetter(result.coverLetter);
    setBidAmount(result.suggestedBid);
    setEstimatedDays(result.suggestedDays);
  };

  const handleSubmit = () => {
    if (bidAmount > project.budget) {
      addToast(`Bid exceeds project budget (₹${project.budget.toLocaleString()})`, 'error');
      return;
    }
    const myProfile = profiles[currentUser.id];
    submitProposal({
      projectId: project.id,
      freelancerId: currentUser.id,
      freelancerName: currentUser.name,
      freelancerAvatar: currentUser.avatar,
      freelancerRating: myProfile?.rating ?? 0,
      freelancerTitle: currentUser.title || myProfile?.title || '',
      coverLetter,
      bidAmount,
      estimatedDays,
    });
    setSubmitted(true);
    setShowProposalForm(false);
  };

  return (
    <div className="py-8 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to projects board
      </button>

      {submitted && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-white">Proposal Submitted!</h3>
            <p className="text-xs text-zinc-400 mt-1">Your proposal for "{project.title}" has been sent to {project.clientName}.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
                {project.category}
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                project.status === 'open' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                project.status === 'hired' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </div>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-4">{project.title}</h1>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{project.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {project.skills.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {project.status === 'open' && scamCheck.warnings.length > 0 && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              scamCheck.riskScore === 'High' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${scamCheck.riskScore === 'High' ? 'text-red-400' : 'text-amber-400'}`} />
              <div>
                <h3 className="text-sm font-semibold text-white">AI Risk Detection: {scamCheck.riskScore} Risk</h3>
                {scamCheck.warnings.map((w, i) => (
                  <p key={i} className="text-xs text-zinc-400 mt-1">{w}</p>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">About the Client</h2>
            <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
              <img src={project.clientAvatar} alt="" className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-500/40" />
              <div>
                <h3 className="font-semibold text-white">{project.clientName}</h3>
                {project.clientCompany && <p className="text-xs text-zinc-400">{project.clientCompany}</p>}
                <p className="text-xs text-zinc-500 mt-1">Posted on {project.createdAt}</p>
              </div>
            </div>
          </div>

          {isClient && project.proposals.length > 0 && (
            <div>
              <h2 className="text-lg font-heading font-bold text-white mb-4">Proposals ({project.proposalCount})</h2>
              <div className="space-y-3">
                {project.proposals.map(p => (
                  <div key={p.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <img src={p.freelancerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm text-white">{p.freelancerName}</h4>
                          <div className="text-right">
                            <div className="text-sm font-bold text-emerald-400">₹{p.bidAmount.toLocaleString()}</div>
                            <div className="text-[10px] text-zinc-500">{p.estimatedDays} days</div>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 mb-2">{p.freelancerTitle}</p>
                        <p className="text-xs text-zinc-500 line-clamp-3">{p.coverLetter}</p>
                        <div className={`mt-2 inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          p.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}>
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isClient && project.proposals.length === 0 && (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No proposals yet. Share this project to attract freelancers.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel rounded-2xl p-5 sticky top-28 space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Budget</span>
                <span className="text-xl font-bold text-emerald-400">₹{project.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Duration</span>
                <span className="text-white flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Category</span>
                <span className="text-white">{project.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Proposals</span>
                <span className="text-white">{project.proposalCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Posted</span>
                <span className="text-white">{project.createdAt}</span>
              </div>
            </div>

            {isFreelancer && project.status === 'open' && !myProposal && !showProposalForm && (
              <button
                onClick={() => setShowProposalForm(true)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm"
              >
                Submit Proposal
              </button>
            )}

            {isFreelancer && myProposal && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-emerald-400 font-semibold">Proposal Submitted</p>
                <p className="text-[10px] text-zinc-500">₹{myProposal.bidAmount.toLocaleString()} · {myProposal.estimatedDays} days</p>
              </div>
            )}
          </div>

          {showProposalForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowProposalForm(false)}>
              <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-heading font-bold text-white">Submit Proposal</h2>
                  <button onClick={() => setShowProposalForm(false)} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-zinc-400">Cover Letter</label>
                      <button
                        onClick={handleAIGenerate}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold hover:border-emerald-400 transition-all"
                      >
                        <Sparkles className="w-3 h-3" /> AI Generate
                      </button>
                    </div>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Write your proposal or use AI to generate..."
                      rows={6}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Bid Amount (₹) <span className="text-zinc-600">· max ₹{project.budget.toLocaleString()}</span></label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Estimated Days</label>
                      <input
                        type="number"
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!coverLetter.trim() || bidAmount <= 0}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm"
                  >
                    <Send className="w-4 h-4" /> Submit Proposal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
