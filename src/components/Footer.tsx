'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05070B] border-t border-white/[0.08] py-12 mt-20 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-200 font-black text-sm">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>ResumeScore</span>
              <span className="text-[10px] font-mono text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                Career Intelligence SaaS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-md">
              Deterministic 7-pillar career signal architecture, 6-layer semantic skill matching, and anti-hallucination bullet optimization.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200 transition-colors">
              Platform
            </Link>
            <Link href="/analyze" className="hover:text-slate-200 transition-colors">
              Analyze
            </Link>
            <Link href="/history" className="hover:text-slate-200 transition-colors">
              History
            </Link>
          </div>
        </div>

        {/* Trust & Architecture Statement */}
        <div className="bg-[#080B14] border border-white/[0.06] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Zero-Data Selling: </strong>
              All document extraction runs in your browser environment. Your resume is never used to train public LLMs. Optional AI analysis features use zero-retention APIs.
            </span>
          </div>
          <div className="font-mono text-[10px] text-slate-500 shrink-0">
            Next.js 16 • Turbopack • React 19
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-600">
          © {new Date().getFullYear()} ResumeScore Inc. Evidence-backed career intelligence.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
