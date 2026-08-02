import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { UserCheck, ShieldCheck, Briefcase, Eye } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, switchRole, currentUser } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { 
      role: 'client', 
      label: 'Client View', 
      icon: <Briefcase className="w-4 h-4" />,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' 
    },
    { 
      role: 'freelancer', 
      label: 'Freelancer View', 
      icon: <UserCheck className="w-4 h-4" />,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
    },
    { 
      role: 'admin', 
      label: 'Admin Panel', 
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
    },
    { 
      role: 'guest', 
      label: 'Public Landing', 
      icon: <Eye className="w-4 h-4" />,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' 
    }
  ];

  return (
    <div className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          SYSTEM DESIGN DEMO
        </span>
        <span className="text-zinc-400 hidden sm:inline">
          Active Identity: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-zinc-400 font-medium mr-1 hidden md:inline">Switch Role Context:</span>
        {roles.map(r => {
          const isActive = currentRole === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                isActive 
                  ? `${r.color} shadow-sm ring-1 ring-white/20 font-bold scale-105` 
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {r.icon}
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
