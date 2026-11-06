'use client';

import { useState, type Ref } from 'react';
import type { RequirementImportance } from '@/types';
import type { KeywordRow } from '@/lib/tailoring';
import { EVIDENCE_LABEL, IMPORTANCE_LABEL, MANUAL_REVIEW, nextStep } from './labels';

type Filter = 'all' | RequirementImportance;

export function KeywordsStep({ rows, alignment, headingRef, onContinue }: {
  rows: KeywordRow[]; alignment: number; headingRef: Ref<HTMLHeadingElement>; onContinue: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const visible = rows.filter(row => filter === 'all' || row.importance === filter);
  return (
    <div className="space-y-4">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">Identify keywords</h2>
      <p>Job terminology alignment now: <strong>{alignment}/100</strong> (estimate from text).</p>
      <p className="text-sm text-body">Evidence is inferred from text and is not independently verified. Missing evidence does not mean you lack a skill.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter keywords by importance">
        {(['all', 'required', 'preferred', 'bonus'] as const).map(key => (
          <button key={key} className={`action ${filter === key ? 'action-primary' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {key === 'all' ? 'All' : IMPORTANCE_LABEL[key]}
          </button>
        ))}
      </div>
      {rows.length ? (
        // Focusable so keyboard users can scroll the table horizontally on narrow screens.
        <div className="overflow-x-auto" role="region" aria-label="Keyword evidence table" tabIndex={0}>
          <table className="w-full text-left text-sm">
            <caption className="text-left pb-2">Keywords this job asks for, and your resume evidence</caption>
            <thead><tr>
              <th scope="col" className="py-2 pr-3">Keyword</th><th scope="col" className="pr-3">Importance</th>
              <th scope="col" className="pr-3">Evidence</th><th scope="col" className="pr-3">Source line</th><th scope="col">Next step</th>
            </tr></thead>
            <tbody>{visible.map(row => (
              <tr key={row.keyword} className="border-t border-line align-top">
                <th scope="row" className="py-2 pr-3 font-semibold">{row.keyword}</th>
                <td className="py-2 pr-3">{IMPORTANCE_LABEL[row.importance]}</td>
                <td className="py-2 pr-3">{EVIDENCE_LABEL[row.effectiveLevel]}{row.negatedOnly && ' (your resume says you have not used it)'}</td>
                <td className="py-2 pr-3 break-words">{row.sourceEvidence ? `“${row.sourceEvidence.line}”` : '—'}</td>
                <td className="py-2">{nextStep(row)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <p>No recognized skill requirements detected. Review the job description manually.</p>}
      <p className="text-sm text-body">{MANUAL_REVIEW}</p>
      <button className="action action-primary" onClick={onContinue}>Continue to edits</button>
    </div>
  );
}
