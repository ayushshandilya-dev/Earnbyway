import React from 'react';
import { Button } from './Button';

const illustrations: Record<string, React.ReactNode> = {
  search: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <circle cx="50" cy="50" r="22" stroke="#27272a" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="22" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
      </circle>
      <line x1="66" y1="66" x2="78" y2="78" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="66" x2="78" y2="78" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="50" cy="50" r="8" fill="#10b981" fillOpacity="0.1" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <rect x="20" y="25" width="80" height="70" rx="10" stroke="#27272a" strokeWidth="2.5" />
      <rect x="20" y="25" width="80" height="70" rx="10" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.4">
        <animate attributeName="stroke-dashoffset" from="0" to="100" dur="3s" repeatCount="indefinite" />
      </rect>
      <line x1="35" y1="50" x2="85" y2="50" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="65" x2="70" y2="65" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="78" x2="60" y2="78" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="35" cy="50" r="3" fill="#10b981" fillOpacity="0.3" />
      <circle cx="35" cy="65" r="3" fill="#10b981" fillOpacity="0.3" />
      <circle cx="35" cy="78" r="3" fill="#10b981" fillOpacity="0.3" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <rect x="18" y="25" width="84" height="56" rx="12" stroke="#27272a" strokeWidth="2.5" />
      <rect x="18" y="25" width="84" height="56" rx="12" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <path d="M40 81 L45 70 L35 70 Z" fill="#10b981" fillOpacity="0.15" />
      <circle cx="42" cy="44" r="4" fill="#27272a" />
      <circle cx="60" cy="44" r="4" fill="#27272a" />
      <circle cx="78" cy="44" r="4" fill="#27272a" />
      {[42, 60, 78].map((cx, i) => (
        <circle key={i} cx={cx} cy="44" r="4" fill="#10b981" fillOpacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <rect x="40" y="18" width="40" height="84" rx="6" stroke="#27272a" strokeWidth="2.5" />
      <rect x="40" y="18" width="40" height="84" rx="6" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <path d="M60 55 L50 65 L70 65 Z" fill="#10b981" fillOpacity="0.15">
        <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" />
      </path>
      <line x1="40" y1="80" x2="80" y2="80" stroke="#27272a" strokeWidth="1.5" />
      <line x1="40" y1="86" x2="72" y2="86" stroke="#27272a" strokeWidth="1.5" />
      <line x1="40" y1="92" x2="64" y2="92" stroke="#27272a" strokeWidth="1.5" />
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <path d="M18 50 L35 25 L85 25 L102 50 L95 95 L25 95 Z" stroke="#27272a" strokeWidth="2.5" fill="none" />
      <path d="M18 50 L35 25 L85 25 L102 50 L95 95 L25 95 Z" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" fill="none" />
      <line x1="18" y1="50" x2="48" y2="55" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="102" y1="50" x2="72" y2="55" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="50" x2="48" y2="55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
      <line x1="102" y1="50" x2="72" y2="55" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" opacity="0.4" />
    </svg>
  ),
  order: (
    <svg viewBox="0 0 120 120" fill="none" className="w-28 h-28 mx-auto mb-6">
      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#27272a" strokeWidth="2.5" />
      <rect x="25" y="20" width="70" height="80" rx="8" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" opacity="0.4" />
      <line x1="35" y1="38" x2="85" y2="38" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="52" x2="75" y2="52" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="66" x2="80" y2="66" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="80" x2="65" y2="80" stroke="#27272a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="90" r="15" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 60 90" to="360 60 90" dur="3s" repeatCount="indefinite" />
      </circle>
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
  <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
    <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full text-center">
      {typeof icon === 'string' ? illustrations[icon] : icon}
      <h3 className="text-lg font-heading font-semibold text-white mb-1.5">{title}</h3>
      {description && <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-6 leading-relaxed">{description}</p>}
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  </div>
);
