import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  btn3d?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 hover:border-zinc-600',
  outline: 'bg-transparent hover:bg-zinc-800/50 text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-medium',
  ghost: 'bg-transparent hover:bg-zinc-800/30 text-zinc-400 hover:text-white font-medium',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 font-semibold',
  gradient: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30',
};

const sizeStyles: Record<Size, string> = {
  xs: 'px-2.5 py-1.5 text-[10px] rounded-lg gap-1',
  sm: 'px-3.5 py-2 text-xs rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3 text-base rounded-2xl gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  loading = false,
  icon,
  btn3d = false,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    className={`btn-base ${variantStyles[variant]} ${sizeStyles[size]} ${btn3d ? 'btn-3d' : ''} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    ) : icon}
    {children}
  </button>
);
