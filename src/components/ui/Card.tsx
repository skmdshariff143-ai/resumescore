'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  const variantClasses = {
    default: 'bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md',
    elevated: 'bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl',
    interactive:
      'bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer',
    subtle: 'bg-slate-950/60 border border-slate-800/60 rounded-xl',
  }[variant];

  return (
    <div className={`${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
