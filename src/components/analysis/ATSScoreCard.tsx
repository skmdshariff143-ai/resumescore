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
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-indigo-400" />
            8-Factor ATS Parsing & Machine Readability Audit
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verifies formatting, contact discoverability, layout parsing, and standard headers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">ATS Score:</span>
            <span className="text-base font-black text-emerald-400 block font-mono">
              {analysis.score}/100
            </span>
          </div>
          <span className="text-[11px] font-bold text-indigo-300 bg-indigo-950 border border-indigo-800 px-2.5 py-1 rounded-lg">
            Grade {analysis.grade}
          </span>
        </div>
      </div>

      {/* 8 ATS Checks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.checks.map((check, idx) => (
          <div
            key={idx}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{check.name}</span>
                {check.passed ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Passed
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
                    <XCircle className="w-3 h-3 mr-1" />
                    {check.severity.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{check.message}</p>
            </div>

            <div className="border-t border-slate-800/60 pt-2 space-y-1 text-[10px] text-slate-400">
              <div><strong className="text-slate-300">Why it matters: </strong>{check.whyItMatters}</div>
              {!check.passed && (
                <div className="text-indigo-300">
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
