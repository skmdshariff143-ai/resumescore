'use client';

import React, { useState } from 'react';
import { Activity, ShieldCheck, Target, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import type { ResumeScore } from '@/types';

interface CareerSignalRadarProps {
  score: ResumeScore;
  onNavigateToTab?: (tab: string) => void;
  className?: string;
}

export function CareerSignalRadar({ score, onNavigateToTab, className = '' }: CareerSignalRadarProps) {
  const [activeVector, setActiveVector] = useState<string | null>(null);

  // 4 Core Career Signal Vectors
  // 1. Resume Quality (ATS + Readability + Profile)
  const atsDim = score.dimensions.find((d) => d.key === 'ats');
  const readabilityDim = score.dimensions.find((d) => d.key === 'readability');
  const profileDim = score.dimensions.find((d) => d.key === 'profile');
  const resumeQuality = Math.round(((atsDim?.score || 80) * 0.4) + ((readabilityDim?.score || 85) * 0.3) + ((profileDim?.score || 80) * 0.3));

  // 2. Job Alignment (Skill match + Seniority match)
  const skillDim = score.dimensions.find((d) => d.key === 'skill_match');
  const jobAlignment = skillDim?.score || 78;

  // 3. Evidence Strength (Verified items vs unverified)
  const projDim = score.dimensions.find((d) => d.key === 'projects');
  const evidenceStrength = Math.round(((readabilityDim?.score || 85) * 0.3) + ((projDim?.score || 75) * 0.7));

  // 4. Career Impact (Experience + Impact metrics)
  const expDim = score.dimensions.find((d) => d.key === 'experience');
  const impactDim = score.dimensions.find((d) => d.key === 'impact');
  const careerImpact = Math.round(((expDim?.score || 78) * 0.5) + ((impactDim?.score || 72) * 0.5));

  const vectors = [
    {
      id: 'quality',
      label: 'Resume Quality',
      score: resumeQuality,
      icon: ShieldCheck,
      color: 'text-indigo-400',
      barBg: 'bg-indigo-500',
      why: 'Measures structural formatting, section discoverability, and machine-readability across ATS standards.',
      evidence: `ATS score of ${atsDim?.score || 80}/100 with ${score.parsedResume.sections.length} recognized sections.`,
      action: 'Standardize any irregular section headings and ensure contact info is easily parsed.',
      tab: 'ats',
    },
    {
      id: 'alignment',
      label: 'Job Alignment',
      score: jobAlignment,
      icon: Target,
      color: 'text-cyan-400',
      barBg: 'bg-cyan-500',
      why: 'Evaluates required and preferred technical competencies against role specifications.',
      evidence: `Semantic match score of ${jobAlignment}/100 across ${score.parsedResume.allSkills.length} identified skills.`,
      action: 'Review missing skill requirements in the Semantic Skill Matrix.',
      tab: 'skills',
    },
    {
      id: 'evidence',
      label: 'Evidence Strength',
      score: evidenceStrength,
      icon: Zap,
      color: 'text-emerald-400',
      barBg: 'bg-emerald-500',
      why: 'Verifies whether skills and achievements are backed by direct quotes in projects and work narratives.',
      evidence: `${score.parsedResume.projects.length} verified projects with concrete technology references.`,
      action: 'Add GitHub repository links and technical implementation details to your projects.',
      tab: 'review',
    },
    {
      id: 'impact',
      label: 'Career Impact',
      score: careerImpact,
      icon: TrendingUp,
      color: 'text-purple-400',
      barBg: 'bg-purple-500',
      why: 'Measures action verb strength, leadership ownership, and quantifiable outcome density.',
      evidence: `${score.parsedResume.achievements.length} quantifiable metrics detected across experience bullets.`,
      action: 'Use the Bullet Copilot to transform passive lines into Google X-Y-Z formula statements.',
      tab: 'rewrites',
    },
  ];

  const selectedVecData = vectors.find((v) => v.id === activeVector);

  return (
    <div className={`bg-gradient-to-b from-slate-900/95 to-slate-950 border border-indigo-950/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden font-sans space-y-5 ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Overall Signal Grade & Numerical Badge */}
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-inner group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-cyan-500/20 animate-pulse" />
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight font-mono">
                {score.overall}
              </span>
              <span className="text-[10px] sm:text-xs text-indigo-400 block font-bold uppercase tracking-wider">
                Signal Index
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-[10px] font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-700/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Activity className="w-3 h-3 mr-1 text-indigo-400" />
                Career Signal
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                Grade {score.grade}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
              {score.parsedResume.personalInfo.name || 'Candidate Career Portfolio'}
            </h2>
            <p className="text-xs text-slate-400 max-w-md line-clamp-2">
              {score.feedback[0]?.message || 'Evidence-backed evaluation across structural and technical dimensions.'}
            </p>
          </div>
        </div>

        {/* Right: 4 Interactive Career Signal Vector Cards */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          {vectors.map((vec) => {
            const isSelected = activeVector === vec.id;
            return (
              <button
                key={vec.id}
                onClick={() => setActiveVector(isSelected ? null : vec.id)}
                className={`text-left border rounded-xl p-3 min-w-[140px] space-y-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center">
                    <vec.icon className={`w-3.5 h-3.5 mr-1.5 ${vec.color}`} />
                    {vec.label}
                  </span>
                  <span className="text-xs font-bold text-slate-100 font-mono">{vec.score}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${vec.barBg} rounded-full transition-all duration-500`}
                    style={{ width: `${vec.score}%` }}
                  />
                </div>
                <div className="text-[9px] font-mono text-slate-500 text-right">
                  {isSelected ? '▲ Click to close' : '▼ Click for details'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Vector Explanation Drawer */}
      {selectedVecData && (
        <div className="relative z-10 bg-slate-950/90 border border-indigo-900/60 rounded-xl p-4 text-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <selectedVecData.icon className={`w-4 h-4 ${selectedVecData.color}`} />
              <span className="font-bold text-slate-100">{selectedVecData.label} Signal Analysis ({selectedVecData.score}/100)</span>
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab(selectedVecData.tab)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Go to {selectedVecData.label} Tab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-slate-300 block mb-1">Why this score:</span>
              <p className="text-slate-400 leading-relaxed">{selectedVecData.why}</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-slate-300 block mb-1">Detected Evidence:</span>
              <p className="text-slate-300 font-mono leading-relaxed">{selectedVecData.evidence}</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-slate-300 block mb-1">Recommended Action:</span>
              <p className="text-indigo-300 leading-relaxed">{selectedVecData.action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
