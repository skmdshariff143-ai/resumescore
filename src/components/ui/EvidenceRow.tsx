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
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Direct Evidence',
          bg: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
        };
      case 'partial':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Ecosystem Familiarity',
          bg: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
        };
      case 'missing':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Missing Evidence',
          bg: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Unknown Status',
          bg: 'bg-slate-900 text-slate-400 border-slate-800',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      className={`bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 space-y-2.5 transition-colors ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="text-sm font-bold text-slate-100">{match.skill}</span>
          <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {match.category}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.bg}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Match Confidence: <strong className="text-slate-200">{Math.round(match.confidence * 100)}%</strong>
        </span>
      </div>

      {/* Evidence Quote / Verification */}
      <div className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5 text-xs text-slate-300 font-sans">
        <div className="text-[10px] uppercase font-mono font-semibold text-slate-400 mb-1">
          Parsed Resume Evidence:
        </div>
        {match.evidenceQuote ? (
          <p className="italic text-slate-200 border-l-2 border-indigo-500/60 pl-2">
            &ldquo;{match.evidenceQuote}&rdquo;
          </p>
        ) : (
          <p className="text-slate-400">{match.evidence}</p>
        )}
      </div>

      {/* Suggested Action */}
      {match.suggestion && (
        <div className="text-[11px] text-slate-400 flex items-start space-x-1.5 pt-0.5">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-indigo-300">Action: </strong>
            {match.suggestion}
          </span>
        </div>
      )}
    </div>
  );
}
