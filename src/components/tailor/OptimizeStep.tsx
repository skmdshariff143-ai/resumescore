'use client';

import type { Dispatch, Ref } from 'react';
import type { TailoringSuggestion } from '@/lib/tailoring';
import type { ReviewAction, ReviewState } from '@/lib/tailoring/review-state';
import { SuggestionCard } from './SuggestionCard';

export function OptimizeStep({ suggestions, review, dispatch, resumeText, sections, tailoredText, headingRef, onBack, onContinue }: {
  suggestions: TailoringSuggestion[]; review: ReviewState; dispatch: Dispatch<ReviewAction>; resumeText: string;
  sections: string[]; tailoredText: string; headingRef: Ref<HTMLHeadingElement>; onBack: () => void; onContinue: () => void;
}) {
  const decisions = Object.values(review.decisions);
  const accepted = decisions.filter(decision => decision === 'accepted').length;
  const rejected = decisions.filter(decision => decision === 'rejected').length;
  const supported = suggestions.filter(item => item.supported);
  const undecidedSupported = supported.filter(item => !review.decisions[item.id]).length;
  return (
    <div className="space-y-4">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold">Optimize resume</h2>
      <p className="text-sm text-body">Every suggested edit cites a line already in your resume. Keywords without evidence are never added for you. Accept or reject each edit; nothing changes until you accept it.</p>
      <div className="flex flex-wrap gap-2">
        <button className="action action-primary" disabled={!undecidedSupported}
          onClick={() => dispatch({ type: 'accept-all-supported', suggestions })}>Accept all supported ({supported.length})</button>
        <button className="action" disabled={!review.history.length} onClick={() => dispatch({ type: 'undo' })}>Undo</button>
        <button className="action" onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      </div>
      <p role="status" aria-label="Review progress">{accepted} accepted · {rejected} rejected · {suggestions.length - accepted - rejected} awaiting a decision</p>
      {suggestions.length ? (
        <ul aria-label="Suggested edits" className="space-y-3">
          {suggestions.map(item => {
            const shown = review.userEvidence[item.id] ?? item;
            return <SuggestionCard key={item.id} item={shown} decision={review.decisions[item.id]} resumeText={resumeText} sections={sections}
              onDecide={decision => dispatch(decision === 'clear' ? { type: 'clear', id: item.id } : { type: decision === 'accepted' ? 'accept' : 'reject', id: item.id })}
              onAddLine={suggestion => dispatch({ type: 'add-user-evidence', suggestion })}
              onRemoveLine={() => dispatch({ type: 'remove-user-evidence', id: item.id })} />;
          })}
        </ul>
      ) : <p>No edits to suggest. Your resume already uses the recognized job terms, or the job description has none.</p>}
      <details className="rounded border border-line p-3">
        <summary className="font-semibold text-ink">Preview tailored resume</summary>
        <article aria-label="Tailored resume preview" className="resume-paper mt-3 rounded-xl p-5">
          <p className="whitespace-pre-wrap break-words text-sm">{tailoredText}</p>
        </article>
      </details>
      <div className="flex flex-wrap gap-2">
        <button className="action" onClick={onBack}>Back to keywords</button>
        <button className="action action-primary" onClick={onContinue}>Continue to final check</button>
      </div>
    </div>
  );
}
