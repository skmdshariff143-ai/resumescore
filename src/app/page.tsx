'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Target,
  FileCheck2,
  Lock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [activeBeforeAfter, setActiveBeforeAfter] = useState<number>(0);

  const beforeAfterExamples = [
    {
      role: 'Backend / Distributed Systems',
      weak: 'Worked on database queries and helped improve backend API latency for users.',
      strong: 'Engineered high-throughput PostgreSQL query optimizations and Redis caching layers, reducing API p99 latency by [Add genuine metric: % or ms] across 200k+ daily requests.',
      verifiedTechs: ['PostgreSQL', 'Redis', 'REST APIs'],
      candidateInput: 'Latency reduction % or millisecond improvement',
      why: 'Replaces passive "worked on" with active impact verb, specifies technical stack, and prompts for genuine verified metrics.',
    },
    {
      role: 'Frontend / Full-Stack',
      weak: 'Responsible for building new frontend user interfaces in React and fixing bugs.',
      strong: 'Architected responsive customer-facing dashboard in React and TypeScript, accelerating client onboarding workflow speed by [Add genuine metric: % or time].',
      verifiedTechs: ['React', 'TypeScript', 'Responsive UI'],
      candidateInput: 'Onboarding speed increase or user adoption count',
      why: 'Eliminates weak phrase "responsible for" and frames work around user velocity and verified frontend technologies.',
    },
    {
      role: 'DevOps / Cloud Architecture',
      weak: 'Set up Docker containers and Kubernetes clusters on AWS cloud.',
      strong: 'Automated containerized microservice deployments via Docker and Kubernetes on AWS EKS, establishing automated zero-downtime CI/CD pipelines via GitHub Actions.',
      verifiedTechs: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      candidateInput: 'Deployment frequency or infrastructure cost savings',
      why: 'Demonstrates end-to-end cloud infrastructure ownership while preserving candidate truth without manufactured statistics.',
    },
  ];

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-28 font-sans">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 px-4 py-1.5 rounded-full shadow-inner">
          <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Evidence-First Career Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.15]">
          Know exactly how your resume performs <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            before you apply.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Analyze your resume, match it against real job requirements, and get evidence-backed recommendations for improving your application.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/analyze">
            <Button variant="signal" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Analyze My Resume
            </Button>
          </Link>
          <Link href="/analyze?mode=job_match">
            <Button variant="secondary" size="lg" icon={<Target className="w-4 h-4 text-cyan-400" />}>
              Match a Job Description
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Career Signal Mockup */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-b from-slate-900/95 to-slate-950 border border-white/[0.10] rounded-2xl p-6 sm:p-8 shadow-2xl text-left space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-indigo-500/40 flex items-center justify-center font-mono font-black text-2xl text-emerald-400 shadow-inner">
                  84
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100">Senior Backend Engineer</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      Strong Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    12 of 14 core requirements verified with resume evidence.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic 7-Pillar Math</span>
              </div>
            </div>

            {/* Requirement Alignment Trace */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">AWS Cloud</span>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Direct Evidence (100%)
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">Deployed on AWS EKS & S3</p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">PostgreSQL</span>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Direct Evidence (100%)
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">Query optimization & schema design</p>
              </div>

              <div className="bg-slate-950/70 border border-amber-900/40 rounded-xl p-3 space-y-1">
                <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">Apache Kafka</span>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Ecosystem Familiarity (80%)
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">RabbitMQ & Event Streams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PILLARS: ONE RESUME. COMPLETE CAREER SIGNAL */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            One resume. Complete career signal.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A comprehensive suite of five specialized analytical intelligence engines working in unison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/70 border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-6 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">7-Pillar Deterministic Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black boxes. Your score strictly equals the sum of transparent mathematical contributions across ATS, skills, metrics, and experience.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-6 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">6-Layer Skill & Taxonomy Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              From exact keyword aliases to ecosystem subsumption across 11 technical taxonomies, ensuring strict false-positive defense.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-6 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">8-Factor ATS Parsing Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnostics for single/two-column formats, contact discoverability, section header standardization, and character densities.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/[0.08] hover:border-purple-500/40 rounded-2xl p-6 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Measurable Impact Evaluator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Classifies bullet strength into Weak, Developing, Strong, and Excellent using action verbs and quantifiable pattern detection.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-white/[0.08] hover:border-amber-500/40 rounded-2xl p-6 space-y-3 transition-colors md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Anti-Hallucination Rewrite Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transforms weak experience lines using standard X-Y-Z frameworks without fabricating metrics. Prompts user with explicit input placeholders for genuine numbers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 5 STEPS */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            How ResumeScore Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A linear, high-precision workflow from raw document to confident job application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Upload', desc: 'Secure client-side PDF/text ingestion with encoding diagnostics.' },
            { step: '02', title: 'Analyze', desc: '7-pillar deterministic scoring and ATS compliance checks.' },
            { step: '03', title: 'Match', desc: '6-layer semantic evaluation against target role requirements.' },
            { step: '04', title: 'Improve', desc: 'Anti-hallucination bullet rewrites and skill gap recommendations.' },
            { step: '05', title: 'Apply', desc: 'Executive PDF summary export and targeted cover letter creation.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2 relative overflow-hidden"
            >
              <span className="text-2xl font-black font-mono text-indigo-400/40 block">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EVIDENCE-FIRST INTELLIGENCE DEMO */}
      <section className="bg-slate-900/80 border border-white/[0.08] rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
            Transparent Verification Flow
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Evidence-First Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Every conclusion is strictly backed by quotes from your parsed resume text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">1. Requirement</span>
            <div className="text-xs font-bold text-slate-200">&ldquo;FastAPI & Python backend experience&rdquo;</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/50 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-indigo-400">2. Parsed Evidence</span>
            <div className="text-xs text-slate-300 italic">&ldquo;Built REST services using FastAPI and Python&rdquo;</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/50 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-emerald-400">3. Match Confidence</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Level 1 Exact
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/50 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-cyan-400">4. Recommended Action</span>
            <div className="text-xs text-slate-300">Feature prominently in top 3 work bullet points.</div>
          </div>
        </div>
      </section>

      {/* 5. BEFORE / AFTER BULLET OPTIMIZER */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-full">
            Anti-Hallucination Protection
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Before & After Bullet Optimization
          </h2>
          <p className="text-xs text-slate-400">
            We preserve verified facts while prompting you for genuine metrics. No AI-manufactured statistics.
          </p>
        </div>

        {/* Role Tab Switcher */}
        <div className="flex justify-center space-x-2">
          {beforeAfterExamples.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBeforeAfter(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeBeforeAfter === idx
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ex.role}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before / Original */}
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  Weak Original Bullet
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Lacks quantifiable impact</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-serif italic">
                &ldquo;{beforeAfterExamples[activeBeforeAfter].weak}&rdquo;
              </p>
            </div>

            {/* After / Improved */}
            <div className="bg-slate-950/80 border border-emerald-900/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Optimized Version
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">X-Y-Z Action Formula</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 font-medium">
                {beforeAfterExamples[activeBeforeAfter].strong}
              </p>
            </div>
          </div>

          {/* Fact Grounding & Candidate Prompt Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                Verified Facts
              </span>
              <span className="text-slate-300 text-[11px]">
                {beforeAfterExamples[activeBeforeAfter].verifiedTechs.join(', ')}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 shrink-0">
                Candidate Input Needed
              </span>
              <span className="text-slate-300 text-[11px]">
                {beforeAfterExamples[activeBeforeAfter].candidateInput}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIVACY & TRUST ARCHITECTURE */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/[0.08] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            <Lock className="w-3 h-3 mr-1" />
            Local-First Privacy Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Your Career Data Stays Under Your Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            We believe sensitive career history should never be scraped, sold, or used for model training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              Client-Side PDF Extraction
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Text extraction runs natively in your browser via Mozilla PDF.js. Your document bytes never touch a cloud bucket.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              No LLM Training on Resumes
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All scoring is evaluated via deterministic rules and isolated prompts with strict anti-injection guardrails.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              Instant Local Data Deletion
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              History is stored in your local browser storage. You can purge all records with a single click at any time.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERTING CTA */}
      <section className="text-center space-y-6 py-8">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
          Build a stronger application today.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Get transparent, evidence-backed career signals before submitting your next application.
        </p>
        <div>
          <Link href="/analyze">
            <Button variant="signal" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Start Free Resume Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
