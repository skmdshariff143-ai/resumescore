'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'signal' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md gap-1.5 font-semibold',
  }[size];

  const variantClasses = {
    signal: 'bg-brand-soft text-brand border border-line',
    success: 'bg-subtle text-success border border-line',
    warning: 'bg-subtle text-warning border border-line',
    danger: 'bg-subtle text-danger border border-line',
    info: 'bg-brand-soft text-brand border border-line',
    neutral: 'bg-surface text-body border border-line',
    outline: 'bg-transparent text-muted border border-line',
  }[variant];

  return (
    <span
      className={`inline-flex items-center tracking-wide ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
