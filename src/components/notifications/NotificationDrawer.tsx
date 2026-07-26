import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, ShieldAlert, DollarSign, FileText, MessageSquare, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, currentUser } = useApp();

  if (!isOpen) return null;

  const userNotifs = notifications.filter(n => n.userId === currentUser.id || currentUser.role === 'admin');
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'proposal': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'order': return <CheckCheck className="w-4 h-4 text-purple-400" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-amber-400" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-400" />;
      default: return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-zinc-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-sm text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markNotificationsAsRead}
            className="text-xs text-emerald-400 hover:underline font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {userNotifs.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No notifications yet.
          </div>
        ) : (
          userNotifs.map(n => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border text-xs transition-colors ${
                !n.read 
                  ? 'bg-zinc-900/90 border-emerald-500/30 text-white' 
                  : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-zinc-800/80 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{n.title}</span>
                    <span className="text-[10px] text-zinc-500">{n.timestamp}</span>
                  </div>
                  <p className="text-zinc-300 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
