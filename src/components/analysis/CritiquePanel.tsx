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
  Quote,
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
        return <span className="text-[10px] font-mono uppercase font-bold text-rose-400 bg-rose-950/70 border border-rose-800/50 px-2 py-0.5 rounded">Critical</span>;
      case 'warning':
        return <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-950/70 border border-amber-800/50 px-2 py-0.5 rounded">Warning</span>;
      case 'info':
        return <span className="text-[10px] font-mono uppercase font-bold text-blue-400 bg-blue-950/70 border border-blue-800/50 px-2 py-0.5 rounded">Note</span>;
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-950/[0.25] via-slate-900/90 to-slate-950 border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-7 font-sans relative overflow-hidden backdrop-blur-xl ring-1 ring-blue-500/15">
      {/* Subtle ambient illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Distinct Editorial Header & Provenance Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 mb-1">
            Qualitative Career Intelligence
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center">
            {critique.isLLMGenerated ? (
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
            ) : (
              <Bot className="w-4 h-4 mr-2 text-slate-400" />
            )}
            AI Career Narrative & Qualitative Critique
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic assessment of career narrative, section impact, and structural ATS risks.
          </p>
        </div>

        <div>
          {critique.isLLMGenerated ? (
            <div className="inline-flex items-center text-[10px] font-mono font-bold text-blue-300 bg-blue-950/80 border border-blue-700/60 px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-1.5"></span>
              {critique.modelUsed ? `Model: ${critique.modelUsed}` : 'LLM Generated'}
            </div>
          ) : (
            <div className="inline-flex items-center text-[10px] font-mono font-bold text-slate-300 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <Bot className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Deterministic Heuristic Fallback
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Memo Style: Overall Executive Narrative */}
      <div className="bg-slate-950/80 border-l-4 border-l-blue-500 border-y border-r border-slate-800/80 rounded-r-xl p-5 sm:p-6 space-y-3 relative shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-400 flex items-center gap-1.5">
            <Quote className="w-3 h-3 text-blue-400" />
            Executive Recruiter Impression & Narrative Positioning
          </span>
          <span className="text-[10px] font-mono text-slate-500">Qualitative Synthesis</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {critique.overallNarrative}
        </p>
      </div>

      {/* Strengths & Immediate Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/70 border border-emerald-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
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

        <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 shrink-0" />
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
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Section-by-Section Feedback
          </h4>
          <span className="text-[10px] font-mono text-slate-500">Recruiter Rubric</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {critique.sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-colors"
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
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Structural & Format Risk Observations</span>
          </div>

          <div className="space-y-2.5">
            {critique.atsRisks.map((risk, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                    className="self-start sm:self-center text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center transition-colors cursor-pointer shrink-0"
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
