import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;   // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
}

// Animated count-up when scrolled into view
export const CountUp: React.FC<CountUpProps> = ({
  value, duration = 1400, prefix = '', suffix = '', decimals = 0, format, className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setDisplay(value * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const rendered = format
    ? format(display)
    : `${prefix}${display.toFixed(decimals)}${suffix}`;

  return <span ref={ref} className={className}>{rendered}</span>;
};
