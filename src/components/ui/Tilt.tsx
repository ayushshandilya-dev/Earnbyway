import React, { useRef, useState, useCallback } from 'react';

interface TiltProps {
  children: React.ReactNode;
  maxTilt?: number;        // max degrees
  scale?: number;          // hover scale
  glare?: boolean;         // light reflection sweep
  spotlight?: boolean;     // mouse-follow glow
  className?: string;
  style?: React.CSSProperties;
}

export const Tilt: React.FC<TiltProps> = ({
  children,
  maxTilt = 10,
  scale = 1.02,
  glare = true,
  spotlight = true,
  className = '',
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 2 * maxTilt;
    const rotateX = (0.5 - py) * 2 * maxTilt;
    setTransform(`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
    if (glare) setGlarePos({ x: px * 100, y: py * 100, opacity: 0.35 });
    if (spotlight) setSpotPos({ x: px * 100, y: py * 100, opacity: 0.9 });
  }, [maxTilt, scale, glare, spotlight]);

  const handleLeave = useCallback(() => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    if (glare) setGlarePos(p => ({ ...p, opacity: 0 }));
    if (spotlight) setSpotPos(p => ({ ...p, opacity: 0 }));
  }, [glare, spotlight]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative will-change-transform ${className}`}
      style={{ ...style, transform, transition: 'transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)', transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-10"
          style={{ opacity: glarePos.opacity, transition: 'opacity 0.3s ease' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
              backgroundSize: '250% 250%',
              backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
            }}
          />
        </div>
      )}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20"
          style={{
            opacity: spotPos.opacity,
            transition: 'opacity 0.3s ease',
            background: `radial-gradient(600px circle at ${spotPos.x}% ${spotPos.y}%, rgba(16, 185, 129, 0.12), transparent 40%)`,
          }}
        />
      )}
    </div>
  );
};
