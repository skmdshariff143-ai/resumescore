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
        return <span className="text-xs font-sans uppercase font-bold text-danger bg-subtle border border-line px-2 py-0.5 rounded">Critical</span>;
      case 'warning':
        return <span className="text-xs font-sans uppercase font-bold text-warning bg-subtle border border-line px-2 py-0.5 rounded">Warning</span>;
      case 'info':
        return <span className="text-xs font-sans uppercase font-bold text-brand bg-brand-soft border border-line px-2 py-0.5 rounded">Note</span>;
    }
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 shadow-panel space-y-7 font-sans relative overflow-hidden  ring-1 ring-blue-500/15">
      {/* Subtle ambient illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Distinct Editorial Header & Provenance Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-5 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-brand mb-1">
            Qualitative Career Intelligence
          </div>
          <h3 className="text-base sm:text-lg font-bold text-ink flex items-center">
            {critique.isLLMGenerated ? (
              <Sparkles className="w-4 h-4 mr-2 text-brand" />
            ) : (
              <Bot className="w-4 h-4 mr-2 text-muted" />
            )}
            AI Career Narrative & Qualitative Critique
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Suggestions based on supplied text, not verified candidate facts. Check claims against your experience before using them.
          </p>
        </div>

        <div>
          {critique.isLLMGenerated ? (
            <div className="inline-flex items-center text-xs font-sans font-bold text-brand bg-brand-soft border border-line px-3 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-1.5"></span>
              {critique.modelUsed ? `Model: ${critique.modelUsed}` : 'LLM Generated'}
            </div>
          ) : (
            <div className="inline-flex items-center text-xs font-sans font-bold text-body bg-surface border border-line px-3 py-1.5 rounded-full">
              <Bot className="w-3.5 h-3.5 mr-1.5 text-muted" />
              Deterministic Heuristic Fallback
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Memo Style: Overall Executive Narrative */}
      <div className="bg-surface border-l-4 border-l-blue-500 border-y border-r border-line rounded-r-xl p-5 sm:p-6 space-y-3 relative shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans uppercase tracking-wider font-bold text-brand flex items-center gap-1.5">
            <Quote className="w-3 h-3 text-brand" />
            Executive Recruiter Impression & Narrative Positioning
          </span>
          <span className="text-xs font-sans text-muted">Qualitative Synthesis</span>
        </div>
        <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans">
          {critique.overallNarrative}
        </p>
      </div>

      {/* Strengths & Immediate Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-line rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-success text-xs font-sans font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Key Positioning Strengths</span>
          </div>
          <ul className="space-y-2">
            {critique.keyStrengths.map((str, idx) => (
              <li key={idx} className="text-xs text-body flex items-start">
                <span className="text-success mr-2 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface border border-line rounded-xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-warning text-xs font-sans font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Immediate High-Impact Adjustments</span>
          </div>
          <ul className="space-y-2">
            {critique.immediateImprovements.map((imp, idx) => (
              <li key={idx} className="text-xs text-body flex items-start">
                <span className="text-warning mr-2 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section-by-Section Qualitative Review */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-ink">
            Section-by-Section Feedback
          </h4>
          <span className="text-xs font-sans text-muted">Recruiter Rubric</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {critique.sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-surface border border-line rounded-xl p-4 space-y-2 hover:border-line "
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">{sec.name}</span>
                {getRatingBadge(sec.rating)}
              </div>
              <p className="text-xs text-body leading-relaxed">
                {sec.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ATS Risks & Structural Warnings */}
      {critique.atsRisks.length > 0 && (
        <div className="bg-surface border border-line rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-ink">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span>Structural & Format Risk Observations</span>
          </div>

          <div className="space-y-2.5">
            {critique.atsRisks.map((risk, idx) => (
              <div
                key={idx}
                className="bg-surface border border-line rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(risk.severity)}
                    <span className="text-xs font-bold text-ink">{risk.issue}</span>
                  </div>
                  <p className="text-xs text-muted pl-0.5">{risk.suggestion}</p>
                </div>

                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('ats')}
                    className="self-start sm:self-center text-xs font-bold text-brand hover:text-brand flex items-center  cursor-pointer shrink-0"
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
