'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { TopActionItem } from '@/types';

interface RecommendationCardProps {
  action: TopActionItem;
  onApply?: () => void;
  className?: string;
}

export function RecommendationCard({ action, onApply, className = '' }: RecommendationCardProps) {
  return (
    <div
      className={`bg-surface border border-line hover:border-line rounded-xl p-4 flex flex-col justify-between space-y-3  ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand bg-brand-soft px-2 py-0.5 rounded border border-line">
            {action.dimension}
          </span>
          <span className="text-xs font-sans font-bold text-success bg-subtle px-2 py-0.5 rounded border border-line">
            {action.expectedScoreBoostLabel}
          </span>
        </div>

        <h4 className="text-xs font-bold text-ink leading-snug">{action.title}</h4>
        <p className="text-xs text-body leading-relaxed">{action.howToFix}</p>
      </div>

      <div className="border-t border-line pt-2.5 space-y-2">
        <div className="text-xs text-muted">
          <strong className="text-body">Why: </strong>
          {action.reason}
        </div>
        {onApply && (
          <button
            onClick={onApply}
            className="w-full text-center text-xs font-semibold text-brand hover:text-brand py-1 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Execute Fix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
