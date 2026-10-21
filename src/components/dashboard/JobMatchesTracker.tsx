'use client';

import React from 'react';
import { Target, Trash2 } from 'lucide-react';
import type { SavedJobMatch } from '@/types';

interface JobMatchesTrackerProps {
  jobs: SavedJobMatch[];
  onDeleteJob?: (id: string) => void;
}

export function JobMatchesTracker({ jobs, onDeleteJob }: JobMatchesTrackerProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-6 text-center space-y-2 font-sans">
        <Target className="w-6 h-6 text-brand mx-auto opacity-60" />
        <h3 className="text-sm font-semibold text-ink [overflow-wrap:anywhere] uppercase tracking-wider">Saved Target Roles</h3>
        <p className="text-xs text-muted max-w-sm mx-auto">
          Save job target evaluations to track role-specific requirements and skill alignments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center">
          <Target className="w-4 h-4 mr-2 text-brand" />
          Saved Job Targets ({jobs.length})
        </h3>
        <span className="text-xs text-muted font-sans">Role Alignment Archive</span>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-surface border border-line rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="text-sm font-semibold text-ink [overflow-wrap:anywhere]">{job.role}</div>
              <div className="text-xs text-muted">
                {job.company} • Saved {new Date(job.date).toLocaleDateString()}
              </div>
              {job.missingSkills.length > 0 && (
                <div className="text-xs text-danger mt-1 font-sans">
                  Gaps: {job.missingSkills.slice(0, 3).join(', ')}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-brand bg-brand-soft px-2.5 py-1 rounded-lg border border-line font-sans">
                {job.matchScore}% Match
              </span>
              {onDeleteJob && (
                <button
                  aria-label={`Delete saved job ${job.role}`}
                  onClick={() => onDeleteJob(job.id)}
                  className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-subtle  cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
