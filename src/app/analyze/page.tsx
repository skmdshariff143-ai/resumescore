'use client';

import React, { useState, useEffect, startTransition, Suspense } from 'react';
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
import { getScanHistory, saveScanHistory } from '@/lib/storage/history-store';
import type { AnalysisMode, ResumeScore, SkillMatchItem, ResumeCritique } from '@/types';

type AnalyzeTab = 'overview' | 'skills' | 'ats' | 'rewrites' | 'review' | 'critique';
import { Target, Shield } from 'lucide-react';
import { CAREER_LEVELS, type CareerLevel } from '@/lib/scoring/rubric';
import { ResumeWorkspace } from '@/components/analysis/ResumeWorkspace';
import type { PDFExtractionResult } from '@/lib/parsing/pdf-extractor';

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
  const [saveHistory, setSaveHistory] = useState(false);
  const [aiConsent, setAIConsent] = useState(false);
  const [error, setError] = useState('');
  const [careerLevel, setCareerLevel] = useState<CareerLevel>('experienced');
  const [localOnly, setLocalOnly] = useState(true);
  const [critiqueStatus, setCritiqueStatus] = useState('');
  const [extraction, setExtraction] = useState<PDFExtractionResult>();
  const [activeTab, setActiveTab] = useState<AnalyzeTab>('overview');
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState(false);
  const savedId = searchParams.get('history');
  useEffect(() => {
    if (!savedId) return;
    const saved = getScanHistory().find(item => item.id === savedId);
    if (saved?.resumeText) startTransition(() => {
      setResumeText(saved.resumeText!);
      setCurrentFileName(saved.fileName);
      setScore(null);
    });
  }, [savedId]);

  const steps = [
    { id: 'upload', label: '1. Ingestion' },
    { id: 'analyze', label: '2. Analysis' },
    { id: 'match', label: '3. Skill Matrix' },
    { id: 'improve', label: '4. Optimization' },
  ];

  const currentStepIndex = score ? 3 : loading ? 1 : 0;

  const runAnalysis = async (text: string, fileName: string, targetJobText: string = jobText, targetMode: AnalysisMode = mode) => {
    setLoading(true);
    setError('');
    setCritique(null);
    setCritiqueStatus(localOnly ? 'Qualitative critique is unavailable in browser-only mode. Deterministic feedback is available in Overview.' : 'Generating critique...');
    try {
      if (targetMode === 'job_match' && targetJobText.trim().length < 20) throw new Error('Paste a job description first.');
      let data: { success: boolean; data?: ResumeScore; error?: string };
      if (localOnly) {
        const [{ parseResume }, { parseJobDescription }, { calculateResumeScore }] = await Promise.all([
          import('@/lib/parsing/resume-parser'), import('@/lib/jobs/job-parser'), import('@/lib/scoring/scoring-engine'),
        ]);
        const parsed = parseResume(text, fileName);
        if (extraction) Object.assign(parsed.metadata, {
          pageCountEstimate: extraction.pageCount, extractionQuality: extraction.extractionQuality,
          hasTwoColumns: extraction.diagnostics.twoColumnDetected, isScanned: extraction.isScanned,
        });
        data = { success: true, data: calculateResumeScore(parsed,
          targetMode === 'job_match' ? parseJobDescription(targetJobText) : undefined, targetMode, careerLevel) };
      } else {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        signal: AbortSignal.timeout(30_000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: text,
          jobText: targetJobText,
          mode: targetMode,
          fileName,
          careerLevel,
          extraction: extraction ? {
            pageCountEstimate: extraction.pageCount, extractionQuality: extraction.extractionQuality,
            hasTwoColumns: extraction.diagnostics.twoColumnDetected, isScanned: extraction.isScanned,
          } : undefined,
        }),
      });

      data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Analysis failed. Please try again.');
      }
      if (data.success && data.data) {
        setScore(data.data);

        // Fetch qualitative critique asynchronously
        if (!localOnly) fetch('/api/ai/critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-ai-consent': String(aiConsent) },
          body: JSON.stringify({
            resume: data.data.parsedResume,
            job: data.data.parsedJob,
          }),
        })
          .then((cRes) => cRes.json())
          .then((cData) => {
            if (cData.success && cData.data) {
              setCritique(cData.data);
            } else setCritiqueStatus('Critique unavailable. Deterministic results are still available.');
          })
          .catch(() => setCritiqueStatus('Critique unavailable. Deterministic results are still available.'));
        if (saveHistory) saveScanHistory({
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
      setError(err instanceof Error && /chunk/i.test(err.message)
        ? 'Analysis code could not finish loading. Check your connection and retry; your text is retained.'
        : err instanceof Error && err.name === 'TimeoutError'
        ? 'Analysis timed out. Your text is retained; retry or use browser-only analysis.'
        : err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtracted = (text: string, fileName: string, diagnostics?: PDFExtractionResult) => {
    setResumeText(text);
    setCurrentFileName(fileName);
    setExtraction(diagnostics);
    setScore(null);
  };

  const handleJobSubmit = (targetJobText: string) => {
    setJobText(targetJobText);
    setMode('job_match');
    setScore(null);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Step Indicator Header */}
      <StepIndicator steps={steps} currentStepIndex={currentStepIndex} />

      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setMode('general');
              setScore(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'general'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
            }`}
          >
            General Resume Review
          </button>
          <button
            onClick={() => setMode('job_match')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer ${
              mode === 'job_match'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 mr-1.5" />
            Target Job Match Mode
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center">
          <Shield className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
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
      {resumeText !== null && !loading && (
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4" aria-label="Review extracted text and privacy choices">
          <h2 className="text-xl font-semibold">Review your extracted resume</h2>
          <p className="text-sm text-slate-300">Correct missing text or reading order before analysis. Browser-only scoring keeps this text on this device; server mode sends it to ResumeScore. Scores are heuristic estimates, not hiring predictions or ATS certification.</p>
          <p className="text-sm text-slate-300">Paid external AI is disabled in this release. Browser analysis stays on this device; optional server feedback uses deterministic heuristics.</p>
          <label className="block" htmlFor="extracted-resume">Extracted resume text</label>
          <textarea id="extracted-resume" value={resumeText} maxLength={60000} onChange={event => setResumeText(event.target.value)} rows={12} className="w-full rounded-lg bg-slate-950 border border-slate-600 p-3" />
          <label className="block" htmlFor="career-level">Career level</label>
          <select id="career-level" value={careerLevel} onChange={event => setCareerLevel(event.target.value as CareerLevel)} className="rounded-lg border border-slate-600 bg-slate-950 p-3">
            {Object.entries(CAREER_LEVELS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select>
          <label className="flex gap-3 items-start"><input type="checkbox" checked={localOnly} onChange={event => { setLocalOnly(event.target.checked); setAIConsent(false); }} />Browser-only deterministic analysis (no resume or job text is sent to a server).</label>
          <label className="flex gap-3 items-start"><input type="checkbox" checked={saveHistory} onChange={event => setSaveHistory(event.target.checked)} />Save this analysis and resume text on this browser until I delete it in History.</label>
          {!localOnly && <label className="flex gap-3 items-start"><input type="checkbox" disabled checked={aiConsent} onChange={event => setAIConsent(event.target.checked)} />External AI processing is unavailable in this release.</label>}
          <button disabled={resumeText.trim().length < 30} onClick={() => runAnalysis(resumeText, currentFileName)} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold disabled:opacity-50">Analyze reviewed text</button>
        </section>
      )}
      {error && <p role="alert" className="rounded-lg border border-red-400 p-4 text-red-200">{error}</p>}
      {loading && (
        <div className="py-12">
          <ProcessingPipeline currentStage={3} />
        </div>
      )}

      {/* Results Workspace */}
      {score && !loading && (
        <div className="space-y-6">
          <p className="rounded-lg border border-slate-700 p-4">
            General resume quality: <strong>{score.generalQualityScore ?? score.overall}/100</strong>.
            {score.mode === 'job_match' && <> Job terminology alignment: <strong>{Object.values(score.skillMatrix ?? {}).flat().length ? `${score.skillMatchScore}/100` : 'Unavailable: no recognized job skills'}</strong>.</>}
            {' '}Editorial rubric for {CAREER_LEVELS[score.careerLevel ?? 'experienced']}. Evidence is inferred from text and is not independently verified.
          </p>
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 pb-2 space-x-2 overflow-x-auto">
            {[
              { key: 'overview', label: 'Career Signal & Overview' },
              { key: 'skills', label: 'Semantic Skill Matrix' },
              { key: 'ats', label: 'ATS Readability Estimate' },
              { key: 'rewrites', label: 'Bullet Copilot' },
              { key: 'critique', label: critique?.isLLMGenerated ? 'AI Qualitative Critique' : 'Qualitative Critique' },
              { key: 'review', label: 'Edit & Export Resume' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as AnalyzeTab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
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
                <p role="status">{critiqueStatus}</p>
              </div>
            )
          )}

            <div hidden={activeTab !== 'review'} className="space-y-6">
              <ResumeWorkspace key={score.id} original={score.parsedResume.rawText} analysis={score} onAnalyze={text => { setResumeText(text); runAnalysis(text, currentFileName); }} />
              <ResumeReviewEditor resume={score.parsedResume} />
            </div>
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
