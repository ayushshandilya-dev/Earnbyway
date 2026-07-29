import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Order } from '../../types';
import { CheckCircle, Clock, Send, ChevronDown, ChevronUp, Trello } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

const getStatusColor = (status: string): 'emerald' | 'blue' | 'amber' | 'rose' | 'zinc' => {
  switch (status) {
    case 'completed': return 'emerald';
    case 'in_progress': return 'blue';
    case 'under_review': return 'amber';
    case 'funded': return 'blue';
    case 'disputed': return 'rose';
    default: return 'zinc';
  }
};

export const OrderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, currentUser, currentRole } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myOrders = orders.filter(o =>
    currentRole === 'client' ? o.clientId === currentUser.id : o.freelancerId === currentUser.id
  );

  const filtered = statusFilter === 'all' ? myOrders : myOrders.filter(o => o.status === statusFilter);

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Order Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Track and manage your orders</p>
        </div>
        <div className="flex gap-2">
          {['all', 'in_progress', 'under_review', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold border transition-all ${
                statusFilter === s ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white'
              }`}>{s === 'all' ? 'All' : s.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="order" title="No orders found"
          description={currentRole === 'client' ? 'Post a project to start receiving orders.' : 'Apply to projects to start working.'}
          action={currentRole === 'client' ? { label: 'Post a Project', onClick: () => navigate('/projects') } : { label: 'Browse Projects', onClick: () => navigate('/projects') }} />
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <Card key={order.id} padding="md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    order.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/30' :
                    order.status === 'in_progress' ? 'bg-blue-500/10 border border-blue-500/30' :
                    order.status === 'funded' ? 'bg-amber-500/10 border border-amber-500/30' :
                    'bg-zinc-900 border border-zinc-800'
                  }`}>
                    <Trello className={`w-5 h-5 ${
                      order.status === 'completed' ? 'text-emerald-400' :
                      order.status === 'in_progress' ? 'text-blue-400' :
                      order.status === 'funded' ? 'text-amber-400' : 'text-zinc-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{order.title}</h3>
                      <Badge variant={getStatusColor(order.status)}>{order.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{currentRole === 'client' ? order.freelancerName : order.clientName}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">₹{order.totalPrice.toLocaleString()}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {order.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="xs" icon={<Trello className="w-3 h-3" />} onClick={() => navigate(`/workspace/${order.id}`)}>
                    Workspace
                  </Button>
                  <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition-colors">
                    {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expanded === order.id && (
                <div className="mt-4 pt-4 border-t border-zinc-800/60 space-y-4 animate-slide-up">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {order.milestones.map(m => (
                      <div key={m.id} className={`p-3 rounded-xl border text-center ${
                        m.status === 'released' ? 'bg-emerald-500/5 border-emerald-500/20' :
                        m.status === 'funded' ? 'bg-blue-500/5 border-blue-500/20' :
                        m.status === 'submitted' ? 'bg-amber-500/5 border-amber-500/20' :
                        'bg-zinc-900/40 border-zinc-800'
                      }`}>
                        <div className="text-[10px] text-zinc-500 mb-1">{m.title}</div>
                        <div className="text-xs font-semibold text-white mb-1">₹{m.amount.toLocaleString()}</div>
                        <Badge variant={m.status === 'released' ? 'emerald' : m.status === 'funded' ? 'blue' : m.status === 'submitted' ? 'amber' : 'zinc'} size="sm">
                          {m.status === 'released' ? 'Released' : m.status === 'submitted' ? 'Submitted' : m.status === 'funded' ? 'Active' : 'Locked'}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {(order.status === 'in_progress' || order.status === 'under_review') && currentRole === 'freelancer' && (
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" icon={<Send className="w-3.5 h-3.5" />} onClick={() => navigate(`/workspace/${order.id}`)}>
                        Open Workspace
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
