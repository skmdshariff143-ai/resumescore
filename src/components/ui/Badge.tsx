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
    sm: 'text-[10px] px-2 py-0.5 rounded gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md gap-1.5 font-semibold',
  }[size];

  const variantClasses = {
    signal: 'bg-indigo-950/60 text-indigo-300 border border-indigo-700/50',
    success: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50',
    warning: 'bg-amber-950/50 text-amber-300 border border-amber-800/50',
    danger: 'bg-rose-950/50 text-rose-300 border border-rose-800/50',
    info: 'bg-cyan-950/50 text-cyan-300 border border-cyan-800/50',
    neutral: 'bg-slate-900/80 text-slate-300 border border-slate-800',
    outline: 'bg-transparent text-slate-400 border border-slate-700',
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
