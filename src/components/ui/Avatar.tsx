import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: string;
  ring?: string;
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'sm',
  rounded = 'rounded-lg',
  ring = '',
  className = '',
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImg = src && !error;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden flex-shrink-0 ${sizeMap[size]} ${rounded} ${ring} ${className}`}>
      {showImg && (
        <img
          src={src}
          alt={alt || name || 'avatar'}
          loading="lazy"
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {(!showImg || !loaded) && (
        <span className="w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-emerald-600 to-teal-400 select-none">
          {getInitials(name || alt)}
        </span>
      )}
    </div>
  );
};
