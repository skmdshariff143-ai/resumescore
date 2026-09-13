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
      <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 text-center space-y-2 font-sans">
        <Target className="w-6 h-6 text-indigo-400 mx-auto opacity-60" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Saved Target Roles</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Save job target evaluations to track role-specific requirements and skill alignments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center">
          <Target className="w-4 h-4 mr-2 text-indigo-400" />
          Saved Job Targets ({jobs.length})
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">Role Alignment Archive</span>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="text-xs font-bold text-slate-200">{job.role}</div>
              <div className="text-[11px] text-slate-400">
                {job.company} • Saved {new Date(job.date).toLocaleDateString()}
              </div>
              {job.missingSkills.length > 0 && (
                <div className="text-[10px] text-rose-400 mt-1 font-mono">
                  Gaps: {job.missingSkills.slice(0, 3).join(', ')}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-800/40 font-mono">
                {job.matchScore}% Match
              </span>
              {onDeleteJob && (
                <button
                  onClick={() => onDeleteJob(job.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
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
