'use client';

import { useState } from 'react';
import { verifyRewrite } from '@/lib/ai/factuality';

/** Every selection is checked again in the browser before explicit acceptance. */
export function ReviewedRewrite({ source, onApply }: { source: string; onApply: (original: string, replacement: string) => boolean }) {
  const [original, setOriginal] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [consent, setConsent] = useState(false);
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const verification = verifyRewrite(original, { suggestion }).statements.suggestion;
  async function generate() {
    setBusy(true); setSuggestion(''); setApproved(false);
    try {
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ai-consent': String(consent) },
        body: JSON.stringify({ bullet: original }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error('Request failed');
      const result = await response.json();
      setSuggestion(result.data.xyzFormula);
      if (result.verification?.statements?.xyzFormula?.status === 'contradicted') {
        setStatus('The generated suggestion failed factuality checks. The original text was retained.');
        return;
      }
      setStatus(result.isLLMGenerated ? 'External AI suggestion. Review all factual claims.' :
        'Heuristic suggestion: external AI was not used. The source wording is preserved.');
    } catch { setStatus('Rewrite unavailable. Your resume is unchanged; edit it manually below.'); }
    finally { setBusy(false); }
  }
  return <section className="border border-line rounded p-4 space-y-3" aria-label="Review a suggested rewrite">
    <h3 className="font-semibold">Review a bullet rewrite</h3>
    <p className="text-sm text-body">Paste one exact line from the current resume. This request is processed on our server. Paid external AI is disabled in this release; suggestions use deterministic heuristics. Automated checks cannot establish truth.</p>
    <label className="block">Original text
      <textarea className="block w-full rounded bg-surface border p-2" maxLength={4000} value={original} disabled={busy}
        onChange={event => { setOriginal(event.target.value); setSuggestion(''); setApproved(false); }} />
    </label>
    <label className="flex gap-2"><input type="checkbox" disabled checked={consent} onChange={event => setConsent(event.target.checked)} />
      External AI processing is unavailable in this release.</label>
    <button className="border rounded px-3 py-2" disabled={busy || original.length < 5 || !source.split('\n').includes(original)}
      onClick={generate}>{busy ? 'Checking suggestion…' : 'Suggest rewrite'}</button>
    <p role="status">{status}</p>
    {suggestion && <>
      <div className="grid md:grid-cols-2 gap-4">
        <div><h4>Original</h4><p className="whitespace-pre-wrap break-words">{original}</p></div>
        <div><h4>Suggested rewrite</h4><p className="whitespace-pre-wrap break-words">{suggestion}</p></div>
      </div>
      <p>Check: {verification.status}. {verification.reason}</p>
      {!!verification.newClaims.length && <p>New terms needing verification: <mark>{verification.newClaims.join(', ')}</mark></p>}
      <label className="flex gap-2"><input type="checkbox" checked={approved} onChange={event => setApproved(event.target.checked)} />
        I checked this wording against my experience and confirm every claim is accurate.</label>
      <button className="border rounded px-3 py-2" disabled={!approved || verification.status === 'contradicted'}
        onClick={() => {
          if (onApply(original, suggestion)) {
            setSuggestion(''); setApproved(false); setStatus('Approved edit applied. Undo remains available.');
          } else setStatus('The source changed or occurs more than once. Select a unique current line and review again.');
        }}>Approve and apply rewrite</button>
    </>}
  </section>;
}
