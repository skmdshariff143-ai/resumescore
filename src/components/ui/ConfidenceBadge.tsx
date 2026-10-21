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
      className={`inline-flex items-center gap-1 text-xs font-sans font-semibold px-2 py-0.5 rounded-full border ${
        isHigh
          ? 'bg-subtle text-success border-line'
          : 'bg-subtle text-warning border-line'
      } ${className}`}
    >
      {isHigh ? (
        <ShieldCheck className="w-3 h-3 text-success" />
      ) : (
        <AlertTriangle className="w-3 h-3 text-warning" />
      )}
      <span>{getLevelLabel(level)}</span>
      {confidence !== undefined && (
        <span className="opacity-75">({Math.round(confidence * 100)}%)</span>
      )}
    </span>
  );
}
