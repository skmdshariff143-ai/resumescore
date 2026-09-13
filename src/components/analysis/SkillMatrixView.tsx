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
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        No skill requirements detected. Add a target job description to view the semantic matrix.
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
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6 font-sans">
      {/* Header & Match Status Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            6-Layer Semantic Skill & Requirement Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluates exact keywords, canonical aliases, and taxonomy relationships.
          </p>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilterStatus('matched')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filterStatus === 'matched'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
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
                : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
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
                : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
            }`}
          >
            <XCircle className="w-3 h-3" />
            Missing ({counts.missing})
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter skills or requirements..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Evidence Rows Stream */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
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
