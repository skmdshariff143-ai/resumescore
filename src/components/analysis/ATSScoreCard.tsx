'use client';

import React from 'react';
import type { ATSAnalysis } from '@/types';
import { ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

interface ATSScoreCardProps {
  analysis?: ATSAnalysis;
}

export function ATSScoreCard({ analysis }: ATSScoreCardProps) {
  if (!analysis) return null;

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-brand" />
            ATS Readability Estimate
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Checks detectable text, contact details and standard headings. This estimate is not certification against commercial ATS platforms.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-sans text-muted">Readability:</span>
            <span className="text-base font-bold text-success block font-sans">
              {analysis.score}/100
            </span>
          </div>
          <span className="text-xs font-bold text-brand bg-brand-soft border border-line px-2.5 py-1 rounded-lg">
            Grade {analysis.grade}
          </span>
        </div>
      </div>

      {/* 8 ATS Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.checks.map((check, idx) => (
          <div
            key={idx}
            className="bg-surface border border-line rounded-xl p-4 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">{check.name}</span>
                {check.passed ? (
                  <span className="inline-flex items-center text-xs font-bold text-success bg-subtle border border-line px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-bold text-danger bg-subtle border border-line px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3 mr-1" />
                    {check.severity.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-body leading-relaxed">{check.message}</p>
            </div>

            <div className="border-t border-line pt-2 space-y-1 text-xs text-muted">
              <div><strong className="text-body">Why it matters: </strong>{check.whyItMatters}</div>
              {!check.passed && (
                <div className="text-brand">
                  <strong>Fix: </strong>{check.fix}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
