'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Shield } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { JobMatchInput } from '@/components/analysis/JobMatchInput';
import { CAREER_LEVELS, type CareerLevel } from '@/lib/scoring/rubric';
import type { PDFExtractionResult } from '@/lib/parsing/pdf-extractor';
import type { ResumeScore } from '@/types';

const TailorFlow = dynamic(() => import('@/components/tailor/TailorFlow').then(mod => mod.TailorFlow), {
  loading: () => <p role="status">Loading tailoring tools…</p>,
});

const MIN_RESUME = 30;
const MIN_JOB = 20;

function errorMessage(error: unknown): string {
  if (error instanceof Error && /chunk/i.test(error.message)) return 'Tailoring code could not finish loading. Check your connection and retry; your text is retained.';
  return error instanceof Error ? error.message : 'Tailoring failed. Please try again.';
}

export default function TailorPage() {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resume.txt');
  const [extraction, setExtraction] = useState<PDFExtractionResult>();
  const [jobText, setJobText] = useState('');
  const [careerLevel, setCareerLevel] = useState<CareerLevel>('experienced');
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (score) resultsHeading.current?.focus(); }, [score]);

  async function start(text: string, diagnostics = extraction) {
    if (loading) return;
    setLoading(true); setError('');
    try {
      if (jobText.trim().length < MIN_JOB) throw new Error('Paste a job description first.');
      if (text.trim().length < MIN_RESUME) throw new Error('Add your resume text first.');
      const { analyzeLocally } = await import('@/lib/scoring/local-analysis');
      const result = await analyzeLocally({ text, fileName, jobText, mode: 'job_match', careerLevel, extraction: diagnostics });
      setResumeText(text); setScore(result);
    } catch (caught) { setError(errorMessage(caught)); } finally { setLoading(false); }
  }

  const ready = (resumeText?.trim().length ?? 0) >= MIN_RESUME && jobText.trim().length >= MIN_JOB;

  return (
    <div className="page-shell space-y-7">
      <div className="space-y-2">
        <p className="eyebrow">Tailor to a job</p>
        <h1 className="text-3xl font-bold tracking-tight">Tailor your resume to a job.</h1>
        <p className="text-muted">See what the job asks for, review edits your resume already supports, and export a tailored version. Skills you have not shown are never added for you.</p>
        <p className="text-xs text-muted flex items-center"><Shield className="w-3.5 h-3.5 text-brand mr-1.5" aria-hidden="true" />Runs in your browser. Nothing is uploaded or saved.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <FileUpload isLoading={loading} onTextExtracted={(text, name, diagnostics) => {
            setScore(null); setResumeText(text); setFileName(name); setExtraction(diagnostics);
          }} />
        </div>
        <div className="lg:col-span-6">
          <JobMatchInput initialText={jobText} isLoading={loading}
            onJobSubmit={text => { setScore(null); setJobText(text); }}
            onJobChange={text => { setScore(null); setJobText(text); }} />
        </div>
      </div>

      {resumeText !== null && (
        <section className="panel space-y-4" aria-label="Review your resume text">
          <h2 className="text-xl font-semibold">Review your resume text</h2>
          <p className="text-sm text-body">Correct missing text or reading order first. Scores are heuristic estimates, not hiring predictions or ATS certification.</p>
          <label className="block" htmlFor="tailor-resume">Extracted resume text</label>
          <textarea id="tailor-resume" value={resumeText} maxLength={60000} rows={10} className="w-full rounded-lg bg-surface border border-line p-3"
            onChange={event => { setScore(null); setResumeText(event.target.value); }} />
          <label className="block" htmlFor="tailor-career-level">Career level</label>
          <select id="tailor-career-level" value={careerLevel} className="rounded-lg border border-line bg-surface p-3"
            onChange={event => { setScore(null); setCareerLevel(event.target.value as CareerLevel); }}>
            {Object.entries(CAREER_LEVELS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select>
          {!jobText.trim() && <p className="text-sm text-body">Paste the job description above to continue.</p>}
          <button className="action action-primary" disabled={!ready || loading} aria-busy={loading} onClick={() => start(resumeText)}>
            {loading ? 'Finding keywords…' : 'Find keywords'}
          </button>
        </section>
      )}

      {error && <p role="alert" className="rounded-lg border border-red-400 p-4 text-danger">{error}</p>}

      {score && !loading && (
        <div className="space-y-4">
          <h2 ref={resultsHeading} tabIndex={-1} className="text-2xl font-semibold scroll-mt-24">Your tailoring workspace</h2>
          <TailorFlow key={score.id} resumeText={score.parsedResume.rawText} score={score}
            onReanalyze={text => { setExtraction(undefined); start(text, undefined); }} />
        </div>
      )}
    </div>
  );
}
