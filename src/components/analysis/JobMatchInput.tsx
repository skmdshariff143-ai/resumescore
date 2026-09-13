'use client';

import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { Button } from '../ui/Button';

interface JobMatchInputProps {
  onJobSubmit: (jobText: string) => void;
  isLoading?: boolean;
}

export function JobMatchInput({ onJobSubmit, isLoading }: JobMatchInputProps) {
  const [jobText, setJobText] = useState('');

  const samplePresets = [
    {
      title: 'Senior Backend Engineer',
      company: 'Fintech Scaleup',
      desc: 'Looking for a Senior Backend Engineer with 5+ years experience building high-throughput microservices in Go or Python. Required skills: PostgreSQL, Redis, Docker, Kubernetes, AWS. Preferred: Kafka, GraphQL, CI/CD.',
    },
    {
      title: 'Staff Full-Stack Architect',
      company: 'Enterprise SaaS',
      desc: 'Seeking a Staff Full-Stack Engineer. Required: React, Next.js, TypeScript, Node.js, REST APIs, Tailwind CSS. Must have experience with System Design, Team Mentorship, and Automated Testing (Jest/Playwright).',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              Target Job Description
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Match against real requirements</span>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap gap-2">
          <span className="text-[11px] text-slate-400 self-center">Presets:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setJobText(preset.desc)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          rows={6}
          placeholder="Paste job posting title, requirements, tech stack, and qualifications here..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
        />
      </div>

      <Button
        variant="signal"
        size="md"
        onClick={() => onJobSubmit(jobText)}
        disabled={jobText.trim().length < 20}
        isLoading={isLoading}
        icon={<Target className="w-4 h-4" />}
      >
        Evaluate Job Match Alignment
      </Button>
    </div>
  );
}
