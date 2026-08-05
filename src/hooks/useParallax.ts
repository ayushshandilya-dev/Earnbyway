import { useEffect, useRef, useState } from 'react';

interface ParallaxOptions {
  speed?: number;      // pixels of parallax per 100px scroll (negative = moves up slower)
  enabled?: boolean;
}

// Applies a translateY offset based on element position relative to viewport center.
export const useParallax = <T extends HTMLElement>({ speed = 0.15, enabled = true }: ParallaxOptions = {}) => {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerOffset = (rect.top + rect.height / 2) - vh / 2;
      setOffset(centerOffset * speed * -1);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, enabled]);

  return { ref, offset };
};

// Mouse-move parallax for layered 3D scenes
export const useMouseParallax = (depth = 20) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5);
      const ny = (e.clientY / innerHeight - 0.5);
      el.style.transform = `translate3d(${nx * depth}px, ${ny * depth}px, 0)`;
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [depth]);

  return ref;
};
