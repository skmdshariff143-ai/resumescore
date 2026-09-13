'use client';

import React, { useState } from 'react';
import type { BulletAnalysis } from '@/types';
import { Sparkles, Copy, Check, ShieldCheck, HelpCircle } from 'lucide-react';

interface ResumeRewritePanelProps {
  bulletAnalyses: BulletAnalysis[];
}

export function ResumeRewritePanel({ bulletAnalyses }: ResumeRewritePanelProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getStrengthBadge = (str: string) => {
    switch (str) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40';
      case 'Strong':
        return 'text-cyan-400 bg-cyan-950/50 border-cyan-800/40';
      case 'Developing':
        return 'text-amber-400 bg-amber-950/50 border-amber-800/40';
      default:
        return 'text-rose-400 bg-rose-950/50 border-rose-800/40';
    }
  };

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
            Anti-Hallucination Bullet Copilot ({bulletAnalyses.length} Bullets)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves verified facts while prompting for genuine candidate metrics. No AI-manufactured statistics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
            ✓ Verified Facts Preserved
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/40">
            • Candidate Input Prompted
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {bulletAnalyses.map((bullet, idx) => (
          <div
            key={bullet.id || idx}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">Bullet #{idx + 1}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStrengthBadge(bullet.strength)}`}>
                  {bullet.strength}
                </span>
                {bullet.hasQuantifiableMetric && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    Quantified Metric Found
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopy(bullet.rewritten || '', idx)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy Rewrite</span>
                  </>
                )}
              </button>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Original Experience Bullet</span>
                <p className="text-xs text-slate-300 italic font-serif">&ldquo;{bullet.original}&rdquo;</p>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-900/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-400">Optimized Suggestion</span>
                  <span className="text-[9px] font-mono text-slate-400">X-Y-Z Impact Formula</span>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed">{bullet.rewritten}</p>
              </div>
            </div>

            {/* Fact grounding tags */}
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              {bullet.technologies.length > 0 && (
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Tech: {bullet.technologies.join(', ')}</span>
                </div>
              )}
              {bullet.rewritten?.includes('[Add genuine metric') && (
                <div className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                  <HelpCircle className="w-3 h-3" />
                  <span>Candidate Input Needed: Replace [Add genuine metric] with your real % or $</span>
                </div>
              )}
            </div>

            {/* Actionable Feedback */}
            <div className="text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 flex items-center justify-between">
              <div>
                <strong className="text-slate-300">Feedback: </strong>
                {bullet.suggestions[0] || bullet.rewriteReason || bullet.issues[0] || 'Optimized for action verb strength and impact.'}
              </div>
              <span className="text-indigo-400 text-[10px] font-mono shrink-0 ml-2">
                Verb: &ldquo;{bullet.actionVerb || 'Led'}&rdquo;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
