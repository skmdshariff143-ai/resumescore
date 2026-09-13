'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FileUpload } from '@/components/FileUpload';
import { ScoreCard } from '@/components/ScoreCard';
import { SkillMatrixView } from '@/components/analysis/SkillMatrixView';
import { ATSScoreCard } from '@/components/analysis/ATSScoreCard';
import { ResumeRewritePanel } from '@/components/analysis/ResumeRewritePanel';
import { ResumeReviewEditor } from '@/components/analysis/ResumeReviewEditor';
import { CoverLetterModal } from '@/components/analysis/CoverLetterModal';
import { CritiquePanel } from '@/components/analysis/CritiquePanel';
import { JobMatchInput } from '@/components/analysis/JobMatchInput';
import { ProcessingPipeline } from '@/components/ui/Skeleton';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { saveScanHistory } from '@/lib/storage/history-store';
import type { AnalysisMode, ResumeScore, SkillMatchItem, ResumeCritique } from '@/types';

type AnalyzeTab = 'overview' | 'skills' | 'ats' | 'rewrites' | 'review' | 'critique';
import { Target, Shield } from 'lucide-react';

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'job_match' ? 'job_match' : 'general';

  const [mode, setMode] = useState<AnalysisMode>(initialMode);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('resume.txt');
  const [jobText, setJobText] = useState<string>('');
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [critique, setCritique] = useState<ResumeCritique | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalyzeTab>('overview');
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);

  const steps = [
    { id: 'upload', label: '1. Ingestion' },
    { id: 'analyze', label: '2. Analysis' },
    { id: 'match', label: '3. Skill Matrix' },
    { id: 'improve', label: '4. Optimization' },
  ];

  const currentStepIndex = score ? 3 : loading ? 1 : 0;

  const runAnalysis = async (text: string, fileName: string, targetJobText: string = jobText, targetMode: AnalysisMode = mode) => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          jobText: targetJobText,
          mode: targetMode,
          fileName,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setScore(data.data);

        // Fetch qualitative critique asynchronously
        fetch('/api/ai/critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume: data.data.parsedResume,
            job: data.data.parsedJob,
          }),
        })
          .then((cRes) => cRes.json())
          .then((cData) => {
            if (cData.success && cData.data) {
              setCritique(cData.data);
            }
          })
          .catch((cErr) => console.warn('Critique fetch error:', cErr));
        saveScanHistory({
          id: data.data.id,
          fileName,
          overallScore: data.data.overall,
          grade: data.data.grade,
          topPriority: data.data.topPriority,
          atsScore: data.data.atsScore,
          jobMatchScore: data.data.skillMatchScore,
          mode: targetMode,
          jobTitle: data.data.parsedJob?.title,
          company: data.data.parsedJob?.company,
          analyzedAt: data.data.analyzedAt,
          dimensions: data.data.dimensions,
          topActions: data.data.topActions,
          skillGapsCount: data.data.skillMatrix ? (Object.values(data.data.skillMatrix).flat() as SkillMatchItem[]).filter((s) => s.status === 'missing').length : 0,
          resumePreview: data.data.resumePreview,
          resumeText: text,
        });
      }
    } catch (err) {
      console.error('Failed to run analysis', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtracted = (text: string, fileName: string) => {
    setResumeText(text);
    setCurrentFileName(fileName);
    runAnalysis(text, fileName);
  };

  const handleJobSubmit = (targetJobText: string) => {
    setJobText(targetJobText);
    setMode('job_match');
    if (resumeText) {
      runAnalysis(resumeText, currentFileName, targetJobText, 'job_match');
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Step Indicator Header */}
      <StepIndicator steps={steps} currentStepIndex={currentStepIndex} />

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-white/[0.08] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setMode('general');
              if (resumeText) runAnalysis(resumeText, currentFileName, '', 'general');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'general'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            General Resume Review
          </button>
          <button
            onClick={() => setMode('job_match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              mode === 'job_match'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5 mr-1.5" />
            Target Job Match Mode
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center">
          <Shield className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
          Deterministic 7-Pillar Evidence Engine
        </div>
      </div>

      {/* Ingestion Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={mode === 'job_match' ? 'lg:col-span-6' : 'lg:col-span-12'}>
          <FileUpload onTextExtracted={handleTextExtracted} isLoading={loading} />
        </div>

        {mode === 'job_match' && (
          <div className="lg:col-span-6">
            <JobMatchInput onJobSubmit={handleJobSubmit} isLoading={loading} />
          </div>
        )}
      </div>

      {/* Processing Pipeline Skeleton */}
      {loading && (
        <div className="py-12">
          <ProcessingPipeline currentStage={3} />
        </div>
      )}

      {/* Results Workspace */}
      {score && !loading && (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-white/[0.08] pb-2 space-x-2 overflow-x-auto">
            {[
              { key: 'overview', label: 'Career Signal & Overview' },
              { key: 'skills', label: 'Semantic Skill Matrix' },
              { key: 'ats', label: 'ATS Compliance Audit' },
              { key: 'rewrites', label: 'Bullet Copilot' },
              { key: 'critique', label: critique?.isLLMGenerated ? 'AI Qualitative Critique' : 'Qualitative Critique' },
              { key: 'review', label: 'Structured Review' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as AnalyzeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <ScoreCard
              score={score}
              onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
              onNavigateToTab={(t) => setActiveTab(t as AnalyzeTab)}
            />
          )}

          {activeTab === 'skills' && (
            <SkillMatrixView matrix={score.skillMatrix} />
          )}

          {activeTab === 'ats' && (
            <ATSScoreCard analysis={score.atsAnalysis} />
          )}

          {activeTab === 'rewrites' && (
            <ResumeRewritePanel bulletAnalyses={score.bulletAnalyses} />
          )}

          {activeTab === 'critique' && (
            critique ? (
              <CritiquePanel critique={critique} onNavigateToTab={(t) => setActiveTab(t as AnalyzeTab)} />
            ) : (
              <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <p>Generating qualitative narrative critique...</p>
              </div>
            )
          )}

          {activeTab === 'review' && (
            <ResumeReviewEditor resume={score.parsedResume} />
          )}
        </div>
      )}

      {score && (
        <CoverLetterModal
          isOpen={isCoverLetterOpen}
          onClose={() => setIsCoverLetterOpen(false)}
          resume={score.parsedResume}
          job={score.parsedJob}
        />
      )}
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E] p-8 text-center text-xs text-slate-500">Loading Workspace...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
