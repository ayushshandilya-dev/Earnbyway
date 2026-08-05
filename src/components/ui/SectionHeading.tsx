import React from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

// Consistent premium section header with animated eyebrow + gradient underline
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow, title, subtitle, align = 'center', className = '',
}) => {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <Reveal direction="up" duration={0.7}>
      <div className={`mb-12 max-w-2xl ${alignCls} ${className}`}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3 text-balance">
          <span className="mask-reveal"><span>{title}</span></span>
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-emerald-500 to-transparent mx-auto mt-1 mb-4" style={align === 'center' ? {} : { marginLeft: 0 }} />
        {subtitle && <p className="text-sm text-zinc-500 leading-relaxed">{subtitle}</p>}
      </div>
    </Reveal>
  );
};
