import React, { useRef, useCallback } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
  tilt3d?: boolean;
  float3d?: boolean;
  style?: React.CSSProperties;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({
  children, className = '', hover = false, padding = 'md', onClick, tilt3d = false, float3d = false, style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt3d || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  }, [tilt3d]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-card rounded-2xl ${paddings[padding]} ${hover ? 'glass-card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${tilt3d ? 'card-3d-tilt glossy' : ''} ${float3d ? 'card-3d-float glossy' : ''} ${className}`}
      style={{ ...style, ...tiltStyle }}
    >
      {children}
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
