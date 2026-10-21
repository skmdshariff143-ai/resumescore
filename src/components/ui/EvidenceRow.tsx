'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle, ArrowRight } from 'lucide-react';
import type { SkillMatchItem } from '@/types';

interface EvidenceRowProps {
  match: SkillMatchItem;
  className?: string;
}

export function EvidenceRow({ match, className = '' }: EvidenceRowProps) {
  const getStatusBadge = () => {
    switch (match.status) {
      case 'matched':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-success" />,
          label: 'Direct Evidence',
          bg: 'bg-subtle text-success border-line',
        };
      case 'partial':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-warning" />,
          label: match.evidenceLevel === 'mentioned' ? 'Mentioned; unproven' : 'Related evidence',
          bg: 'bg-subtle text-warning border-line',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-danger" />,
          label: 'Missing Evidence',
          bg: 'bg-subtle text-danger border-line',
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-muted" />,
          label: 'Unknown Status',
          bg: 'bg-surface text-muted border-line',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      className={`bg-surface border border-line hover:border-line rounded-xl p-4 space-y-2.5  ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-ink">{match.skill}</span>
          <span className="text-xs uppercase font-sans font-semibold px-2 py-0.5 rounded bg-surface border border-line text-muted">
            {match.category}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.bg}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <span className="text-xs font-sans text-muted">
          Match Confidence: <strong className="text-ink">{Math.round(match.confidence * 100)}%</strong>
        </span>
      </div>

      {/* Evidence Quote / Verification */}
      <div className="bg-surface border border-line rounded-lg p-2.5 text-xs text-body font-sans">
        <div className="text-xs uppercase font-sans font-semibold text-muted mb-1">
          Parsed Resume Evidence:
        </div>
        {match.evidenceQuote ? (
          <p className="italic text-ink border-l-2 border-indigo-500/60 pl-2">
            &ldquo;{match.evidenceQuote}&rdquo;
          </p>
        ) : (
          <p className="text-muted">{match.evidence}</p>
        )}
      </div>

      {/* Suggested Action */}
      {match.suggestion && (
        <div className="text-xs text-muted flex items-start space-x-1.5 pt-0.5">
          <ArrowRight className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
          <span>
            <strong className="text-brand">Action: </strong>
            {match.suggestion}
          </span>
        </div>
      )}
    </div>
  );
}
