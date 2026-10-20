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
  const resumeQuality = score.generalQualityScore ?? score.overall;

  // 2. Job Alignment (Skill match + Seniority match)
  const skillDim = score.dimensions.find((d) => d.key === 'skill_match');
  const jobAlignment = skillDim?.score ?? 0;
  const matchAvailable = score.mode !== 'job_match' || Boolean(score.parsedJob &&
    score.parsedJob.requiredSkills.length + score.parsedJob.preferredSkills.length + score.parsedJob.bonusSkills.length);

  // 3. Evidence Strength (Verified items vs unverified)
  const projDim = score.dimensions.find((d) => d.key === 'projects');
  const evidenceStrength = Math.round(((readabilityDim?.score ?? 0) * 0.3) + ((projDim?.score ?? 0) * 0.7));

  // 4. Career Impact (Experience + Impact metrics)
  const expDim = score.dimensions.find((d) => d.key === 'experience');
  const impactDim = score.dimensions.find((d) => d.key === 'impact');
  const careerImpact = Math.round(((expDim?.score ?? 0) * 0.5) + ((impactDim?.score ?? 0) * 0.5));

  const vectors = [
    {
      id: 'quality',
      label: 'Resume Quality',
      score: resumeQuality,
      icon: ShieldCheck,
      color: 'text-brand',
      barBg: 'bg-blue-500',
      why: 'Uses the general resume-quality rubric, independently of the target job.',
      evidence: `Readability estimate of ${atsDim?.score ?? 0}/100 with ${score.parsedResume.sections.length} recognized sections.`,
      action: 'Standardize any irregular section headings and ensure contact info is easily parsed.',
      tab: 'ats',
    },
    {
      id: 'alignment',
      label: score.mode === 'job_match' ? 'Job Alignment' : 'Skill Evidence',
      score: matchAvailable ? jobAlignment : null,
      icon: Target,
      color: 'text-brand',
      barBg: 'bg-cyan-500',
      why: 'Uses detected skill terms and practical evidence. It does not verify proficiency or predict hiring.',
      evidence: matchAvailable ? `Evidence-weighted terminology score of ${jobAlignment}/100.` : 'No recognized job skill requirements; review the description manually.',
      action: 'Review missing skill requirements in the Semantic Skill Matrix.',
      tab: 'skills',
    },
    {
      id: 'evidence',
      label: 'Evidence Strength',
      score: evidenceStrength,
      icon: Zap,
      color: 'text-success',
      barBg: 'bg-emerald-500',
      why: 'Combines readability (30%) and project evidence (70%). This editorial summary is not independent verification.',
      evidence: `${score.parsedResume.projects.length} project entries detected in the supplied text.`,
      action: 'Describe your contribution and outcome in relevant projects, academic work or case studies.',
      tab: 'review',
    },
    {
      id: 'impact',
      label: 'Career Impact',
      score: careerImpact,
      icon: TrendingUp,
      color: 'text-warning',
      barBg: 'bg-amber-500',
      why: 'Measures action verb strength, leadership ownership, and quantifiable outcome density.',
      evidence: `${score.parsedResume.achievements.length} quantifiable metrics detected across experience bullets.`,
      action: 'Use the Bullet Copilot to transform passive lines into Google X-Y-Z formula statements.',
      tab: 'rewrites',
    },
  ];

  const selectedVecData = vectors.find((v) => v.id === activeVector);

  return (
    <div className={`bg-surface border border-line rounded-2xl p-6 sm:p-7 shadow-panel relative overflow-hidden font-sans space-y-6  ring-1 ring-white/[0.05] ${className}`}>
      {/* Background subtle ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Overall Signal Grade & Numerical Badge */}
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-surface border border-line shadow-inner group shrink-0">
            <div className="text-center relative z-10">
              <span className="text-3xl sm:text-4xl font-bold text-success tracking-tight font-sans leading-none block">
                {score.overall}
              </span>
              <span className="text-xs sm:text-xs text-muted block font-sans font-semibold uppercase tracking-wider mt-1">
                Signal Index
              </span>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-subtle border border-line text-xs font-sans font-bold text-success">
              {score.grade}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-xs font-sans font-bold text-body bg-surface border border-line px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Activity className="w-3 h-3 mr-1 text-brand" />
                Career Signal
              </span>
              <span className="text-xs font-sans font-semibold text-success bg-subtle px-2.5 py-0.5 rounded-full border border-line">
                Grade {score.grade}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-ink tracking-tight">
              {score.parsedResume.personalInfo.name || 'Candidate Career Portfolio'}
            </h2>
            <p className="text-xs text-muted max-w-md line-clamp-2 leading-relaxed">
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
                className={`text-left border rounded-xl p-3 min-w-[145px] space-y-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface border-blue-500 shadow-panel '
                    : 'bg-surface border-line hover:border-line'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-body flex items-center">
                    <vec.icon className={`w-3.5 h-3.5 mr-1.5 ${vec.color}`} />
                    {vec.label}
                  </span>
                  <span className="text-xs font-bold text-ink font-sans">{vec.score ?? 'N/A'}</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${vec.barBg} rounded-full transition-all duration-500`}
                    style={{ width: `${vec.score ?? 0}%` }}
                  />
                </div>
                <div className="text-xs font-sans text-muted text-right">
                  {isSelected ? '▲ Close details' : '▼ View details'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Vector Explanation Drawer */}
      {selectedVecData && (
        <div className="relative z-10 bg-surface border border-line rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div className="flex items-center space-x-2">
              <selectedVecData.icon className={`w-4 h-4 ${selectedVecData.color}`} />
              <span className="font-bold text-ink">{selectedVecData.label} Signal Analysis ({selectedVecData.score === null ? 'unavailable' : `${selectedVecData.score}/100`})</span>
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab(selectedVecData.tab)}
                className="text-xs font-bold text-brand hover:text-brand flex items-center gap-1 cursor-pointer"
              >
                <span>Go to {selectedVecData.label} Tab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-surface p-3 rounded-lg border border-line">
              <span className="font-semibold text-body block mb-1">Why this score:</span>
              <p className="text-muted leading-relaxed">{selectedVecData.why}</p>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-line">
              <span className="font-semibold text-body block mb-1">Detected Evidence:</span>
              <p className="text-body font-sans leading-relaxed">{selectedVecData.evidence}</p>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-line">
              <span className="font-semibold text-body block mb-1">Recommended Action:</span>
              <p className="text-brand leading-relaxed">{selectedVecData.action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
