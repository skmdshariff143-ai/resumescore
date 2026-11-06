'use client';

import { useId, useState } from 'react';
import { diffWords, MAX_USER_LINE, withUserEvidence, type TailoringSuggestion } from '@/lib/tailoring';
import type { Decision } from '@/lib/tailoring/review-state';
import { ACTION_LABEL, GAP_COPY, IMPORTANCE_LABEL, statusLabel } from './labels';

interface CardProps {
  item: TailoringSuggestion;
  decision?: Decision;
  resumeText: string;
  sections: string[];
  onDecide: (decision: Decision | 'clear') => void;
  onAddLine: (suggestion: TailoringSuggestion) => void;
  onRemoveLine: () => void;
}

function Proposed({ item }: { item: TailoringSuggestion }) {
  if (item.provenance === 'user-asserted') return <span>{item.proposed}</span>;
  return <>{diffWords(item.original, item.proposed ?? '').map((segment, index) =>
    segment.added ? <ins key={index}>{segment.text}</ins> : <span key={index}>{segment.text}</span>)}</>;
}

function UserEvidenceForm({ item, resumeText, sections, onAdd }: {
  item: TailoringSuggestion; resumeText: string; sections: string[]; onAdd: (suggestion: TailoringSuggestion) => void;
}) {
  const id = useId();
  const [line, setLine] = useState('');
  const [section, setSection] = useState(sections[0] ?? 'Experience');
  const [confirmed, setConfirmed] = useState(false);
  const [figuresConfirmed, setFiguresConfirmed] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const check = withUserEvidence(item, line, section, resumeText);
  const ready = line.trim().length > 0 && confirmed && (!check.warnings.length || figuresConfirmed);
  function submit() {
    if (check.errors.length || !check.suggestion) { setErrors(check.errors); return; }
    setErrors([]);
    onAdd(check.suggestion);
  }
  return (
    <div className="space-y-2">
      <label className="block" htmlFor={`${id}-line`}>Your evidence line for {item.keyword}</label>
      <textarea id={`${id}-line`} rows={2} maxLength={MAX_USER_LINE} value={line} aria-describedby={`${id}-help`}
        aria-invalid={errors.length > 0} className="w-full rounded border border-line bg-surface p-2"
        onChange={event => { setLine(event.target.value); setErrors([]); }} />
      <p id={`${id}-help`} className="text-xs text-muted">Up to {MAX_USER_LINE} characters. Describe what you did with {item.keyword}. It is marked as your own claim.</p>
      <label className="block" htmlFor={`${id}-section`}>Add under section</label>
      <select id={`${id}-section`} value={section} onChange={event => setSection(event.target.value)} className="rounded border border-line bg-surface p-2">
        {(sections.length ? sections : ['Experience']).map(title => <option key={title} value={title}>{title}</option>)}
      </select>
      <label className="flex gap-2 items-start"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />This is true for me.</label>
      {check.warnings.map(warning => <p key={warning} className="text-sm text-warning">{warning}</p>)}
      {!!check.warnings.length && <label className="flex gap-2 items-start"><input type="checkbox" checked={figuresConfirmed} onChange={event => setFiguresConfirmed(event.target.checked)} />I confirm these figures are accurate.</label>}
      {!!errors.length && <p role="alert" className="text-sm text-danger">{errors.join(' ')}</p>}
      <button className="action" disabled={!ready} onClick={submit}>Add my line for {item.keyword}</button>
    </div>
  );
}

export function SuggestionCard({ item, decision, resumeText, sections, onDecide, onAddLine, onRemoveLine }: CardProps) {
  const titleId = useId();
  const needsWording = item.proposed === null;
  const toggle = (next: Decision) => onDecide(decision === next ? 'clear' : next);
  return (
    <li aria-labelledby={titleId} className="rounded-xl border border-line p-4 space-y-3">
      <h3 id={titleId} className="font-semibold">
        {item.keyword} · {IMPORTANCE_LABEL[item.importance]} · {statusLabel(item)} · {ACTION_LABEL[item.action]}
      </h3>
      {needsWording ? <>
        <p className="font-medium">{GAP_COPY}</p>
        {item.note && <p className="text-sm text-body">{item.note}</p>}
        {item.action === 'review-transferable' && item.sourceEvidence &&
          <p className="text-sm">Related evidence: “{item.sourceEvidence.line}” ({item.sourceEvidence.section || 'opening'}). Transferable, review wording: it is not the same skill.</p>}
        <UserEvidenceForm item={item} resumeText={resumeText} sections={sections} onAdd={onAddLine} />
        <button className="action" aria-pressed={decision === 'rejected'} onClick={() => toggle('rejected')}>Skip {item.keyword}</button>
      </> : <>
        <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          {item.provenance === 'resume' && <><dt className="font-semibold">Original</dt>
            <dd className="break-words">{item.original ?? 'No Skills section yet: a new one will be created.'}</dd></>}
          <dt className="font-semibold">{item.provenance === 'user-asserted' ? 'Your line' : 'Suggested'}</dt>
          <dd className="break-words"><Proposed item={item} /></dd>
          {item.provenance === 'user-asserted' && <><dt className="font-semibold">Added under</dt><dd>{item.targetHeading}</dd></>}
          {item.sourceEvidence && <><dt className="font-semibold">Source</dt>
            <dd className="break-words">“{item.sourceEvidence.line}” ({item.sourceEvidence.section || 'opening'}, line {item.sourceEvidence.lineIndex + 1})</dd></>}
          <dt className="font-semibold">Effect</dt>
          <dd>{item.effect === 'visibility-only' ? 'Visibility only: the score already counts this evidence.' : 'Adds evidence the score can count for this keyword.'}</dd>
          <dt className="font-semibold">Check</dt>
          <dd>{item.verified.reason}{!!item.verified.newClaims.length &&
            <> New terms you are asserting: <mark>{item.verified.newClaims.join(', ')}</mark>.</>}</dd>
        </dl>
        {item.provenance === 'user-asserted'
          ? <button className="action" onClick={onRemoveLine}>Remove my line for {item.keyword}</button>
          : <div className="flex flex-wrap gap-2">
            <button className={`action ${decision === 'accepted' ? 'action-primary' : ''}`} aria-pressed={decision === 'accepted'}
              aria-label={`Accept ${item.keyword}: ${ACTION_LABEL[item.action]}`} onClick={() => toggle('accepted')}>Accept</button>
            <button className="action" aria-pressed={decision === 'rejected'}
              aria-label={`Reject ${item.keyword}: ${ACTION_LABEL[item.action]}`} onClick={() => toggle('rejected')}>Reject</button>
          </div>}
      </>}
    </li>
  );
}
