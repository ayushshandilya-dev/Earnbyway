import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, hint, className = '', ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="block text-xs font-medium text-zinc-400">{label}</label>}
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm bg-zinc-900/80 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all ${
          error ? 'border-rose-500/50' : 'border-zinc-800'
        } ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-[11px] text-rose-400">{error}</p>}
    {hint && !error && <p className="text-[11px] text-zinc-500">{hint}</p>}
  </div>
);
