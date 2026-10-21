'use client';

import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { Button } from '../ui/Button';

interface JobMatchInputProps {
  onJobSubmit: (jobText: string) => void;
  isLoading?: boolean;
  onJobChange?: (text: string) => void;
  initialText?: string;
}

export function JobMatchInput({ onJobSubmit, isLoading, onJobChange, initialText = '' }: JobMatchInputProps) {
  const [jobText, setJobText] = useState(initialText);

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
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-4 font-sans h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center justify-between border-b border-line pb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-brand" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Target Job Description
            </h3>
          </div>
          <span className="text-xs text-muted">Match against real requirements</span>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted self-center">Fictional examples:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              disabled={isLoading} onClick={() => { setJobText(preset.desc); onJobChange?.(preset.desc); }}
              className="px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-line text-xs text-body  cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        <textarea
          aria-label="Target job description"
          maxLength={60000}
          value={jobText}
          disabled={isLoading} onChange={(e) => { setJobText(e.target.value); onJobChange?.(e.target.value); }}
          rows={6}
          placeholder="Paste job posting title, requirements, tech stack, and qualifications here..."
          className="w-full bg-surface border border-line rounded-xl p-3 text-xs text-ink placeholder-muted focus:border-cyan-500 focus:outline-none font-sans"
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
        Use this job description
      </Button>
    </div>
  );
}
