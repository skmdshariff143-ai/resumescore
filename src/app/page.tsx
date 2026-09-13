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
        {/* Architectural System Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[11px] font-mono font-medium tracking-tight text-slate-300 bg-slate-900/90 border border-slate-700/70 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="uppercase text-slate-400">System v0.4.0</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200">Evidence-First Career Intelligence Workspace</span>
        </div>

        {/* High-Contrast Typographic Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-[-0.035em] leading-[1.08]">
          Know exactly how your resume performs <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
            before you apply.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Analyze your resume, match it against real job requirements, and get evidence-backed recommendations for improving your application.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/analyze">
            <Button
              variant="signal"
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-lg shadow-white/5 border border-white active:scale-[0.98]"
              iconRight={<ArrowRight className="w-4 h-4 text-slate-950" />}
            >
              Analyze My Resume
            </Button>
          </Link>
          <Link href="/analyze?mode=job_match">
            <Button
              variant="secondary"
              size="lg"
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-medium"
              icon={<Target className="w-4 h-4 text-blue-400" />}
            >
              Match a Job Description
            </Button>
          </Link>
        </div>

        {/* Hero Interactive Career Signal Centerpiece */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-left space-y-6 relative overflow-hidden backdrop-blur-xl ring-1 ring-white/[0.06]">
            {/* Ambient Corner Accent */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

            {/* Header: Score Gauge + Role Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-800/80 pb-6 relative z-10">
              <div className="flex items-start sm:items-center gap-4">
                {/* Precision Instrument Score Readout */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700/80 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">SCORE</span>
                    <span className="font-mono font-black text-2xl text-emerald-400 tracking-tight leading-none">84</span>
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-emerald-950 border border-emerald-700/60 text-[9px] font-mono font-bold text-emerald-400">
                    A
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                      Senior Backend Engineer
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Strong Match
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Target: <span className="text-slate-300 font-medium">CloudScale AI</span> • 12 of 14 core requirements verified with resume evidence.
                  </p>
                </div>
              </div>

              {/* Provenance Badge */}
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm shrink-0">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Engine:</span>
                <span className="text-slate-200 font-semibold">Deterministic 7-Pillar Math</span>
              </div>
            </div>

            {/* Requirement Alignment Trace: Direct Evidence vs Ecosystem Familiarity */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
                <span>VERIFIED REQUIREMENT ALIGNMENT TRACE</span>
                <span className="text-slate-500">3 of 14 displayed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. Direct Evidence: AWS Cloud */}
                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2.5 relative group hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                      AWS Cloud
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-600/50 px-2 py-0.5 rounded">
                      100% EXACT
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Direct Evidence Verified</span>
                  </div>
                  <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800/80">
                    <p className="text-[11px] text-slate-300 font-mono leading-relaxed line-clamp-2">
                      &ldquo;Automated containerized microservices via Docker & Kubernetes on AWS EKS&rdquo;
                    </p>
                  </div>
                </div>

                {/* 2. Direct Evidence: PostgreSQL */}
                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-2.5 relative group hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                      PostgreSQL
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-600/50 px-2 py-0.5 rounded">
                      100% EXACT
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Direct Evidence Verified</span>
                  </div>
                  <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800/80">
                    <p className="text-[11px] text-slate-300 font-mono leading-relaxed line-clamp-2">
                      &ldquo;Optimized PostgreSQL sharding across 15TB cluster, cutting timeouts 94%&rdquo;
                    </p>
                  </div>
                </div>

                {/* 3. Ecosystem Familiarity: Apache Kafka (DASHED, DISTINCT STATE) */}
                <div className="bg-amber-950/[0.12] border border-dashed border-amber-500/40 rounded-xl p-4 space-y-2.5 relative group hover:border-amber-500/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-200 uppercase tracking-wider">
                      Apache Kafka
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2 py-0.5 rounded">
                      80% DERIVED
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Ecosystem Familiarity</span>
                  </div>
                  <div className="bg-slate-900/80 rounded-lg p-2 border border-amber-900/30">
                    <p className="text-[11px] text-amber-200/90 font-mono leading-relaxed line-clamp-2">
                      Subsumed via Message Broker Taxonomy (RabbitMQ & Event Streams in resume)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calibration Footer: Traceability & Integrity */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/60 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Audit Ref: #RS-84-EVAL</span>
              </div>
              <div className="flex items-center gap-4">
                <span>0% Fabricated Claims</span>
                <span className="hidden sm:inline">•</span>
                <span>Client-Side Ingestion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PILLARS: ONE RESUME. COMPLETE CAREER SIGNAL */}
      <section className="bg-slate-950/50 border border-slate-800/70 rounded-3xl p-6 sm:p-10 space-y-10 relative overflow-hidden backdrop-blur-sm">
        {/* Subtle Section Ambience */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-blue-400 bg-blue-950/50 border border-blue-800/40">
            Architectural Engine Overview
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            One resume. Complete career signal.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A comprehensive suite of five specialized analytical intelligence engines working in unison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* PRIMARY HERO CARD: 7-Pillar Deterministic Scoring (Spans 2 columns) */}
          <div className="md:col-span-2 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 sm:p-7 space-y-5 transition-all shadow-lg group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-400 flex items-center justify-center shadow-inner">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                    FOUNDATIONAL CORE
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100">
                    7-Pillar Deterministic Scoring
                  </h3>
                </div>
              </div>
              <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto">
                100% Reproducible Math
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              No black boxes. Your score strictly equals the sum of transparent mathematical contributions across ATS, skills, metrics, and experience.
            </p>

            {/* Mini-Visual: The 7-Pillar Proportional Spectrum Bar */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-slate-300">WEIGHT ALLOCATION ARCHITECTURE</span>
                <span className="text-emerald-400 font-bold">Sum = 100% Deterministic</span>
              </div>

              {/* Segmented Bar */}
              <div className="h-3 w-full rounded-md overflow-hidden flex bg-slate-900 p-0.5 border border-slate-800">
                <div style={{ width: '25%' }} title="Skill Match (25%)" className="h-full bg-blue-500 rounded-sm mr-0.5" />
                <div style={{ width: '20%' }} title="Experience (20%)" className="h-full bg-indigo-500 rounded-sm mr-0.5" />
                <div style={{ width: '15%' }} title="ATS Audit (15%)" className="h-full bg-emerald-500 rounded-sm mr-0.5" />
                <div style={{ width: '15%' }} title="Impact & Metrics (15%)" className="h-full bg-cyan-500 rounded-sm mr-0.5" />
                <div style={{ width: '10%' }} title="Projects (10%)" className="h-full bg-amber-500 rounded-sm mr-0.5" />
                <div style={{ width: '10%' }} title="Structure (10%)" className="h-full bg-purple-500 rounded-sm mr-0.5" />
                <div style={{ width: '5%' }} title="Profile (5%)" className="h-full bg-slate-400 rounded-sm" />
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Skills: 25%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Experience: 20%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>ATS Audit: 15%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span>Metrics: 15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: 6-Layer Skill & Taxonomy Matching */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-md group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 flex items-center justify-center shadow-inner">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    SEMANTIC ENGINE
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    6-Layer Skill & Taxonomy Matching
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                From exact keyword aliases to ecosystem subsumption across 11 technical taxonomies, ensuring strict false-positive defense.
              </p>
            </div>

            {/* Mini-Visual: 6-Layer Taxonomy Hierarchy Stepper */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 space-y-1.5 font-mono text-[10px]">
              <div className="text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                Resolution Layers
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                  <span>L1 Exact Keyword</span>
                  <span>100% Match</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded">
                  <span>L2 Normalized & Alias</span>
                  <span>95% Match</span>
                </div>
                <div className="flex items-center justify-between text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">
                  <span>L3 Taxonomy Subsumption</span>
                  <span>80% Match</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: 8-Factor ATS Parsing Audit */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-md group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 flex items-center justify-center shadow-inner">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    PARSER COMPLIANCE
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    8-Factor ATS Parsing Audit
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diagnostics for single/two-column formats, contact discoverability, section header standardization, and character densities.
              </p>
            </div>

            {/* Mini-Visual: Diagnostic Checklist */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 space-y-1.5 font-mono text-[10px]">
              <div className="text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-800/80">
                Machine Parser Checks
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Single-Column Hierarchy Validated</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Standard Section Headers (5/5)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>Zero Unparseable Table Blocks</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: Measurable Impact Evaluator */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-md group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-700/50 text-blue-400 flex items-center justify-center shadow-inner">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                    METRIC RIGOR
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    Measurable Impact Evaluator
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Classifies bullet strength into Weak, Developing, Strong, and Excellent using action verbs and quantifiable pattern detection.
              </p>
            </div>

            {/* Mini-Visual: Impact Tier Meter */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Impact Classification</span>
                <span className="text-emerald-400 font-bold">Excellent Tier</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-slate-900 py-1 rounded text-slate-500">Weak</div>
                <div className="bg-slate-900 py-1 rounded text-slate-500">Developing</div>
                <div className="bg-slate-900 py-1 rounded text-slate-400">Strong</div>
                <div className="bg-emerald-950 border border-emerald-700/50 py-1 rounded text-emerald-400 font-bold">
                  Excellent
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: Anti-Hallucination Rewrite Copilot */}
          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-4 transition-all shadow-md group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 flex items-center justify-center shadow-inner">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    SAFETY GUARDRAILS
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    Anti-Hallucination Rewrite Copilot
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transforms weak experience lines using standard X-Y-Z frameworks without fabricating metrics. Prompts user with explicit input placeholders for genuine numbers.
              </p>
            </div>

            {/* Mini-Visual: Guardrailed Diff Snippet */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 space-y-1.5 font-mono text-[10px]">
              <div className="text-rose-400/90 bg-rose-950/30 px-2 py-1 rounded border border-rose-900/30 line-through truncate">
                - Worked on backend API queries.
              </div>
              <div className="text-emerald-300 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/30 leading-snug">
                + Architected PostgreSQL indexing, cutting p99 by <span className="text-amber-400 bg-amber-950 px-1 rounded border border-amber-700/60 font-bold">[Add % metric]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 5 STEPS */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800">
            Execution Flow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            How ResumeScore Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A linear, high-precision workflow from raw document to confident job application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
          {[
            { step: '01', title: 'Upload', desc: 'Secure client-side PDF/text ingestion with encoding diagnostics.' },
            { step: '02', title: 'Analyze', desc: '7-pillar deterministic scoring and ATS compliance checks.' },
            { step: '03', title: 'Match', desc: '6-layer semantic evaluation against target role requirements.' },
            { step: '04', title: 'Improve', desc: 'Anti-hallucination bullet rewrites and skill gap recommendations.' },
            { step: '05', title: 'Apply', desc: 'Executive PDF summary export and targeted cover letter creation.' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-2 relative overflow-hidden transition-all group"
            >
              <span className="text-xl font-black font-mono text-slate-600 group-hover:text-blue-400/80 transition-colors block">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EVIDENCE-FIRST INTELLIGENCE DEMO */}
      <section className="bg-slate-950/50 border border-slate-800/70 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-sm">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 border border-blue-800/50 px-3 py-1 rounded-full">
            Transparent Verification Flow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Evidence-First Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Every conclusion is strictly backed by quotes from your parsed resume text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">1. Requirement</span>
            <div className="text-xs font-bold text-slate-200">&ldquo;FastAPI & Python backend experience&rdquo;</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-900/40 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-blue-400">2. Parsed Evidence</span>
            <div className="text-xs text-slate-300 italic">&ldquo;Built REST services using FastAPI and Python&rdquo;</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/40 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-emerald-400">3. Match Confidence</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Level 1 Exact
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">4. Recommended Action</span>
            <div className="text-xs text-slate-300">Feature prominently in top 3 work bullet points.</div>
          </div>
        </div>
      </section>

      {/* 5. BEFORE / AFTER BULLET OPTIMIZER */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/50 px-3 py-1 rounded-full">
            Anti-Hallucination Protection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ex.role}
            </button>
          ))}
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before / Original */}
            <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
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
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
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
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                Verified Facts
              </span>
              <span className="text-slate-300 text-[11px]">
                {beforeAfterExamples[activeBeforeAfter].verifiedTechs.join(', ')}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 shrink-0">
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
      <section className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 space-y-8 backdrop-blur-sm">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            <Lock className="w-3 h-3 mr-1" />
            Local-First Privacy Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Your Career Data Stays Under Your Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            We believe sensitive career history should never be scraped, sold, or used for model training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              Client-Side PDF Extraction
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Text extraction runs natively in your browser via Mozilla PDF.js. Your document bytes never touch a cloud bucket.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              No LLM Training on Resumes
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All scoring is evaluated via deterministic rules and isolated prompts with strict anti-injection guardrails.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              Instant Local Data Deletion
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              History is stored in your local browser storage. You can purge all records with a single click at any time.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL HIGH-CONVERTING CTA */}
      <section className="text-center space-y-6 py-12 px-6 rounded-3xl bg-gradient-to-b from-slate-900/60 to-slate-950 border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/[0.04] rounded-full blur-2xl pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight relative z-10">
          Build a stronger application today.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto relative z-10">
          Get transparent, evidence-backed career signals before submitting your next application.
        </p>
        <div className="relative z-10">
          <Link href="/analyze">
            <Button
              variant="signal"
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 font-semibold shadow-lg shadow-white/5 border border-white"
              iconRight={<ArrowRight className="w-4 h-4 text-slate-950" />}
            >
              Start Free Resume Analysis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
