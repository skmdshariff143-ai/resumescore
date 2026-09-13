'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          job,
          tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const cl = data.data as CoverLetterResponse;
        const formatted = `${cl.salutation}\n\n${cl.bodyParagraphs.join('\n\n')}\n\n${cl.closing}\n${cl.candidateName}`;
        setCoverLetter(formatted);
      }
    } catch (err) {
      console.error('Failed to generate cover letter', err);
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-letter-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative font-sans max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cover-letter-title" className="text-base font-bold text-slate-100">Fact-Grounded Cover Letter Copilot</h3>
              <p className="text-xs text-slate-400">
                Grounds claims on {resume.allSkills.length} verified resume skills and {resume.experience.length} work history entries.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300">Select Writing Tone:</span>
          <div className="flex flex-wrap gap-2">
            {(['professional', 'confident', 'concise', 'startup', 'technical'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  tone === t
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
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
              readOnly
              value={coverLetter}
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none"
            />

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
                icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
