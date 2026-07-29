import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
};

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, padding = 'md', onClick }) => (
  <div
    onClick={onClick}
    className={`glass-card rounded-2xl ${paddings[padding]} ${hover ? 'glass-card-hover' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ children, className = '', icon }) => (
  <h3 className={`text-sm font-semibold text-white flex items-center gap-2 ${className}`}>
    {icon && <span className="text-emerald-400">{icon}</span>}
    {children}
  </h3>
);
