'use client';

import { useState } from 'react';
import type { ScanHistory } from '@/types';

interface HistoryListProps {
  history: ScanHistory[];
  onDelete: (id: string) => void;
  onClear: () => void;
}

/* ── Mini score ring for cards ── */
function MiniScoreRing({ score }: { score: number }) {
  const RADIUS = 18;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  let color = '#fb7185';
  if (score >= 90) color = '#34d399';
  else if (score >= 75) color = '#22d3ee';
  else if (score >= 60) color = '#fbbf24';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{score}</span>
    </div>
  );
}

export default function HistoryList({ history, onDelete, onClear }: HistoryListProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      onClear();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      // Auto-reset after 3s
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  // ── Empty state ──
  if (history.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 text-4xl" aria-hidden="true">
          📋
        </div>
        <h3 className="text-lg font-semibold text-white">No history yet</h3>
        <p className="mt-2 text-sm text-slate-400">
          Analyze a resume to see your scoring history here.
        </p>
        <a
          href="/analyze"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
        >
          Analyze a Resume →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Scoring History{' '}
          <span className="text-sm font-normal text-slate-400">
            ({history.length} {history.length === 1 ? 'scan' : 'scans'})
          </span>
        </h2>

        <button
          onClick={handleClear}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-300 ${
            confirmClear
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {confirmClear ? 'Confirm Clear All?' : 'Clear All'}
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {history.map((entry) => {
          const date = new Date(entry.analyzedAt);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={entry.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              {/* Delete button */}
              <button
                onClick={() => onDelete(entry.id)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-500 opacity-0 transition-all hover:bg-rose-500/20 hover:text-rose-400 group-hover:opacity-100"
                aria-label={`Delete ${entry.fileName} scan`}
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-start gap-4">
                <MiniScoreRing score={entry.overallScore} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white" title={entry.fileName}>
                    {entry.fileName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {formattedDate} · {formattedTime}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      entry.overallScore >= 90
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : entry.overallScore >= 75
                          ? 'bg-cyan-500/15 text-cyan-400'
                          : entry.overallScore >= 60
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    Grade: {entry.grade}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
