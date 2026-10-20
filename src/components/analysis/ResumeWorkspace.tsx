'use client';

import { useState } from 'react';
import { ReviewedRewrite } from './ReviewedRewrite';
import { printableResumeHTML, resumeBlocksToText, splitResumeBlocks, type ResumeBlock } from '@/lib/export/resume-document';

export function ResumeWorkspace({ original, onAnalyze }: { original: string; onAnalyze: (text: string) => void }) {
  const [blocks, setBlocks] = useState(() => splitResumeBlocks(original));
  const [undo, setUndo] = useState<ResumeBlock[][]>([]);
  const [compare, setCompare] = useState(false);
  const [message, setMessage] = useState('');
  const text = resumeBlocksToText(blocks);
  function change(next: ResumeBlock[]) {
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
    try {
      const { createDOCXResume } = await import('@/lib/export/docx-resume');
      const blob = await createDOCXResume(blocks);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'resume.docx'; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setMessage('DOCX export failed. Download TXT or try printing your resume instead.'); }
  }
  return (
    <section className="rounded-2xl border border-slate-700 p-5 space-y-5" aria-label="Resume improvement workspace">
      <h2 className="text-xl font-semibold">Edit your resume</h2>
      <p className="text-sm text-slate-300">Edit personal details and sections, then re-analyze to calculate the actual score. No AI edits are applied automatically. Export uses a simple single-column document. PDF export uses your browser’s print dialog. Review document pagination before sharing.</p>
      <div className="flex flex-wrap gap-3">
        <button className="border rounded px-3 py-2" disabled={!undo.length} onClick={() => { setBlocks(undo[undo.length - 1]); setUndo(undo.slice(0, -1)); }}>Undo</button>
        <button className="border rounded px-3 py-2" onClick={() => change(splitResumeBlocks(original))}>Reset to original</button>
        <button className="border rounded px-3 py-2" onClick={() => setCompare(!compare)} aria-pressed={compare}>Compare original</button>
        <button className="border rounded px-3 py-2" onClick={download}>Download TXT</button>
        <button className="border rounded px-3 py-2" onClick={downloadDOCX}>Download DOCX</button>
        <button className="border rounded px-3 py-2" onClick={print}>Print / Save PDF</button>
        <button className="bg-blue-600 rounded px-3 py-2" disabled={text.length < 30 || text.length > 60000} onClick={() => onAnalyze(text)}>Re-analyze edited version</button>
      </div>
      {message && <p role="status">{message}</p>}
      <ReviewedRewrite source={text} onApply={(source, replacement) => {
        const occurrences = blocks.reduce((count, block) => count + block.content.split('\n').filter(line => line === source).length, 0);
        if (occurrences !== 1) return false;
        change(blocks.map(block => ({ ...block, content: block.content.split('\n').map(line => line === source ? replacement : line).join('\n') })));
        return true;
      }} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <fieldset key={index} className="rounded border border-slate-600 p-3 space-y-2">
              <legend>{block.title || 'Personal details / opening'}</legend>
              <input aria-label={`Section ${index + 1} heading`} maxLength={100} className="w-full bg-slate-950 border rounded p-2" value={block.title} onChange={event => change(blocks.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} />
              <textarea aria-label={`Section ${index + 1} content`} maxLength={60000} rows={6} className="w-full bg-slate-950 border rounded p-2" value={block.content} onChange={event => change(blocks.map((item, i) => i === index ? { ...item, content: event.target.value } : item))} />
              <div className="flex gap-3">
                <button disabled={index === 0} onClick={() => { const next = [...blocks]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next); }}>Move up</button>
                <button disabled={index === blocks.length - 1} onClick={() => { const next = [...blocks]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next); }}>Move down</button>
                <button onClick={() => change(blocks.filter((_, i) => i !== index))}>Remove section</button>
              </div>
            </fieldset>
          ))}
          <button className="border rounded px-3 py-2" onClick={() => change([...blocks, { title: 'New section', content: '' }])}>Add section</button>
        </div>
        <div className="space-y-4">
          {compare && <div><h3 className="font-semibold">Original text</h3><pre className="whitespace-pre-wrap break-words border rounded p-4 text-sm">{original}</pre></div>}
          <article aria-label="Live resume preview" className="bg-white text-slate-950 p-6 rounded">
            {blocks.map((block, index) => <section key={index} className="mb-4">{block.title && <h3 className="font-bold mb-2">{block.title}</h3>}<p className="whitespace-pre-wrap break-words text-sm">{block.content}</p></section>)}
          </article>
        </div>
      </div>
    </section>
  );
}
