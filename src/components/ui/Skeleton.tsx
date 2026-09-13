'use client';

import React from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface ProcessingPipelineProps {
  currentStage?: number;
}

export function ProcessingPipeline({ currentStage = 3 }: ProcessingPipelineProps) {
  const stages = [
    { label: 'Reading document & character encoding', done: currentStage > 1, active: currentStage === 1 },
    { label: 'Detecting sections & parsing work history', done: currentStage > 2, active: currentStage === 2 },
    { label: 'Executing 6-layer semantic skill matching', done: currentStage > 3, active: currentStage === 3 },
    { label: 'Evaluating bullet point impact metrics', done: currentStage > 4, active: currentStage === 4 },
    { label: 'Synthesizing 7-pillar career signal score', done: currentStage > 5, active: currentStage === 5 },
  ];

  return (
    <div className="max-w-md w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-bold text-slate-100">Analyzing Your Career Profile</h4>
          <p className="text-xs text-slate-400 font-mono">Running deterministic verification...</p>
        </div>
      </div>

      <div className="space-y-2.5 text-left border-t border-slate-800 pt-4">
        {stages.map((st, i) => (
          <div key={i} className="flex items-center space-x-2.5 text-xs">
            {st.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : st.active ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
            )}
            <span
              className={`${
                st.done
                  ? 'text-slate-300 font-medium line-through opacity-70'
                  : st.active
                  ? 'text-indigo-300 font-bold'
                  : 'text-slate-500'
              }`}
            >
              {st.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
