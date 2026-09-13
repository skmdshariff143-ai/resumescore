'use client';

import React from 'react';
import { GitCompare } from 'lucide-react';
import type { ScanHistory } from '@/types';

interface VersionComparisonProps {
  history: ScanHistory[];
}

export function VersionComparison({ history }: VersionComparisonProps) {
  if (history.length < 2) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2 font-sans">
        <GitCompare className="w-6 h-6 text-blue-400 mx-auto opacity-60" />
        <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Version-Over-Version Comparison</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Analyze two or more resume iterations to inspect dimension deltas and resolved skill gaps.
        </p>
      </div>
    );
  }

  const latest = history[0];
  const previous = history[1];
  const overallDelta = latest.overallScore - previous.overallScore;

  // Calculate dimension level deltas if dimensions are available
  const dimDeltas = (latest.dimensions || []).map((latDim) => {
    const prevDim = (previous.dimensions || []).find((d) => d.key === latDim.key);
    const delta = prevDim ? latDim.score - prevDim.score : 0;
    return {
      key: latDim.key,
      name: latDim.name,
      latestScore: latDim.score,
      prevScore: prevDim ? prevDim.score : latDim.score,
      delta,
    };
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center">
            <GitCompare className="w-4 h-4 mr-2 text-blue-400" />
            Resume Version Progression & Dimension Deltas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparing Latest Version ({latest.fileName}) vs Baseline ({previous.fileName})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
              overallDelta >= 0
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
            }`}
          >
            {overallDelta >= 0 ? `+${overallDelta} pts Overall Improvement` : `${overallDelta} pts Delta`}
          </span>
        </div>
      </div>

      {/* Side-by-Side Version Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Version */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Baseline Version</span>
            <span className="text-xs font-mono font-bold text-slate-300">{previous.overallScore}/100</span>
          </div>
          <div className="text-xs text-slate-200 font-bold">{previous.fileName}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {new Date(previous.analyzedAt).toLocaleDateString()} • {previous.mode === 'job_match' ? 'Job Match' : 'General'}
          </div>
        </div>

        {/* Latest Version */}
        <div className="bg-slate-950/70 border border-blue-900/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-400 font-mono">Latest Iteration</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{latest.overallScore}/100</span>
          </div>
          <div className="text-xs text-slate-100 font-bold">{latest.fileName}</div>
          <div className="text-[11px] text-slate-400 font-mono">
            {new Date(latest.analyzedAt).toLocaleDateString()} • {latest.mode === 'job_match' ? 'Job Match' : 'General'}
          </div>
        </div>
      </div>

      {/* Dimension Delta Tags */}
      {dimDeltas.length > 0 && (
        <div className="space-y-2 border-t border-slate-800/80 pt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Dimension Score Changes:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dimDeltas.map((dim) => (
              <div
                key={dim.key}
                className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs"
              >
                <span className="text-slate-300 text-[11px] truncate">{dim.name}</span>
                <span
                  className={`font-mono font-bold text-[11px] ${
                    dim.delta > 0
                      ? 'text-emerald-400'
                      : dim.delta < 0
                      ? 'text-rose-400'
                      : 'text-slate-500'
                  }`}
                >
                  {dim.delta > 0 ? `+${dim.delta}` : dim.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
