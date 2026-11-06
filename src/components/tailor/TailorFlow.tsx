'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { resumeBlocksToText, splitResumeBlocks } from '@/lib/export/resume-document';
import {
  acceptedSuggestions, analyzeKeywords, applySuggestions, buildTailoringSuggestions,
  initialReviewState, reviewReducer, scoreTailoring,
} from '@/lib/tailoring';
import { sectionKind } from '@/lib/tailoring/suggestions';
import type { ResumeScore } from '@/types';
import { KeywordsStep } from './KeywordsStep';
import { OptimizeStep } from './OptimizeStep';
import { ApplyStep } from './ApplyStep';

const SECTION_ORDER = ['experience', 'projects', 'other'];

const STEPS = [
  { id: 'identify', label: 'Identify keywords' },
  { id: 'optimize', label: 'Optimize resume' },
  { id: 'apply', label: 'Apply with confidence' },
];

/** Guided, deterministic, browser-only tailoring. Nothing is added without evidence or the user's confirmation. */
export function TailorFlow({ resumeText, score, onReanalyze }: {
  resumeText: string; score: ResumeScore; onReanalyze: (text: string) => void;
}) {
  const job = score.parsedJob;
  const matrix = score.skillMatrix;
  const rows = useMemo(() => job && matrix ? analyzeKeywords(resumeText, job, matrix) : [], [resumeText, job, matrix]);
  const suggestions = useMemo(() => job && matrix ? buildTailoringSuggestions(resumeText, job, matrix) : [], [resumeText, job, matrix]);
  // Evidence bullets belong in Experience or Projects, so offer those first.
  const sections = useMemo(() => splitResumeBlocks(resumeText).map(block => block.title)
    .filter(title => title && !/skill/i.test(title))
    .sort((a, b) => SECTION_ORDER.indexOf(sectionKind(a)) - SECTION_ORDER.indexOf(sectionKind(b))), [resumeText]);
  const [review, dispatch] = useReducer(reviewReducer, undefined, initialReviewState);
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);
  useEffect(() => { if (navigated.current) heading.current?.focus(); }, [step]);
  const go = (next: number) => { navigated.current = true; setStep(next); };

  const accepted = useMemo(() => acceptedSuggestions(review, suggestions), [review, suggestions]);
  const applied = useMemo(() => applySuggestions(splitResumeBlocks(resumeText), accepted), [resumeText, accepted]);
  const tailoredText = useMemo(() => resumeBlocksToText(applied.blocks), [applied]);
  const scores = useMemo(() => step === 2 && job
    ? scoreTailoring(resumeText, tailoredText, job, score.careerLevel ?? 'experienced') : undefined,
  [step, job, resumeText, tailoredText, score.careerLevel]);

  if (!job || !matrix) return <section className="panel"><p>Add a job description in Job Description Match mode to tailor your resume.</p></section>;
  return (
    <section className="panel space-y-6" aria-label="Tailor to this job">
      <StepIndicator steps={STEPS} currentStepIndex={step} onStepClick={go} />
      {step === 0 && <KeywordsStep rows={rows} alignment={score.skillMatchScore} headingRef={heading} onContinue={() => go(1)} />}
      {step === 1 && <OptimizeStep suggestions={suggestions} review={review} dispatch={dispatch} resumeText={resumeText}
        sections={sections} tailoredText={tailoredText} headingRef={heading} onBack={() => go(0)} onContinue={() => go(2)} />}
      {step === 2 && scores && <ApplyStep scores={scores} rows={rows} accepted={accepted} notApplied={applied.notApplied}
        blocks={applied.blocks} tailoredText={tailoredText} headingRef={heading} onBack={() => go(1)} onReanalyze={onReanalyze} />}
    </section>
  );
}
