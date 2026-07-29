import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { WorkspaceTask, WorkspaceAsset } from '../../types';
import { 
  Trello, 
  FileText, 
  BookOpen, 
  Plus, 
  Trash2, 
  Upload, 
  ShieldAlert, 
  Clock, 
  CheckSquare, 
  ArrowLeft,
  Paperclip,
  CheckCircle,
  FileArchive,
  User as UserIcon,
  Sparkles,
  Send
} from 'lucide-react';

export const CollaborativeWorkspace: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { 
    orders, 
    currentUser, 
    workspaceTasks, 
    workspaceNotes, 
    workspaceAssets,
    addWorkspaceTask, 
    updateWorkspaceTask, 
    deleteWorkspaceTask,
    updateWorkspaceNotes, 
    addWorkspaceAsset,
    submitMilestoneDeliverable,
    approveMilestoneEscrow
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kanban' | 'assets' | 'notes' | 'milestones'>('kanban');
  
  // Kanban inputs
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  
  // File inputs
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  
  // Notes editor
  const orderNotes = orderId ? (workspaceNotes[orderId] || '') : '';
  const [editedNotes, setEditedNotes] = useState(orderNotes);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Escrow deliverable inputs
  const [deliverableModal, setDeliverableModal] = useState<string | null>(null); // milestoneId
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableFile, setDeliverableFile] = useState('');

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Workspace Not Found</h2>
        <p className="text-zinc-400 text-sm mt-1">This workspace may have been archived or deleted.</p>
        <button onClick={() => navigate('/orders')} className="mt-6 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white hover:bg-zinc-850">
          Back to Orders
        </button>
      </div>
    );
  }

  // Access check
  const isClient = currentUser.id === order.clientId;
  const isFreelancer = currentUser.id === order.freelancerId;
  const hasAccess = isClient || isFreelancer || currentUser.role === 'admin';

  if (!hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-zinc-500 text-sm">You do not have permissions to view this project team workspace.</p>
        <button onClick={() => navigate('/orders')} className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const tasks = workspaceTasks.filter(t => t.orderId === order.id);
  const assets = workspaceAssets.filter(a => a.orderId === order.id);

  // Kanban Handlers
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !orderId) return;

    addWorkspaceTask({
      orderId,
      title: newTaskTitle.trim(),
      status: 'todo',
      assignedTo: newTaskAssignee || undefined
    });

    addToast('Task added successfully', 'success');
    setNewTaskTitle('');
    setNewTaskAssignee('');
  };

  const handleMoveTask = (taskId: string, newStatus: WorkspaceTask['status']) => {
    updateWorkspaceTask(taskId, { status: newStatus });
    addToast('Task status updated', 'info');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteWorkspaceTask(taskId);
    addToast('Task deleted', 'warning');
  };

  // Asset Handlers
  const handleUploadAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !orderId) return;

    addWorkspaceAsset({
      orderId,
      name: newFileName.trim(),
      url: newFileUrl.trim() || '#',
      size: `${(Math.random() * 12 + 1).toFixed(1)} MB`,
      uploadedBy: currentUser.name
    });

    addToast('Asset uploaded to workspace', 'success');
    setNewFileName('');
    setNewFileUrl('');
  };

  // Notes Handler
  const handleSaveNotes = () => {
    if (!orderId) return;
    updateWorkspaceNotes(orderId, editedNotes);
    setIsEditingNotes(false);
    addToast('Project specifications updated', 'success');
  };

  // Escrow milestone release handler
  const handleMilestoneDeliverable = () => {
    if (!deliverableModal || !orderId || !deliverableNote.trim()) return;
    submitMilestoneDeliverable(orderId, deliverableModal, deliverableNote, deliverableFile || undefined);
    addToast('Milestone work submitted!', 'success');
    setDeliverableModal(null);
    setDeliverableNote('');
    setDeliverableFile('');
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121215] border border-zinc-800/80 p-6 rounded-3xl">
        <div className="space-y-1.5">
          <button onClick={() => navigate('/orders')} className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-heading font-extrabold text-white sm:text-2xl">{order.title}</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20">WORKSPACE</span>
          </div>
          <p className="text-xs text-zinc-400">
            Escrow ID: <span className="font-mono text-zinc-300">{order.id}</span> · Connected: <span className="font-semibold text-white">{order.clientName}</span> (Client) & <span className="font-semibold text-white">{order.freelancerName}</span> (Freelancer)
          </p>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/60 border border-zinc-850 p-3 rounded-2xl">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Escrow Balance</span>
            <span className="text-lg font-black text-emerald-400">₹{order.escrowBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-0.5">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'kanban' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Trello className="w-4 h-4" /> Shared Kanban Board
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'assets' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Paperclip className="w-4 h-4" /> Shared Assets & Files ({assets.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('notes');
            setEditedNotes(workspaceNotes[orderId || ''] || '');
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'notes' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Project Specifications
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'milestones' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Escrow Milestones
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        
        {/* 1. KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            {/* Create Task Form */}
            <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-[#121215] border border-zinc-800 rounded-2xl">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">New Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement stripe webhook validation..."
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                />
              </div>
              <div className="w-full sm:w-48 space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Assign To</label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/60"
                >
                  <option value="">Unassigned</option>
                  <option value={order.clientName}>{order.clientName} (Client)</option>
                  <option value={order.freelancerName}>{order.freelancerName} (Freelancer)</option>
                </select>
              </div>
              <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 h-10 w-full sm:w-auto justify-center">
                <Plus className="w-4 h-4 stroke-[3]" /> Add Task
              </button>
            </form>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['todo', 'in_progress', 'in_review', 'done'] as const).map(colStatus => {
                const columnTasks = tasks.filter(t => t.status === colStatus);
                const colTitle = colStatus === 'todo' ? 'To Do' :
                                 colStatus === 'in_progress' ? 'In Progress' :
                                 colStatus === 'in_review' ? 'In Review' : 'Done';
                const colHeaderColor = colStatus === 'todo' ? 'text-zinc-400' :
                                       colStatus === 'in_progress' ? 'text-blue-400' :
                                       colStatus === 'in_review' ? 'text-amber-400' : 'text-emerald-400';
                return (
                  <div key={colStatus} className="p-4 bg-[#121215]/80 border border-zinc-800/80 rounded-2xl space-y-3 min-h-[350px] flex flex-col">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className={`text-xs font-bold ${colHeaderColor}`}>{colTitle}</span>
                      <span className="text-[10px] font-bold bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto">
                      {columnTasks.map(task => (
                        <div key={task.id} className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-2 hover:border-zinc-750 transition-all">
                          <h4 className="text-xs font-medium text-white line-clamp-2 leading-relaxed">{task.title}</h4>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-850">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-zinc-500" />
                              <span className="truncate max-w-[80px]">{task.assignedTo || 'Unassigned'}</span>
                            </span>
                            <span className="font-mono text-[9px]">{task.createdAt}</span>
                          </div>

                          <div className="flex items-center justify-between gap-1.5 pt-1.5">
                            <select
                              value={task.status}
                              onChange={e => handleMoveTask(task.id, e.target.value as any)}
                              className="text-[9px] bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-zinc-300 focus:outline-none"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="in_review">In Review</option>
                              <option value="done">Done</option>
                            </select>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-zinc-600 hover:text-rose-400 transition-colors p-1">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="h-20 border border-dashed border-zinc-800/80 rounded-xl flex items-center justify-center text-[10px] text-zinc-600">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. SHARED ASSETS & FILES */}
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload File Form */}
            <div className="p-5 bg-[#121215] border border-zinc-800 rounded-3xl h-fit space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Add Asset to Workspace</h3>
              </div>
              <form onSubmit={handleUploadAsset} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Asset Name</label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="e.g. wireframes_mobile_v2.fig..."
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Asset URL / Github link</label>
                  <input
                    type="text"
                    value={newFileUrl}
                    onChange={e => setNewFileUrl(e.target.value)}
                    placeholder="https://figma.com/file/... (optional)"
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all">
                  <Plus className="w-4 h-4" /> Link Asset
                </button>
              </form>
            </div>

            {/* Assets List */}
            <div className="lg:col-span-2 bg-[#121215]/80 border border-zinc-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Shared Project Resources</h3>
              
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {assets.map(asset => (
                  <div key={asset.id} className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center text-emerald-400 border border-zinc-800 flex-shrink-0">
                        <FileArchive className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate max-w-[280px]">{asset.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>{asset.size || 'N/A'}</span>
                          <span>·</span>
                          <span>Uploaded by: <span className="text-zinc-400 font-medium">{asset.uploadedBy}</span></span>
                          <span>·</span>
                          <span className="font-mono text-[9px]">{asset.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[10px] font-semibold text-zinc-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                    >
                      Open Link
                    </a>
                  </div>
                ))}
                {assets.length === 0 && (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    No resources linked yet. Link Figma mocks, requirements folders, or repository URLs in this tab.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. PROJECT SPECIFICATIONS */}
        {activeTab === 'notes' && (
          <div className="p-6 bg-[#121215] border border-zinc-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Interactive Shared Specifications</h3>
              </div>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    setEditedNotes(workspaceNotes[orderId || ''] || '');
                    setIsEditingNotes(true);
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-xs rounded-xl transition-all"
                >
                  Edit Specs
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all"
                  >
                    Save & Sync
                  </button>
                </div>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={editedNotes}
                onChange={e => setEditedNotes(e.target.value)}
                placeholder="# Write details here... Support plain text and layout markdown style."
                rows={14}
                className="w-full px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-emerald-500/60 resize-none"
              />
            ) : (
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl text-xs text-zinc-300 leading-relaxed font-sans min-h-[300px] whitespace-pre-wrap">
                {orderNotes ? orderNotes : (
                  <p className="text-zinc-500 italic text-center py-20">No specifications draft available. Click "Edit Specs" to record requirements.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. ESCROW MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-5 space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Escrow Payment Release Stepper</h3>
              <span className="text-[10px] text-zinc-400 font-medium">Auto-Secured by WorkHive Escrow Wallet</span>
            </div>

            <div className="space-y-3.5">
              {order.milestones.map((m, idx) => {
                const isNextAction = isFreelancer && m.status === 'funded' && idx === order.milestones.findIndex(mm => mm.status === 'funded');
                const canApprove = isClient && m.status === 'submitted';
                
                return (
                  <div 
                    key={m.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      m.status === 'released' ? 'bg-emerald-500/5 border-emerald-500/30' :
                      m.status === 'submitted' ? 'bg-amber-500/5 border-amber-500/30' :
                      'bg-zinc-900/60 border-zinc-850'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400 flex items-center justify-center">{idx + 1}</span>
                          <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-500 pl-7">
                          <span className="text-emerald-400 font-bold">₹{m.amount.toLocaleString()}</span>
                          <span>·</span>
                          <span>Due: {m.dueDate}</span>
                          <span>·</span>
                          <span className={`px-2 py-0.2 rounded text-[9px] font-semibold ${
                            m.status === 'released' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            m.status === 'submitted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            m.status === 'funded' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-zinc-900 text-zinc-500'
                          }`}>
                            {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                          </span>
                        </div>

                        {/* Submitted deliverable details */}
                        {m.deliverableNote && (
                          <div className="mt-2.5 ml-7 p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-xs text-zinc-400 space-y-1">
                            <div><span className="text-zinc-500 font-semibold">Deliverable Note:</span> {m.deliverableNote}</div>
                            {m.deliverableFile && (
                              <div className="pt-1">
                                <a href={m.deliverableFile} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 text-[10px] w-fit font-bold">
                                  <FileText className="w-3 h-3" /> Download Submission ZIP
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pl-7 sm:pl-0">
                        {isNextAction && (
                          <button
                            onClick={() => setDeliverableModal(m.id)}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <Upload className="w-3.5 h-3.5" /> Submit Work
                          </button>
                        )}
                        {canApprove && (
                          <button
                            onClick={() => {
                              approveMilestoneEscrow(order.id, m.id);
                              addToast('Milestone approved & funds released to freelancer wallet!', 'success');
                            }}
                            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md animate-bounce"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Release Escrow
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

      {/* Submit Work Modal */}
      {deliverableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeliverableModal(null)}>
          <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setDeliverableModal(null)} className="absolute right-5 top-5 p-1.5 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
              <Trash2 className="w-4 h-4 rotate-45" />
            </button>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-heading font-bold text-white">Submit Milestone Deliverable</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Delivery Note</label>
                <textarea
                  required
                  value={deliverableNote}
                  onChange={e => setDeliverableNote(e.target.value)}
                  placeholder="Summarize the work completed for this milestone..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Source Code Repository / Delivery ZIP Link (optional)</label>
                <input
                  type="text"
                  value={deliverableFile}
                  onChange={e => setDeliverableFile(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleMilestoneDeliverable}
                disabled={!deliverableNote.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all text-sm shadow-md"
              >
                <Send className="w-4 h-4" /> Submit Work to Client Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
