'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
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

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function HistoryPage() {
  const router = useRouter();
  // Browser storage is unavailable during prerendering. Keep the hydration render
  // identical to the server before showing the locally initialized history.
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const scoreDelta =
    history.length >= 2
      ? history[0].overallScore - history[history.length - 1].overallScore
      : 0;

  if (!hydrated) {
    return <div role="status" className="max-w-7xl mx-auto px-4 py-8 text-body">Loading saved history…</div>;
  }

  return (
    <div className="page-shell space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center">
            <Activity className="w-5 h-5 mr-2 text-brand" />
            Your saved work
          </h1>
          <p className="text-sm text-muted mt-0.5 [overflow-wrap:anywhere]">
            Revisit analyses you chose to save on this browser. Export or delete them at any time.
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
        <div className="bg-surface border border-line rounded-2xl p-5 shadow-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-brand bg-brand-soft px-2 py-0.5 rounded border border-line">
                Career Trajectory
              </span>
              <span className="text-xs font-sans font-bold text-success">
                {scoreDelta >= 0 ? `+${scoreDelta} pts change` : `${scoreDelta} pts delta`}
              </span>
            </div>
            <h3 className="text-sm font-bold text-ink">
              Compare your {history.length} saved analyses. Different jobs and career profiles may use different rubrics.
            </h3>
          </div>

          <div className="flex items-center space-x-3 font-sans text-xs text-body">
            <span className="bg-surface px-3 py-1.5 rounded-lg border border-line">
              Initial: {history[history.length - 1].overallScore}
            </span>
            <ArrowRight className="w-4 h-4 text-brand" />
            <span className="bg-brand-soft px-3 py-1.5 rounded-lg border border-line font-bold text-success">
              Latest: {history[0].overallScore}
            </span>
          </div>
        </div>
      )}

      {/* Version Comparison Component */}
      {history.length >= 2 && <VersionComparison history={history} />}

      {/* Saved Jobs Tracker */}
      {savedJobs.length > 0 && <JobMatchesTracker jobs={savedJobs} onDeleteJob={handleDeleteJob} />}

      {/* History Log */}
      <div className="bg-surface border border-line rounded-2xl p-6 shadow-panel space-y-4">
        <h3 className="text-sm font-bold text-ink">All Past Resume Scans ({history.length})</h3>
        {history.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No Resume Scans Found"
            description="Nothing is saved automatically. Analyze a resume and enable optional history to keep it on this browser."
            actionLabel="Start First Analysis"
            onAction={() => router.push('/analyze')}
          />
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-line rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink [overflow-wrap:anywhere]">{item.fileName}</div>
                  <div className="text-xs text-muted">
                    {new Date(item.analyzedAt).toLocaleString()} • {item.mode === 'job_match' ? 'Job Match Mode' : 'General Review'}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {item.resumeText && <button className="border border-line rounded px-3 py-2 text-sm" onClick={() => router.push(`/analyze?history=${encodeURIComponent(item.id)}`)}>Reopen</button>}
                  <span className="text-xs font-bold text-success bg-subtle px-2.5 py-1 rounded-lg border border-line font-sans">
                    Score: {item.overallScore}/100 ({item.grade})
                  </span>
                  <button
                    aria-label={`Delete ${item.fileName} analysis`}
                    onClick={() => handleDeleteScan(item.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-subtle transition-colors cursor-pointer"
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
