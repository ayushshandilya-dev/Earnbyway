import React from 'react';

interface MarqueeProps {
  items: string[];
  speed?: number;     // seconds per loop
  className?: string;
  gradient?: boolean;
}

// Infinite horizontal marquee strip
export const Marquee: React.FC<MarqueeProps> = ({ items, speed = 28, className = '', gradient = true }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {gradient && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10" />
        </>
      )}
      <div
        className="flex gap-4 whitespace-nowrap will-change-transform"
        style={{ animation: `marquee ${speed}s linear infinite`, width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-4">
            <span className="text-zinc-600 font-semibold text-sm tracking-wide uppercase">{item}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
          </span>
        ))}
      </div>
    </div>
  );
};
