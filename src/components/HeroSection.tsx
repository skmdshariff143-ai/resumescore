'use client';

import Link from 'next/link';

const stats = [
  { value: '10,000+', label: 'Resumes Scored' },
  { value: '6', label: 'Key Dimensions' },
  { value: 'Instant', label: 'Results' },
];

export default function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:py-40"
      aria-labelledby="hero-heading"
    >
      {/* ── Animated floating shapes ── */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Orb 1 – large violet */}
        <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        {/* Orb 2 – cyan */}
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl animate-[float_10s_ease-in-out_2s_infinite]" />
        {/* Orb 3 – purple */}
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl animate-[float_12s_ease-in-out_4s_infinite]" />

        {/* Geometric accents */}
        <div className="absolute top-20 right-[15%] h-16 w-16 rotate-45 rounded-lg border border-violet-500/20 animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-32 left-[10%] h-12 w-12 rotate-12 rounded-full border border-cyan-400/20 animate-[spin_15s_linear_reverse_infinite]" />
        <div className="absolute top-1/2 right-[8%] h-8 w-8 rounded-sm border border-purple-400/20 animate-[spin_25s_linear_infinite]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        {/* ── Badge ── */}
        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            AI-Powered Resume Analysis
          </span>
        </div>

        {/* ── Heading ── */}
        <h1
          id="hero-heading"
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          <span className="block text-white">Score Your Resume</span>
          <span className="mt-1 block bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
            with AI Precision
          </span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          Get instant, detailed feedback on your resume. Improve your chances of
          landing interviews.
        </p>

        {/* ── CTA ── */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/analyze"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-[0.98]"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Analyze Your Resume</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            View History
          </Link>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="mx-auto mt-20 max-w-3xl">
        <div className="grid grid-cols-1 gap-px rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center gap-1 px-6 py-5 ${
                i > 0 ? 'border-t border-white/10 sm:border-l sm:border-t-0' : ''
              }`}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframe styles ── */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-30px) scale(1.05);
          }
        }
      `}</style>
    </section>
  );
}
