'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { TopActionItem } from '@/types';

interface BiggestOpportunityCardProps {
  topAction?: TopActionItem;
  topPriority?: string;
  onTakeAction?: () => void;
  className?: string;
}

export function BiggestOpportunityCard({
  topAction,
  topPriority,
  onTakeAction,
  className = '',
}: BiggestOpportunityCardProps) {
  const displayTitle = topAction?.title || topPriority;
  if (!displayTitle) return null;

  return (
    <div
      className={`bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-slate-900 border border-blue-800/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
              Your Biggest Opportunity
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
              Potential: {topAction?.expectedScoreBoostLabel || 'High Leverage'}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
            {displayTitle}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {topAction?.howToFix || 'Focusing on this key recommendation provides the highest mathematical score boost for your profile.'}
          </p>

          <div className="text-[11px] text-slate-400 pt-1 flex items-center">
            <span className="font-semibold text-slate-300 mr-1.5">Why this matters:</span>
            {topAction?.reason || 'Targeted adjustments to your lowest contribution pillar directly increase hiring team match rates.'}
          </div>
        </div>

        {onTakeAction && (
          <button
            onClick={onTakeAction}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <span>Address Opportunity</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        )}
      </div>
    </div>
  );
}
