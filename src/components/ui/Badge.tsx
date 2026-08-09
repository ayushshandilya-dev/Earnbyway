import React from 'react';

type BadgeVariant = 'default' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'zinc';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-900 border-zinc-800 text-zinc-300',
  emerald: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-violet-500/15 border-emerald-500/30 text-teal-300',
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
  rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  zinc: 'bg-zinc-900 border-zinc-800 text-zinc-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className = '', dot = false }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${
      variant === 'emerald' ? 'bg-gradient-to-r from-teal-400 to-violet-400' :
      variant === 'amber' ? 'bg-amber-400' :
      variant === 'blue' ? 'bg-blue-400' :
      variant === 'purple' ? 'bg-purple-400' :
      variant === 'rose' ? 'bg-rose-400' : 'bg-zinc-400'
    }`} />}
    {children}
  </span>
);
