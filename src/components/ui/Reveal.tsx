import React, { useEffect, useRef, useState } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface RevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;        // seconds
  duration?: number;     // seconds
  threshold?: number;    // 0-1
  once?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

const hiddenTransform: Record<RevealDirection, string> = {
  up: 'translateY(40px)',
  down: 'translateY(-40px)',
  left: 'translateX(60px)',
  right: 'translateX(-60px)',
  zoom: 'scale(0.88)',
  fade: 'none',
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  threshold = 0.15,
  once = true,
  className = '',
  as = 'div',
  style,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform[direction],
        transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerBy?: number;   // seconds between each child
  direction?: RevealDirection;
  count?: number;
  threshold?: number;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  className = '',
  staggerBy = 0.08,
  direction = 'up',
  count,
  threshold = 0.1,
}) => {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.slice(0, count ?? items.length).map((child, i) => (
        <Reveal key={i} direction={direction} delay={i * staggerBy} threshold={threshold}>
          {child}
        </Reveal>
      ))}
    </div>
  );
};
