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
      <div className="bg-surface border border-line rounded-2xl p-6 text-center space-y-2 font-sans">
        <GitCompare className="w-6 h-6 text-brand mx-auto opacity-60" />
        <h3 className="text-xs font-sans font-bold text-ink uppercase tracking-wider">Version-Over-Version Comparison</h3>
        <p className="text-xs text-muted max-w-sm mx-auto">
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
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-ink flex items-center">
            <GitCompare className="w-4 h-4 mr-2 text-brand" />
            Resume Version Progression & Dimension Deltas
          </h3>
          <p className="text-sm text-muted mt-0.5 [overflow-wrap:anywhere]">
            Comparing saved analyses. Different jobs or career profiles may use different rubrics. Latest ({latest.fileName}) vs Baseline ({previous.fileName})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-sans font-bold px-3 py-1 rounded-lg border ${
              overallDelta >= 0
                ? 'text-success bg-subtle border-line'
                : 'text-danger bg-subtle border-line'
            }`}
          >
            {overallDelta >= 0 ? `+${overallDelta} pts score change` : `${overallDelta} pts Delta`}
          </span>
        </div>
      </div>

      {/* Side-by-Side Version Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Version */}
        <div className="bg-surface border border-line rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-muted font-sans">Baseline Version</span>
            <span className="text-xs font-sans font-bold text-body">{previous.overallScore}/100</span>
          </div>
          <div className="text-sm text-ink font-semibold [overflow-wrap:anywhere]">{previous.fileName}</div>
          <div className="text-xs text-muted font-sans">
            {new Date(previous.analyzedAt).toLocaleDateString()} • {previous.mode === 'job_match' ? 'Job Match' : 'General'}
          </div>
        </div>

        {/* Latest Version */}
        <div className="bg-surface border border-line rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-brand font-sans">Latest Iteration</span>
            <span className="text-xs font-sans font-bold text-success">{latest.overallScore}/100</span>
          </div>
          <div className="text-sm text-ink font-semibold [overflow-wrap:anywhere]">{latest.fileName}</div>
          <div className="text-xs text-muted font-sans">
            {new Date(latest.analyzedAt).toLocaleDateString()} • {latest.mode === 'job_match' ? 'Job Match' : 'General'}
          </div>
        </div>
      </div>

      {/* Dimension Delta Tags */}
      {dimDeltas.length > 0 && (
        <div className="space-y-2 border-t border-line pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            Dimension Score Changes:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dimDeltas.map((dim) => (
              <div
                key={dim.key}
                className="bg-surface border border-line rounded-lg p-2.5 flex items-center justify-between text-xs"
              >
                <span className="text-body text-xs truncate">{dim.name}</span>
                <span
                  className={`font-sans font-bold text-xs ${
                    dim.delta > 0
                      ? 'text-success'
                      : dim.delta < 0
                      ? 'text-danger'
                      : 'text-muted'
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
