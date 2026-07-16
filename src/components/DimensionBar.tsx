'use client';

import { useState, useEffect } from 'react';

interface DimensionBarProps {
  name: string;
  score: number;
  icon: string;
  color: string;
  feedback: string;
}

export default function DimensionBar({ name, score, icon, color, feedback }: DimensionBarProps) {
  const [width, setWidth] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Delay to trigger CSS transition on mount
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="space-y-2">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-left group"
        aria-expanded={expanded}
        aria-controls={`dimension-feedback-${name}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            {icon}
          </span>
          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tabular-nums text-white">
            {score}
          </span>
          <svg
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 12px ${color}66`,
          }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name}: ${score} out of 100`}
        />
      </div>

      {/* Expandable feedback */}
      <div
        id={`dimension-feedback-${name}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-slate-300">
          {feedback}
        </p>
      </div>
    </div>
  );
}
