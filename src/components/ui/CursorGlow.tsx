import React, { useEffect, useRef } from 'react';

// Soft radial glow that follows the cursor (subtle, pointer-events-none)
export const CursorGlow: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

    let raf = 0;
    let tx = -100, ty = -100, x = -100, y = -100;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] rounded-full z-[5]"
      style={{
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07), transparent 60%)',
        mixBlendMode: 'screen',
      }}
    />
  );
};
