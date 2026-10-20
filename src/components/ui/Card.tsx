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
    default: 'bg-surface border border-line rounded-2xl shadow-panel ',
    elevated: 'bg-surface border border-line rounded-2xl shadow-panel ',
    interactive:
      'bg-surface hover:bg-surface border border-line hover:border-line rounded-2xl shadow-panel transition-all duration-200 hover:-translate-y-0.5 cursor-pointer',
    subtle: 'bg-surface border border-line rounded-xl',
  }[variant];

  return (
    <div className={`${variantClasses} ${paddingClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
