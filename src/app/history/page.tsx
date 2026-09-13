'use client';

import React, { useState } from 'react';
import { VersionComparison } from '@/components/dashboard/VersionComparison';
import { JobMatchesTracker } from '@/components/dashboard/JobMatchesTracker';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  getScanHistory,
  getSavedJobs,
  deleteScanHistory,
  deleteSavedJob,
  clearAllLocalData,
  exportAllDataAsJSON,
} from '@/lib/storage/history-store';
import type { SavedJobMatch, ScanHistory } from '@/types';
import {
  Download,
  Trash2,
  Activity,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistory[]>(() => {
    if (typeof window !== 'undefined') return getScanHistory();
    return [];
  });
  const [savedJobs, setSavedJobs] = useState<SavedJobMatch[]>(() => {
    if (typeof window !== 'undefined') return getSavedJobs();
    return [];
  });

  const handleDeleteScan = (id: string) => {
    deleteScanHistory(id);
    setHistory(getScanHistory());
  };

  const handleDeleteJob = (id: string) => {
    deleteSavedJob(id);
    setSavedJobs(getSavedJobs());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all stored resumes and saved jobs?')) {
      clearAllLocalData();
      setHistory([]);
      setSavedJobs([]);
    }
  };

  const handleExportJSON = () => {
    const json = exportAllDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResumeScore_Data_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const scoreDelta =
    history.length >= 2
      ? history[0].overallScore - history[history.length - 1].overallScore
      : 0;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-400" />
            Career Command Center & Timeline History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track iteration trajectory, score deltas, and saved job requirements.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJSON}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Backup
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Data
          </Button>
        </div>
      </div>

      {/* Trajectory Banner */}
      {history.length >= 2 && (
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-700/40 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                Career Trajectory
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {scoreDelta >= 0 ? `+${scoreDelta} pts improvement` : `${scoreDelta} pts delta`}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">
              Your resume performance improved across {history.length} iterations.
            </h3>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs text-slate-300">
            <span className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Initial: {history[history.length - 1].overallScore}
            </span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
            <span className="bg-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-800 font-bold text-emerald-400">
              Latest: {history[0].overallScore}
            </span>
          </div>
        </div>
      )}

      {/* Version Comparison Component */}
      <VersionComparison history={history} />

      {/* Saved Jobs Tracker */}
      <JobMatchesTracker jobs={savedJobs} onDeleteJob={handleDeleteJob} />

      {/* History Log */}
      <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100">All Past Resume Scans ({history.length})</h3>
        {history.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No Resume Scans Found"
            description="Upload and analyze your resume to begin tracking your career signal progress."
            actionLabel="Start First Analysis"
            onAction={() => window.location.href = '/analyze'}
          />
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{item.fileName}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(item.analyzedAt).toLocaleString()} • {item.mode === 'job_match' ? 'Job Match Mode' : 'General Review'}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-mono">
                    Score: {item.overallScore}/100 ({item.grade})
                  </span>
                  <button
                    onClick={() => handleDeleteScan(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
