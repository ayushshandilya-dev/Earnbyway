import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, MessageSquare, Briefcase, DollarSign, AlertTriangle, ShieldCheck, X } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  message: <MessageSquare className="w-3.5 h-3.5 text-blue-400" />,
  proposal: <Briefcase className="w-3.5 h-3.5 text-amber-400" />,
  order: <DollarSign className="w-3.5 h-3.5 text-emerald-400" />,
  dispute: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
  milestone: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { notifications, currentUser, currentRole, markNotificationsAsRead } = useApp();

  const userNotifs = notifications.filter(n =>
    n.userId === currentUser.id || currentRole === 'admin'
  );

  const handleMarkRead = () => {
    markNotificationsAsRead();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-14 z-50 animate-scale-in">
      <div onClick={onClose} className="fixed inset-0 z-[-1]" />
      <div className="bg-[#121215]/95 backdrop-blur-2xl border border-zinc-800 rounded-2xl w-80 sm:w-96 shadow-2xl shadow-black/40 overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Notifications</span>
          </div>
          {userNotifs.some(n => !n.read) && (
            <button onClick={handleMarkRead} className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              <CheckCheck className="w-3 h-3" /> Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {userNotifs.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Bell className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No notifications yet</p>
            </div>
          ) : (
            userNotifs.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-zinc-800/40 hover:bg-zinc-900/30 transition-colors ${!n.read ? 'bg-emerald-500/5' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                  {typeIcons[n.type] || <Bell className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${!n.read ? 'text-white font-semibold' : 'text-zinc-400'}`}>{n.message}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{n.timestamp}</p>
                </div>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
