'use client';

import React, { useState } from 'react';
import type { SkillMatrix, SkillMatchItem, SkillMatchStatus } from '@/types';
import { EvidenceRow } from '../ui/EvidenceRow';
import { CheckCircle2, AlertCircle, XCircle, Search } from 'lucide-react';

interface SkillMatrixViewProps {
  matrix?: SkillMatrix;
}

export function SkillMatrixView({ matrix }: SkillMatrixViewProps) {
  const [filterStatus, setFilterStatus] = useState<SkillMatchStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!matrix) {
    return (
      <div className="bg-surface border border-line rounded-2xl p-8 text-center text-muted text-xs">
        Add a target job description to compare recognized skill requirements.
      </div>
    );
  }

  const allItems: SkillMatchItem[] = Object.values(matrix).flat();

  const counts = {
    all: allItems.length,
    matched: allItems.filter((i) => i.status === 'matched').length,
    partial: allItems.filter((i) => i.status === 'partial').length,
    missing: allItems.filter((i) => i.status === 'missing').length,
  };

  const filteredItems = allItems.filter((item) => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.skill.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-6 font-sans">
      {/* Header & Match Status Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h3 className="text-sm font-bold text-ink">
            Skills and supporting evidence
          </h3>
          <p className="text-xs text-muted mt-0.5">
            See which requirements are demonstrated, mentioned, related or missing in your text.
          </p>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-brand text-white shadow-sm'
                : 'bg-surface text-muted hover:text-ink'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilterStatus('matched')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterStatus === 'matched'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-subtle text-success border border-line'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Matched ({counts.matched})
          </button>
          <button
            onClick={() => setFilterStatus('partial')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterStatus === 'partial'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-subtle text-warning border border-line'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Partial ({counts.partial})
          </button>
          <button
            onClick={() => setFilterStatus('missing')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterStatus === 'missing'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-subtle text-danger border border-line'
            }`}
          >
            <XCircle className="w-3 h-3" />
            Missing ({counts.missing})
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted" />
        <input
          type="text"
          aria-label="Filter skills or requirements"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter skills or requirements..."
          className="w-full bg-surface border border-line rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:border-indigo-500 font-sans"
        />
      </div>

      {/* Evidence Rows Stream */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            No matching skills found for the selected filter.
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <EvidenceRow key={idx} match={item} />
          ))
        )}
      </div>
    </div>
  );
}
