'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ResumeScore } from '@/types';
import { saveScan } from '@/lib/storage';
import ScoreRing from './ScoreRing';
import DimensionBar from './DimensionBar';
import FeedbackPanel from './FeedbackPanel';

interface ScoreCardProps {
  score: ResumeScore;
  onReset?: () => void;
}

/* ── Confetti piece component ── */
function ConfettiPiece({ index }: { index: number }) {
  const colors = ['#8b5cf6', '#a78bfa', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#c084fc'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 1.5;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 6;
  const rotation = Math.random() * 360;

  return (
    <div
      className="confetti-piece"
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 0.6}px`,
        backgroundColor: color,
        borderRadius: '2px',
        transform: `rotate(${rotation}deg)`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      aria-hidden="true"
    />
  );
}

export default function ScoreCard({ score, onReset }: ScoreCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [saved, setSaved] = useState(false);

  // Trigger confetti for high scores
  useEffect(() => {
    if (score.overall > 90) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [score.overall]);

  const handleSave = useCallback(() => {
    saveScan(score, 'Resume');
    setSaved(true);
  }, [score]);

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* ── Confetti overlay ── */}
      {showConfetti && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}
        </div>
      )}

      {/* ── Glass card ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
        {/* Subtle gradient glow at top */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl"
          aria-hidden="true"
        />

        {/* ── Score ring ── */}
        <div className="relative flex flex-col items-center gap-2 pb-6">
          <ScoreRing score={score.overall} grade={score.grade} animate />
          <p className="mt-2 text-sm font-medium text-slate-400">Overall Score</p>
        </div>

        {/* ── Dimension bars ── */}
        <div className="space-y-5 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {score.dimensions.map((dim) => (
              <DimensionBar
                key={dim.name}
                name={dim.name}
                score={dim.score}
                icon={dim.icon}
                color={dim.color}
                feedback={dim.feedback}
              />
            ))}
          </div>
        </div>

        {/* ── Feedback panel ── */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <FeedbackPanel items={score.feedback} />
        </div>

        {/* ── Action buttons ── */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <button
            onClick={handleSave}
            disabled={saved}
            className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              saved
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98]'
            }`}
          >
            {saved ? '✓ Saved to History' : 'Save to History'}
          </button>

          <button
            onClick={onReset}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Analyze Another
          </button>
        </div>
      </div>
    </div>
  );
}
