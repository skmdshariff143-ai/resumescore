'use client';

import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`bg-surface border border-line rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface border border-line flex items-center justify-center text-muted">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-ink">{title}</h4>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
