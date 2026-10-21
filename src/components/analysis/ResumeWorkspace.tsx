'use client';

import { useState } from 'react';
import { ReviewedRewrite } from './ReviewedRewrite';
import { printableResumeHTML, resumeBlocksToText, splitResumeBlocks, type ResumeBlock } from '@/lib/export/resume-document';
import { compareResumeVersions } from '@/lib/scoring/comparison';
import type { ResumeScore } from '@/types';

export function ResumeWorkspace({ original, onAnalyze, analysis }: { original: string; onAnalyze: (text: string) => void; analysis?: ResumeScore }) {
  const [blocks, setBlocks] = useState(() => splitResumeBlocks(original));
  const [undo, setUndo] = useState<ResumeBlock[][]>([]);
  const [compare, setCompare] = useState(false);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [sectionType, setSectionType] = useState('Professional Summary');
  const [comparison, setComparison] = useState<ReturnType<typeof compareResumeVersions>>();
  const text = resumeBlocksToText(blocks);
  function change(next: ResumeBlock[]) {
    setComparison(undefined);
    setUndo(previous => [...previous.slice(-19), blocks]);
    setBlocks(next);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'resume.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function print() {
    const frame = document.createElement('iframe');
    frame.title = 'Printable resume';
    frame.style.position = 'fixed'; frame.style.width = '1px'; frame.style.height = '1px';
    frame.srcdoc = printableResumeHTML(blocks);
    frame.onload = () => {
      if (!frame.contentWindow) return;
      frame.contentWindow.focus(); frame.contentWindow.print();
      setMessage('Choose Save as PDF in the print dialog. Review page breaks and disable browser headers and footers.');
    };
    document.body.appendChild(frame);
    // Printing may be asynchronous; keep the frame long enough for the dialog.
    setTimeout(() => frame.remove(), 120_000);
  }
  async function downloadDOCX() {
    if (exporting) return;
    setExporting(true);
    try {
      const { createDOCXResume } = await import('@/lib/export/docx-resume');
      const blob = await createDOCXResume(blocks);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'resume.docx'; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setMessage('DOCX export failed. Download TXT or try printing your resume instead.'); } finally { setExporting(false); }
  }
  return (
    <section className="panel space-y-5" aria-label="Resume improvement workspace">
      <h2 className="text-xl font-semibold">Edit your resume</h2>
      <p className="text-sm text-body">Edit personal details and sections, then re-analyze to calculate the actual score. No AI edits are applied automatically. Export uses a simple single-column document. PDF export uses your browser’s print dialog. Review document pagination before sharing.</p>
      <div className="workspace-controls flex flex-wrap gap-2">
        <button className="action" disabled={!undo.length} onClick={() => { setBlocks(undo[undo.length - 1]); setUndo(undo.slice(0, -1)); setComparison(undefined); }}>Undo</button>
        <button className="action" onClick={() => change(splitResumeBlocks(original))}>Reset to original</button>
        <button className="action" onClick={() => { setCompare(!compare); if (!compare) setView("preview"); }} aria-pressed={compare}>Compare original</button>
        <button className="action" onClick={download}>Download TXT</button>
        <button className="action" disabled={exporting} aria-busy={exporting} onClick={downloadDOCX}>Download DOCX</button>
        <button className="action" onClick={print}>Print / Save PDF</button>
        <button className="action action-primary" disabled={text.length < 30 || text.length > 60000} onClick={() => onAnalyze(text)}>Re-analyze edited version</button>
      </div>
      {analysis && <section className="rounded border border-line p-4 space-y-3" aria-label="Score comparison and job tailoring">
        <h3 className="font-semibold">Compare evidence and tailor your resume</h3>
        <p className="text-sm text-body">Recalculates both text versions with the same career profile and job. This text-only comparison excludes original PDF layout diagnostics. Scores are editorial estimates, not hiring predictions.</p>
        <button className="action" disabled={text.trim().length < 30 || text.length > 60000}
          onClick={() => setComparison(compareResumeVersions(original, text, analysis))}>Calculate score comparison</button>
        {comparison && <>
          <p role="status">General quality: {comparison.before} → {comparison.after}. Changes below use the current rubric.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="text-left pb-2">Dimension changes from original to edited text</caption>
              <thead><tr><th scope="col">Dimension</th><th scope="col">Original</th><th scope="col">Edited</th><th scope="col">Change</th></tr></thead>
              <tbody>{comparison.dimensions.map(item => <tr key={item.key}>
                <th scope="row" className="py-2 font-normal"><details><summary>{item.name}</summary>
                  <p>{item.explanation}</p>
                  <p>Original evidence: {item.previousEvidence.join('; ') || 'None detected'}</p>
                  <p>Edited evidence: {item.currentEvidence.join('; ') || 'None detected'}</p>
                </details></th>
                <td>{item.before}</td><td>{item.after}</td><td>{item.delta > 0 ? '+' : ''}{item.delta}</td>
              </tr>)}</tbody>
            </table>
          </div>
          {analysis.mode === 'job_match' && <div className="space-y-2">
            <h4 className="font-semibold">Job evidence gaps in this draft</h4>
            <p className="text-sm text-body">Missing evidence does not mean you lack a skill. Add only relevant experience you can substantiate.</p>
            <ul className="list-disc pl-5">{comparison.skills.filter(item => item.evidenceLevel !== 'demonstrated').map(item =>
              <li key={item.skill}>{item.skill} ({item.importance}): {item.evidenceLevel}. {item.reasoning}</li>)}</ul>
            {!comparison.skills.length && <p>No recognized skill requirements detected. Review the job description manually.</p>}
            <p className="text-sm text-body">Education, licensing, eligibility and experience requirements still require manual review.</p>
          </div>}
        </>}
      </section>}
      {message && <p role="status">{message}</p>}
      <ReviewedRewrite source={text} onApply={(source, replacement) => {
        const occurrences = blocks.reduce((count, block) => count + block.content.split('\n').filter(line => line === source).length, 0);
        if (occurrences !== 1) return false;
        change(blocks.map(block => ({ ...block, content: block.content.split('\n').map(line => line === source ? replacement : line).join('\n') })));
        return true;
      }} />
      <div className="flex gap-2 sm:hidden" aria-label="Resume workspace view"><button className="action" aria-pressed={view === "edit"} onClick={() => setView("edit")}>Editor</button><button className="action" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Preview</button></div>
      <div className="workspace-view grid min-w-0 gap-6 lg:grid-cols-2" data-view={view}>
        <div className="workspace-fields min-w-0 space-y-4">
          {blocks.map((block, index) => (
            <fieldset key={index} className="rounded border border-line p-3 space-y-2">
              <legend>{block.title || 'Personal details / opening'}</legend>
              <input aria-label={`Section ${index + 1} heading`} maxLength={100} className="w-full bg-surface border rounded p-2" value={block.title} onChange={event => change(blocks.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} />
              <textarea aria-label={`Section ${index + 1} content`} maxLength={60000} rows={6} className="w-full bg-surface border rounded p-2" value={block.content} onChange={event => change(blocks.map((item, i) => i === index ? { ...item, content: event.target.value } : item))} />
              <div className="flex flex-wrap gap-2">
                <button className="action" disabled={index === 0} onClick={() => { const next = [...blocks]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next); }}>Move up</button>
                <button className="action" disabled={index === blocks.length - 1} onClick={() => { const next = [...blocks]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next); }}>Move down</button>
                <button className="action action-danger" onClick={() => change(blocks.filter((_, i) => i !== index))}>Remove section</button>
              </div>
            </fieldset>
          ))}
          <label className="block">New section type
            <select className="block w-full bg-surface border rounded p-2" value={sectionType} onChange={event => setSectionType(event.target.value)}>
              {['Professional Summary', 'Work Experience', 'Education', 'Skills', 'Projects', 'Achievements', 'Certifications', 'Volunteering', 'New section'].map(title =>
                <option key={title}>{title}</option>)}
            </select>
          </label>
          <button className="action" disabled={blocks.length >= 30} onClick={() => change([...blocks, { title: sectionType, content: '' }])}>Add section</button>
        </div>
        <div className="workspace-preview min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          {compare && <div><h3 className="font-semibold">Original text</h3><pre className="whitespace-pre-wrap break-words border rounded p-4 text-sm">{original}</pre></div>}
          <article aria-label="Live resume preview" className="resume-paper rounded-xl p-5 sm:p-8">
            {blocks.map((block, index) => <section key={index} className="mb-4">{block.title && <h3 className="font-bold mb-2">{block.title}</h3>}<p className="whitespace-pre-wrap break-words text-sm">{block.content}</p></section>)}
          </article>
        </div>
      </div>
    </section>
  );
}
