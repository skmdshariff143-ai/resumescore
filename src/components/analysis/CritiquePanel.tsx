'use client';

import React from 'react';
import type { ResumeCritique } from '@/types';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '../ui/Badge';

interface CritiquePanelProps {
  critique: ResumeCritique;
  onNavigateToTab?: (tab: string) => void;
}

export function CritiquePanel({ critique, onNavigateToTab }: CritiquePanelProps) {
  const getRatingBadge = (rating: 'strong' | 'adequate' | 'needs_work') => {
    switch (rating) {
      case 'strong':
        return <Badge variant="success">Strong</Badge>;
      case 'adequate':
        return <Badge variant="warning">Adequate</Badge>;
      case 'needs_work':
        return <Badge variant="danger">Needs Focus</Badge>;
    }
  };

  const getSeverityBadge = (severity: 'critical' | 'warning' | 'info') => {
    switch (severity) {
      case 'critical':
        return <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/70 border border-rose-800/50 px-2 py-0.5 rounded">Critical</span>;
      case 'warning':
        return <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/70 border border-amber-800/50 px-2 py-0.5 rounded">Warning</span>;
      case 'info':
        return <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded">Note</span>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      {/* Header & Provenance Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center">
            {critique.isLLMGenerated ? (
              <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
            ) : (
              <Bot className="w-4 h-4 mr-2 text-cyan-400" />
            )}
            Qualitative Resume Critique & Narrative Review
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic assessment of career narrative, section impact, and structural ATS risks.
          </p>
        </div>

        <div>
          {critique.isLLMGenerated ? (
            <div className="inline-flex items-center text-[10px] font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-700/60 px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
              Powered by Claude AI
            </div>
          ) : (
            <div className="inline-flex items-center text-[10px] font-bold text-slate-300 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full">
              <Bot className="w-3 h-3 mr-1 text-slate-400" />
              Deterministic Heuristic Engine
            </div>
          )}
        </div>
      </div>

      {/* Overall Narrative */}
      <div className="bg-slate-950/70 border border-indigo-900/30 rounded-xl p-5 space-y-2">
        <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">
          Executive Narrative & Positioning
        </span>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {critique.overallNarrative}
        </p>
      </div>

      {/* Strengths & Immediate Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/60 border border-emerald-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Positioning Strengths</span>
          </div>
          <ul className="space-y-2">
            {critique.keyStrengths.map((str, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start">
                <span className="text-emerald-400 mr-2 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/60 border border-amber-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Immediate High-Impact Adjustments</span>
          </div>
          <ul className="space-y-2">
            {critique.immediateImprovements.map((imp, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start">
                <span className="text-amber-400 mr-2 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section-by-Section Qualitative Review */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Section-by-Section Feedback
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {critique.sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{sec.name}</span>
                {getRatingBadge(sec.rating)}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {sec.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Risks & Structural Warnings */}
      {critique.atsRisks.length > 0 && (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-200">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Structural & Format Risk Observations</span>
          </div>

          <div className="space-y-2.5">
            {critique.atsRisks.map((risk, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(risk.severity)}
                    <span className="text-xs font-bold text-slate-200">{risk.issue}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-0.5">{risk.suggestion}</p>
                </div>

                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('ats')}
                    className="self-start sm:self-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center transition-colors cursor-pointer shrink-0"
                  >
                    <span>View ATS Check</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
