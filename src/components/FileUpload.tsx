'use client';

import React, { useState, useRef } from 'react';
import { extractTextFromPDF, type PDFExtractionResult } from '@/lib/parsing/pdf-extractor';
import { UploadCloud, AlertTriangle, Shield } from 'lucide-react';
import { Button } from './ui/Button';
import { MAX_FILE_BYTES, validateResumeFile } from '@/lib/parsing/file-validation';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string, diagnostics?: PDFExtractionResult) => void;
  isLoading?: boolean;
}

export function FileUpload({ onTextExtracted, isLoading }: FileUploadProps) {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [diagnostics, setDiagnostics] = useState<PDFExtractionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setWarningMsg(null);
    setDiagnostics(null);
    setExtracting(true);

    try {
      if (file.size > MAX_FILE_BYTES) throw new Error('Choose a file up to 5 MB.');
      const buffer = await file.arrayBuffer();
      const kind = validateResumeFile(file.name, new Uint8Array(buffer));
      if (kind === 'pdf') {
        const diag = await extractTextFromPDF(buffer);
        setDiagnostics(diag);
        if (diag.text.trim().length > 30) {
          onTextExtracted(diag.text, file.name, diag);
        } else {
          setErrorMsg('The PDF could not be read as selectable text. It may contain scanned images. Try pasting your resume text below.');
        }
      } else if (kind === 'docx') {
        const { extractTextFromDOCX } = await import('@/lib/parsing/docx-extractor');
        const text = await extractTextFromDOCX(new Uint8Array(buffer));
        onTextExtracted(text, file.name);
        setWarningMsg('Review DOCX text carefully. Headers, footers, images and text boxes may be omitted; table reading order may need correction.');
      } else {
        const text = await file.text();
        if (text.trim().length > 30) {
          onTextExtracted(text, file.name);
        } else {
          setErrorMsg('The text file appears empty.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse resume document.';
      setErrorMsg(msg);
    } finally {
      setExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (pastedText.trim().length < 30 || pastedText.length > 60000) {
      setErrorMsg('Please paste between 30 and 60,000 characters of resume content.');
      return;
    }
    setErrorMsg(null);
    onTextExtracted(pastedText.trim(), 'pasted-resume.txt');
  };

  return (
    <div className="bg-slate-900/80 border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTab('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'upload'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload Resume (PDF / DOCX / TXT)
          </button>
          <button
            onClick={() => setTab('paste')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'paste'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Text Directly
          </button>
        </div>

        <div className="hidden sm:flex items-center text-[11px] text-emerald-400">
          <Shield className="w-3.5 h-3.5 mr-1" />
          Private Local Parsing
        </div>
      </div>

      {tab === 'upload' ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload resume file dropzone. Press enter or space to browse files."
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-indigo-500 ${
            dragOver
              ? 'border-indigo-500 bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            aria-label="Upload Resume Document"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) processFile(e.target.files[0]);
            }}
          />

          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">
                {extracting ? 'Extracting text...' : 'Drag & drop your resume or browse'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX or UTF-8 TXT · Up to 5 MB and 20 PDF pages</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            maxLength={60000}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            rows={7}
            aria-label="Paste resume text"
            placeholder="Paste your resume content here (e.g. Work Experience, Education, Skills)..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono"
          />
          <Button variant="primary" size="md" onClick={handlePasteSubmit} isLoading={isLoading}>
            Review Pasted Resume
          </Button>
        </div>
      )}

      {/* Diagnostics Alerts */}
      {diagnostics && diagnostics.extractionQuality !== 'excellent' && (
        <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-300 space-y-1">
          <div className="flex items-center font-bold">
            <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
            Extraction Health: {diagnostics.extractionQuality.toUpperCase()} ({diagnostics.wordsPerPage} Words / Page)
          </div>
          {diagnostics.warnings.map((w, i) => (
            <p key={i} className="text-[11px] text-amber-400/90 pl-5">• {w}</p>
          ))}
        </div>
      )}

      {errorMsg && (
        <div role="alert" className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-3 text-xs text-rose-300 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {warningMsg && <p role="status" className="text-sm text-amber-300">{warningMsg}</p>}
    </div>
  );
}
