import React, { useRef, useCallback } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
  tilt3d?: boolean;
  float3d?: boolean;
  glow?: boolean;
  border?: boolean;
  style?: React.CSSProperties;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  children, className = '', hover = false, padding = 'md', onClick, tilt3d = false, float3d = false,
  glow = false, border = false, style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [spot, setSpot] = React.useState({ x: 50, y: 50, o: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setSpot({ x: px * 100, y: py * 100, o: 1 });
    if (tilt3d) {
      const x = px - 0.5;
      const y = py - 0.5;
      setTilt({ x: x * 10, y: y * -10 });
    }
  }, [tilt3d]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
    setSpot(p => ({ ...p, o: 0 }));
  }, []);

  const tiltStyle = tilt3d && isHovered ? {
    transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(20px)`,
    boxShadow: `${tilt.x * 2 + 15}px ${tilt.y * -2 + 25}px 50px rgba(16, 185, 129, 0.08), ${tilt.x * 4 + 25}px ${tilt.y * -4 + 50}px 80px rgba(0, 0, 0, 0.12)`,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  } : {};

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-card rounded-2xl ${paddings[padding]} ${hover ? 'glass-card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${tilt3d ? 'card-3d-tilt glossy' : ''} ${float3d ? 'card-3d-float glossy' : ''} ${glow ? 'glow-emerald-sm' : ''} ${border ? 'border-emerald-500/20' : ''} ${className}`}
      style={{ ...style, ...tiltStyle }}
    >
      {spot.o > 0 && !tilt3d && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: `radial-gradient(500px circle at ${spot.x}% ${spot.y}%, rgba(16, 185, 129, 0.08), transparent 40%)` }} />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ children, className = '', icon }) => (
  <h3 className={`text-sm font-semibold text-white flex items-center gap-2 ${className}`}>
    {icon && <span className="text-emerald-400">{icon}</span>}
    {children}
  </h3>
);
