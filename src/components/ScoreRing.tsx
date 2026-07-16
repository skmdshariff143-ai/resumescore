'use client';

import { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  grade: string;
  animate?: boolean;
}

function getScoreColor(score: number) {
  if (score >= 90) return { ring: '#34d399', glow: 'rgba(52, 211, 153, 0.35)', label: 'text-emerald-400' };
  if (score >= 75) return { ring: '#22d3ee', glow: 'rgba(34, 211, 238, 0.35)', label: 'text-cyan-400' };
  if (score >= 60) return { ring: '#fbbf24', glow: 'rgba(251, 191, 36, 0.35)', label: 'text-amber-400' };
  return { ring: '#fb7185', glow: 'rgba(251, 113, 133, 0.35)', label: 'text-rose-400' };
}

export default function ScoreRing({ score, grade, animate = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [progress, setProgress] = useState(animate ? 0 : score);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const DURATION = 1500; // ms
  const RADIUS = 56;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  const colors = getScoreColor(score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setProgress(score);
      return;
    }

    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);

      const current = Math.round(eased * score);
      setDisplayScore(current);
      setProgress(eased * score);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [score, animate]);

  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`Score: ${score} out of 100, Grade: ${grade}`}>
      {/* Glow effect */}
      <div
        className="absolute h-36 w-36 rounded-full blur-2xl transition-all duration-1000"
        style={{ backgroundColor: colors.glow }}
        aria-hidden="true"
      />

      <svg
        width="148"
        height="148"
        viewBox="0 0 128 128"
        className="relative -rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx="64"
          cy="64"
          r={RADIUS}
          fill="none"
          stroke={colors.ring}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-100 ease-out"
        />
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center">
        <span className={`text-4xl font-bold tabular-nums ${colors.label}`}>
          {displayScore}
        </span>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {grade}
        </span>
      </div>
    </div>
  );
}
