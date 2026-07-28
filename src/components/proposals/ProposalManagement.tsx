import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Project } from '../../types';
import {
  CheckCircle, XCircle, Star, MessageSquare, ChevronDown, ChevronUp,
  Users, Clock, Briefcase, Filter, Search as SearchIcon
} from 'lucide-react';

export const ProposalManagement: React.FC = () => {
  const { projects, currentUser, acceptProposal } = useApp();
  const { addToast } = useToast();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const myProjects = projects.filter(p => p.clientId === currentUser.id);
  const hasProposals = myProjects.some(p => p.proposals.length > 0);

  const getFilteredProposals = (project: Project) => {
    let props = project.proposals;
    if (statusFilter !== 'all') props = props.filter(p => p.status === statusFilter);
    if (searchQuery) props = props.filter(p =>
      p.freelancerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.coverLetter.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return props;
  };

  const handleAccept = (projectId: string, proposalId: string) => {
    acceptProposal(projectId, proposalId);
    addToast('Proposal accepted — escrow order created!', 'success');
  };

  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Proposal Management</h1>
        <p className="text-sm text-zinc-400 mt-1">Review and manage freelancer proposals for your projects.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                statusFilter === s ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white'
              }`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>

      {!hasProposals ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">No proposals received</h3>
          <p className="text-sm text-zinc-600">Post a project to start receiving proposals from freelancers.</p>
        </div>
      ) : (
        myProjects.filter(p => p.proposals.length > 0).map(project => {
          const filtered = getFilteredProposals(project);
          const isExpanded = expandedProject === project.id;
          return (
            <div key={project.id} className="glass-card rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-zinc-900/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {project.category}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {project.proposalCount} proposals</span>
                    <span className="text-emerald-400 font-semibold">₹{project.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border ${
                    project.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>{project.status}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-zinc-800/60 pt-4 space-y-3 animate-in fade-in slide-in-from-top-1">
                  {filtered.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-6">No proposals match the current filter.</p>
                  ) : (
                    filtered.map(prop => (
                      <div key={prop.id} className={`p-4 rounded-xl border ${
                        prop.status === 'accepted' ? 'bg-emerald-500/5 border-emerald-500/30' :
                        prop.status === 'rejected' ? 'bg-red-500/5 border-red-500/30' :
                        'bg-zinc-900/50 border-zinc-800'
                      }`}>
                        <div className="flex items-start gap-4">
                          <img src={prop.freelancerAvatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <span className="text-sm font-semibold text-white">{prop.freelancerName}</span>
                                <span className="text-xs text-zinc-500 ml-2">{prop.freelancerTitle}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-emerald-400">₹{prop.bidAmount.toLocaleString()}</div>
                                <div className="text-[10px] text-zinc-500">{prop.estimatedDays} days</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {prop.freelancerRating}</span>
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{prop.coverLetter}</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                prop.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                prop.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                'bg-red-500/10 text-red-400 border-red-500/30'
                              }`}>{prop.status}</span>
                              {prop.status === 'pending' && (
                                <div className="flex items-center gap-1.5 ml-auto">
                                  <button onClick={() => handleAccept(project.id, prop.id)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-[10px]">
                                    <CheckCircle className="w-3 h-3" /> Accept
                                  </button>
                                  <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl transition-all text-[10px]">
                                    <XCircle className="w-3 h-3" /> Reject
                                  </button>
                                  <button className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl transition-all text-[10px]">
                                    <MessageSquare className="w-3 h-3" /> Chat
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
