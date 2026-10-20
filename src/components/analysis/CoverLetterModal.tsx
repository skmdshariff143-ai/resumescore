'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { ResumeParsed, JobParsed, CoverLetterResponse } from '@/types';
import { Zap, X, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeParsed;
  job?: JobParsed;
}

export function CoverLetterModal({ isOpen, onClose, resume, job }: CoverLetterModalProps) {
  const [tone, setTone] = useState<'professional' | 'confident' | 'concise' | 'startup' | 'technical'>('professional');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiConsent, setAIConsent] = useState(false);
  const [error, setError] = useState('');
  const [generationSource, setGenerationSource] = useState('');
  const [approved, setApproved] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        const elements = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
        if (!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    }
    return () => { window.removeEventListener('keydown', handleKeyDown); if (isOpen) previousFocus?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setApproved(false);
    setError('');
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ai-consent': String(aiConsent) },
        body: JSON.stringify({
          resume,
          job,
          tone,
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Generation failed.');
      if (data.success && data.data) {
        const cl = data.data as CoverLetterResponse;
        const formatted = `${cl.salutation}\n\n${cl.bodyParagraphs.join('\n\n')}\n\n${cl.closing}\n${cl.candidateName}`;
        setCoverLetter(formatted);
        setGenerationSource(data.isLLMGenerated ? 'AI-generated draft. Verify every claim before use.' : 'Heuristic draft generated on the ResumeScore server.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-letter-title"
      className="fixed inset-0 z-50 bg-black/80  flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-surface border border-line rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-panel relative font-sans max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-brand/20 text-brand border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cover-letter-title" className="text-base font-bold text-ink">Draft a truthful cover letter</h3>
              <p className="text-xs text-muted">
                Uses {resume.allSkills.length} detected skills and {resume.experience.length} work history entries. These claims are not independently verified.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <p className="text-sm text-body">Generating a letter sends resume and job text to the ResumeScore server, including when analysis was browser-only.</p>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" disabled checked={aiConsent} onChange={event => setAIConsent(event.target.checked)} />Paid external AI is disabled in this release. This feature produces a server-based heuristic draft.</label>
        {error && <p role="alert" className="text-danger">{error}</p>}
        {generationSource && <p role="status" className="text-body">{generationSource}</p>}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-body">Select Writing Tone:</span>
          <div className="flex flex-wrap gap-2">
            {(['professional', 'confident', 'concise', 'startup', 'technical'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  tone === t
                    ? 'bg-brand text-white shadow-panel '
                    : 'bg-surface text-muted hover:text-ink border border-line'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {!coverLetter && (
          <Button
            variant="signal"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            isLoading={generating}
            icon={<Zap className="w-4 h-4" />}
          >
            Generate Tailored Cover Letter
          </Button>
        )}

        {/* Generated Text Area */}
        {coverLetter && (
          <div className="space-y-4">
            <textarea
              aria-label="Generated cover letter draft"
              readOnly
              value={coverLetter}
              rows={12}
              className="w-full bg-surface border border-line rounded-xl p-4 text-xs text-ink leading-relaxed font-sans focus:outline-none"
            />
            <label className="flex gap-2 text-sm">
              <input type="checkbox" checked={approved} onChange={event => setApproved(event.target.checked)} />
              I reviewed this draft and confirm its claims before copying.
            </label>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                isLoading={generating}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Regenerate
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleCopy}
                disabled={!approved}
                icon={copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Cover Letter'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
