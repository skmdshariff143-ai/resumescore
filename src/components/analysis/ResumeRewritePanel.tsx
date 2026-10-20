'use client';

import React, { useState } from 'react';
import type { BulletAnalysis } from '@/types';
import { Sparkles, Copy, Check, ShieldCheck, HelpCircle } from 'lucide-react';

interface ResumeRewritePanelProps {
  bulletAnalyses: BulletAnalysis[];
}

export function ResumeRewritePanel({ bulletAnalyses }: ResumeRewritePanelProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [copyStatus, setCopyStatus] = useState('');
  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setCopyStatus('Suggested wording copied. Review all claims before using it.');
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      setCopyStatus('Clipboard access was denied. Select and copy the wording manually.');
    }
  };

  const getStrengthBadge = (str: string) => {
    switch (str) {
      case 'Excellent':
        return 'text-success bg-subtle border-line';
      case 'Strong':
        return 'text-brand bg-brand-soft border-line';
      case 'Developing':
        return 'text-warning bg-subtle border-line';
      default:
        return 'text-danger bg-subtle border-line';
    }
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-brand" />
            Bullet evidence review ({bulletAnalyses.length} Bullets)
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Preserves supplied facts while prompting for genuine candidate metrics. No AI-manufactured statistics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="px-2 py-0.5 rounded bg-subtle text-success border border-line">
            ✓ Supplied Facts Preserved
          </span>
          <span className="px-2 py-0.5 rounded bg-subtle text-warning border border-line">
            • Candidate Input Prompted
          </span>
        </div>
      </div>

      <p role="status" className="text-sm text-muted">{copyStatus}</p>
      <div className="space-y-4">
        {bulletAnalyses.map((bullet, idx) => (
          <div
            key={bullet.id || idx}
            className="bg-surface border border-line rounded-xl p-5 space-y-4"
          >
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-sans font-bold text-muted">Bullet #{idx + 1}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getStrengthBadge(bullet.strength)}`}>
                  {bullet.strength}
                </span>
                {bullet.hasQuantifiableMetric && (
                  <span className="text-xs font-sans text-success bg-subtle px-2 py-0.5 rounded border border-line">
                    Quantified Metric Found
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCopy(bullet.rewritten || '', idx)}
                className="px-3 py-1 rounded-lg bg-surface hover:bg-subtle border border-line text-xs text-body font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-success">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-muted" />
                    <span>Copy Rewrite</span>
                  </>
                )}
              </button>
            </div>

            {/* Side by side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface border border-line rounded-lg p-3 space-y-1">
                <span className="text-xs uppercase font-sans font-bold text-muted">Original Experience Bullet</span>
                <p className="text-xs text-body italic font-serif">&ldquo;{bullet.original}&rdquo;</p>
              </div>

              <div className="bg-brand-soft border border-line rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-sans font-bold text-brand">Optimized Suggestion</span>
                  <span className="text-xs font-sans text-muted">X-Y-Z Impact Formula</span>
                </div>
                <p className="text-xs text-ink font-medium leading-relaxed">{bullet.rewritten}</p>
              </div>
            </div>

            {/* Fact grounding tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {bullet.technologies.length > 0 && (
                <div className="flex items-center gap-1 text-success bg-subtle px-2 py-0.5 rounded border border-line">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Detected terms: {bullet.technologies.join(', ')}</span>
                </div>
              )}
              {bullet.rewritten?.includes('[Add genuine metric') && (
                <div className="flex items-center gap-1 text-warning bg-subtle px-2 py-0.5 rounded border border-line">
                  <HelpCircle className="w-3 h-3" />
                  <span>Candidate Input Needed: Replace [Add genuine metric] with your real % or $</span>
                </div>
              )}
            </div>

            {/* Actionable Feedback */}
            <div className="text-xs text-muted border-t border-line pt-2 flex items-center justify-between">
              <div>
                <strong className="text-body">Feedback: </strong>
                {bullet.suggestions[0] || bullet.rewriteReason || bullet.issues[0] || 'Optimized for action verb strength and impact.'}
              </div>
              <span className="text-brand text-xs font-sans shrink-0 ml-2">
                Verb: &ldquo;{bullet.actionVerb || 'Not detected'}&rdquo;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
