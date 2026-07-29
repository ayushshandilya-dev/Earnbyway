import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Order } from '../../types';
import { CheckCircle, Clock, Upload, Send, FileText, X, ChevronDown, ChevronUp, ShieldCheck, DollarSign, Trello } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export const OrderDashboard: React.FC = () => {
  const { orders, currentUser, submitMilestoneDeliverable, approveMilestoneEscrow } = useApp();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [submitModal, setSubmitModal] = useState<{ orderId: string; milestoneId: string } | null>(null);
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableFile, setDeliverableFile] = useState('');

  const myOrders = orders.filter(o => o.clientId === currentUser.id || o.freelancerId === currentUser.id);
  const isFreelancer = currentUser.role === 'freelancer';

  const handleSubmit = () => {
    if (!submitModal || !deliverableNote.trim()) return;
    submitMilestoneDeliverable(submitModal.orderId, submitModal.milestoneId, deliverableNote, deliverableFile || undefined);
    addToast('Deliverable submitted!', 'success');
    setSubmitModal(null);
    setDeliverableNote('');
    setDeliverableFile('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded': return 'bg-zinc-700 text-zinc-300';
      case 'submitted': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'released': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default: return 'bg-zinc-800 text-zinc-500';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'under_review': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  return (
    <div className="py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white">Order Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">{myOrders.length} {myOrders.length === 1 ? 'order' : 'orders'}</p>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState icon="order" title="No orders yet" description="Orders will appear once a proposal is accepted and escrow is funded." />
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="glass-card rounded-2xl overflow-hidden">
                <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-zinc-900/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{order.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getOrderStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {isFreelancer ? `Client: ${order.clientName}` : `Freelancer: ${order.freelancerName}`} · {order.createdAt}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="text-sm text-zinc-500">Total</div>
                      <div className="text-lg font-bold text-emerald-400">₹{order.totalPrice.toLocaleString()}</div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-zinc-800/60 pt-4 animate-in fade-in slide-in-from-top-1">
                    <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-zinc-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Escrow Balance
                        </div>
                        <span className="text-sm font-bold text-emerald-400">₹{order.escrowBalance.toLocaleString()}</span>
                      </div>
                      <button onClick={() => navigate(`/workspace/${order.id}`)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all h-[46px]">
                        <Trello className="w-4 h-4" /> Go to Shared Workspace
                      </button>
                    </div>

                    <div className="space-y-3">
                      {order.milestones.map((m, i) => {
                        const isNextAction = isFreelancer && m.status === 'funded' && i === order.milestones.findIndex(mm => mm.status === 'funded');
                        const canApprove = !isFreelancer && m.status === 'submitted';
                        return (
                          <div key={m.id} className={`p-4 rounded-xl border transition-all ${
                            m.status === 'released' ? 'bg-emerald-500/5 border-emerald-500/30' :
                            m.status === 'submitted' ? 'bg-amber-500/5 border-amber-500/30' :
                            'bg-zinc-900/50 border-zinc-800'
                          }`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-xs font-bold text-zinc-400 flex items-center justify-center">{i + 1}</span>
                                  <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                  <span className="text-emerald-400 font-medium">₹{m.amount.toLocaleString()} ({m.percentage}%)</span>
                                  <span>Due: {m.dueDate}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(m.status)}`}>
                                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                                  </span>
                                </div>
                                {m.deliverableNote && (
                                  <div className="mt-2 p-2 rounded-lg bg-zinc-900 text-xs text-zinc-400">
                                    <span className="text-zinc-500">Note: </span>{m.deliverableNote}
                                  </div>
                                )}
                                {m.deliverableFile && (
                                  <a href={m.deliverableFile} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400 hover:underline">
                                    <FileText className="w-3 h-3" /> Download Deliverable
                                  </a>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isNextAction && (
                                  <button onClick={() => setSubmitModal({ orderId: order.id, milestoneId: m.id })}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
                                    <Upload className="w-3.5 h-3.5" /> Submit
                                  </button>
                                )}
                                {canApprove && (
                                  <button onClick={() => { approveMilestoneEscrow(order.id, m.id); addToast('Milestone approved — payment released!', 'success'); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-xs">
                                    <CheckCircle className="w-3.5 h-3.5" /> Approve & Release
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSubmitModal(null)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-white">Submit Milestone Deliverable</h2>
              <button onClick={() => setSubmitModal(null)} className="p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Delivery Note</label>
                <textarea value={deliverableNote} onChange={e => setDeliverableNote(e.target.value)}
                  placeholder="Describe what was completed in this milestone..."
                  rows={4} className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">File URL (optional)</label>
                <input type="text" value={deliverableFile} onChange={e => setDeliverableFile(e.target.value)}
                  placeholder="https://github.com/..." className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500" />
              </div>
              <button onClick={handleSubmit} disabled={!deliverableNote.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm">
                <Send className="w-4 h-4" /> Submit Deliverable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
