'use client';

import { useState, type Ref } from 'react';
import type { ResumeBlock } from '@/lib/export/resume-document';
import { downloadResumeDOCX, downloadResumeText, printResume, PRINT_HINT } from '@/lib/export/download';
import { MAX_SKILLS_ADDED, type KeywordRow, type TailoringSuggestion } from '@/lib/tailoring';
import { SCORE_LIMITATION } from './labels';

interface ScoreChange { jobAlignmentBefore: number; jobAlignmentAfter: number; generalBefore: number; generalAfter: number }

const change = (before: number, after: number) => after === before ? `${before}/100 (no change)` : `${before} → ${after}/100`;

export function ApplyStep({ scores, rows, accepted, notApplied, blocks, tailoredText, headingRef, onBack, onReanalyze }: {
  scores: ScoreChange; rows: KeywordRow[]; accepted: TailoringSuggestion[]; notApplied: { id: string; reason: string }[];
  blocks: ResumeBlock[]; tailoredText: string; headingRef: Ref<HTMLHeadingElement>; onBack: () => void; onReanalyze: (text: string) => void;
}) {
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const userLines = accepted.filter(item => item.provenance === 'user-asserted');
  const covered = new Set(userLines.map(item => item.keyword));
  const openGaps = rows.filter(row => row.importance === 'required' && row.effectiveLevel === 'missing' && !covered.has(row.keyword));
  const skillsAdded = accepted.filter(item => item.action === 'surface-in-skills').length;

  async function docx() {
    if (exporting) return;
    setExporting(true);
    try { await downloadResumeDOCX(blocks, 'resume-tailored.docx'); }
    catch { setMessage('DOCX export failed. Download TXT or try printing your resume instead.'); }
    finally { setExporting(false); }
  }

  return (
    <div className="space-y-4">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">Apply with confidence</h2>
      <dl className="grid gap-2 sm:grid-cols-[16rem_1fr]">
        <dt className="font-semibold">Job terminology alignment</dt><dd>{change(scores.jobAlignmentBefore, scores.jobAlignmentAfter)}</dd>
        <dt className="font-semibold">General resume quality</dt><dd>{change(scores.generalBefore, scores.generalAfter)}</dd>
      </dl>
      <p className="text-sm text-body">{SCORE_LIMITATION} Both versions are scored with the same job, career level and rubric.</p>

      <h3 className="font-semibold">Final checklist</h3>
      <ul aria-label="Final checklist" className="space-y-2 text-sm">
        <li>Done: {accepted.length} accepted {accepted.length === 1 ? 'edit cites' : 'edits each cite'} a line from your resume or {accepted.length === 1 ? 'is' : 'are'} marked as your own.</li>
        <li>Done: {skillsAdded} {skillsAdded === 1 ? 'keyword' : 'keywords'} added to Skills (limit {MAX_SKILLS_ADDED}); none added twice.</li>
        {notApplied.length > 0 && <li>Check: {notApplied.length} accepted {notApplied.length === 1 ? 'edit was' : 'edits were'} not applied. {notApplied.map(item => item.reason).join(' ')}</li>}
        <li>{openGaps.length
          ? <>Check: required keywords still without evidence: {openGaps.map(row => row.keyword).join(', ')}. Leave them out unless they are true for you.</>
          : 'Done: every recognized required keyword has evidence or a line you added.'}</li>
        {userLines.length > 0 && <li>Check: re-read the lines you added before sending.
          <ul aria-label="Lines you added" className="list-disc pl-5">{userLines.map(item => <li key={item.id}>{item.proposed}</li>)}</ul></li>}
        <li><label className="flex gap-2 items-start"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} />I re-read every changed line and it is accurate.</label></li>
      </ul>

      <details className="rounded border border-line p-3">
        <summary className="font-semibold text-ink">Changed lines ({accepted.length})</summary>
        <ul className="mt-2 space-y-2 text-sm">{accepted.map(item => (
          <li key={item.id} className="break-words">{item.original ? <>“{item.original}” → </> : 'Added: '}“{item.proposed}”</li>
        ))}</ul>
      </details>

      {message && <p role="status">{message}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="action" disabled={exporting} aria-busy={exporting} onClick={docx}>Download DOCX</button>
        <button className="action" onClick={() => downloadResumeText(blocks, 'resume-tailored.txt')}>Download TXT</button>
        <button className="action" onClick={() => printResume(blocks, () => setMessage(PRINT_HINT))}>Print / Save PDF</button>
        <button className="action action-primary" disabled={tailoredText.trim().length < 30} onClick={() => onReanalyze(tailoredText)}>Re-analyze tailored version</button>
      </div>
      <button className="action" onClick={onBack}>Back to edits</button>
    </div>
  );
}
