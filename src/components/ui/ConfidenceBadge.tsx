'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import type { MatchLevel } from '@/types';

interface ConfidenceBadgeProps {
  level?: MatchLevel;
  confidence?: number;
  className?: string;
}

export function ConfidenceBadge({ level, confidence, className = '' }: ConfidenceBadgeProps) {
  const getLevelLabel = (lvl?: MatchLevel) => {
    switch (lvl) {
      case 'level_1_exact':
        return 'Exact Match';
      case 'level_2_normalized':
        return 'Normalized Match';
      case 'level_3_alias':
        return 'Industry Alias';
      case 'level_4_taxonomy':
        return 'Taxonomy Subsumption';
      case 'level_5_context':
        return 'Context Co-occurrence';
      case 'level_6_evidence':
        return 'Section Verified';
      default:
        return 'Inferred';
    }
  };

  const isHigh = (confidence ?? 1) >= 0.85;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
        isHigh
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
          : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
      } ${className}`}
    >
      {isHigh ? (
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
      ) : (
        <AlertTriangle className="w-3 h-3 text-amber-400" />
      )}
      <span>{getLevelLabel(level)}</span>
      {confidence !== undefined && (
        <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
      )}
    </span>
  );
}
