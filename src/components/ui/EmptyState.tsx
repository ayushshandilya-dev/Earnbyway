import React from 'react';

const illustrations: Record<string, React.ReactNode> = {
  search: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <circle cx="50" cy="50" r="22" stroke="#27272a" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="22" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.5" />
      <line x1="66" y1="66" x2="78" y2="78" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="66" x2="78" y2="78" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill="#10b981" fillOpacity="0.1" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <rect x="20" y="25" width="80" height="70" rx="10" stroke="#27272a" strokeWidth="2.5" />
      <rect x="20" y="25" width="80" height="70" rx="10" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.4" />
      <line x1="35" y1="50" x2="85" y2="50" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="65" x2="70" y2="65" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="78" x2="60" y2="78" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="50" r="3" fill="#10b981" fillOpacity="0.3" />
      <circle cx="35" cy="65" r="3" fill="#10b981" fillOpacity="0.3" />
      <circle cx="35" cy="78" r="3" fill="#10b981" fillOpacity="0.3" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <rect x="18" y="25" width="84" height="56" rx="12" stroke="#27272a" strokeWidth="2.5" />
      <rect x="18" y="25" width="84" height="56" rx="12" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <path d="M40 81 L45 70 L35 70 Z" fill="#10b981" fillOpacity="0.15" />
      <circle cx="42" cy="44" r="4" fill="#27272a" />
      <circle cx="60" cy="44" r="4" fill="#27272a" />
      <circle cx="78" cy="44" r="4" fill="#27272a" />
      <circle cx="42" cy="44" r="4" fill="#10b981" fillOpacity="0.3" />
      <circle cx="60" cy="44" r="4" fill="#10b981" fillOpacity="0.3" />
      <circle cx="78" cy="44" r="4" fill="#10b981" fillOpacity="0.3" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <rect x="40" y="18" width="40" height="84" rx="6" stroke="#27272a" strokeWidth="2.5" />
      <rect x="40" y="18" width="40" height="84" rx="6" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <path d="M60 55 L50 65 L70 65 Z" fill="#10b981" fillOpacity="0.15" />
      <line x1="40" y1="80" x2="80" y2="80" stroke="#27272a" strokeWidth="1.5" />
      <line x1="40" y1="86" x2="72" y2="86" stroke="#27272a" strokeWidth="1.5" />
      <line x1="40" y1="92" x2="64" y2="92" stroke="#27272a" strokeWidth="1.5" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <path d="M18 50 L35 25 L85 25 L102 50 L95 95 L25 95 Z" stroke="#27272a" strokeWidth="2.5" fill="none" />
      <path d="M18 50 L35 25 L85 25 L102 50 L95 95 L25 95 Z" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" fill="none" />
      <line x1="18" y1="50" x2="48" y2="55" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="102" y1="50" x2="72" y2="55" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="50" x2="48" y2="55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
      <line x1="102" y1="50" x2="72" y2="55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  ),
  order: (
    <svg viewBox="0 0 120 120" fill="none" className="w-24 h-24 mx-auto mb-4">
      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#27272a" strokeWidth="2.5" />
      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <line x1="35" y1="38" x2="85" y2="38" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="52" x2="75" y2="52" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="66" x2="80" y2="66" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="80" x2="65" y2="80" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="90" r="15" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" opacity="0.5" />
      <path d="M55 90 L59 94 L66 87" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  ),
};

interface EmptyStateProps {
  icon?: keyof typeof illustrations | React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    {typeof icon === 'string' ? illustrations[icon] : icon}
    <h3 className="text-lg font-heading font-semibold text-zinc-300 mb-1.5">{title}</h3>
    {description && <p className="text-sm text-zinc-500 max-w-xs text-center mb-6">{description}</p>}
    {action && (
      <button onClick={action.onClick}
        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all text-sm">
        {action.label}
      </button>
    )}
  </div>
);
