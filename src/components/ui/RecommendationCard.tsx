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
      className={`bg-slate-950/70 border border-slate-800/80 hover:border-indigo-900/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors ${className}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/50">
            {action.dimension}
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
            {action.expectedScoreBoostLabel}
          </span>
        </div>

        <h4 className="text-xs font-bold text-slate-200 leading-snug">{action.title}</h4>
        <p className="text-[11px] text-slate-300 leading-relaxed">{action.howToFix}</p>
      </div>

      <div className="border-t border-slate-800/80 pt-2.5 space-y-2">
        <div className="text-[10px] text-slate-400">
          <strong className="text-slate-300">Why: </strong>
          {action.reason}
        </div>
        {onApply && (
          <button
            onClick={onApply}
            className="w-full text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 py-1 flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Execute Fix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
