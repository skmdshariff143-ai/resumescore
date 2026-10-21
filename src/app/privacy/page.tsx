import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Database, Cpu, ExternalLink, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Architecture — ResumeScore',
  description:
    'Transparent privacy approach: client-side resume processing, zero cloud storage by default, and locked external AI providers.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy & Data Architecture — ResumeScore',
    description:
      'Transparent privacy approach: client-side resume processing, zero cloud storage by default, and locked external AI providers.',
    url: 'https://resumescore-phi.vercel.app/privacy',
    images: ['/og-image.png'],
  },
};

export default function PrivacyPage() {
  return (
    <article className="page-shell max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="eyebrow flex items-center gap-2">
          <ShieldCheck size={16} className="text-brand" /> Privacy & Data Architecture
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Your resume, your choices</h1>
        <p className="text-base text-muted leading-relaxed">
          ResumeScore is engineered to minimize data collection and prioritize local execution. Here is exactly how your information is handled at every stage.
        </p>
      </header>

      {/* Primary Highlights Panel */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm">
            <Lock size={16} /> Browser-Only Default
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Parsing and scoring execute entirely on your device unless you choose server analysis.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-success font-semibold text-sm">
            <Database size={16} /> No Resume Database
          </div>
          <p className="text-xs text-muted leading-relaxed">
            We have no user accounts and no server database. Resume bodies are never persisted.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-ink font-semibold text-sm">
            <Cpu size={16} /> Paid AI Disabled
          </div>
          <p className="text-xs text-muted leading-relaxed">
            External commercial AI calls are disabled. Core analysis uses deterministic heuristics.
          </p>
        </div>
      </div>

      <section className="space-y-4 pt-2">
        <h2 className="text-xl font-semibold text-ink">Client-Side Document Processing</h2>
        <p className="text-body leading-relaxed">
          Browser-only analysis is the default. PDF text extraction and deterministic scoring run on your device in that mode. The app still downloads its code and resources; resume and job text are not included in those requests.
        </p>
      </section>

      <section className="panel space-y-3 bg-brand-soft border-brand/20">
        <div className="flex items-center gap-2 text-brand font-semibold">
          <Cpu size={18} /> External AI Policy
        </div>
        <p className="text-body text-sm leading-relaxed">
          Paid external AI is disabled in this release. Server tools currently provide deterministic heuristic feedback.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Server Processing & Optional External Providers</h2>
        <p className="text-body leading-relaxed">
          Server mode sends resume and job text to ResumeScore for processing. Optional AI generation sends this text to Anthropic Claude or Google Gemini only when you explicitly enable external AI processing for that feature. Provider retention is governed by the configured provider and account settings; this app cannot promise zero retention by third parties.
        </p>
        <p className="text-body leading-relaxed">
          Cover-letter generation uses the server even if your earlier analysis was browser-only. Its dialog explains this before generation. Heuristic drafts do not require external AI consent.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Local History Storage & Device Ownership</h2>
        <p className="text-body leading-relaxed">
          History saving is optional and off by default. Saved analyses include resume text and remain in this browser’s local storage until deleted or browser storage is cleared. The History page provides JSON export, individual deletion and deletion of all app records. Shared-device users should delete saved resumes when finished.
        </p>
        <div className="pt-2">
          <Link href="/history" className="action text-sm">
            Export or delete saved data
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Operational Infrastructure & Logs</h2>
        <p className="text-body leading-relaxed">
          The application has no resume database or user accounts. Server code does not intentionally persist resume bodies or log provider payloads. Hosting infrastructure may retain operational request metadata according to its configuration. Deleting local records cannot delete provider or hosting logs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Heuristic Scoring & ATS Disclaimers</h2>
        <p className="text-body leading-relaxed">
          Scores estimate text quality and terminology alignment. They do not certify ATS compatibility, verify qualifications, or predict hiring outcomes. Review extracted text, edited documents and every AI-generated statement before sharing.
        </p>
      </section>

      <section className="border-t border-line pt-6 space-y-3">
        <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
          <HelpCircle size={18} className="text-brand" /> Responsible Disclosure & Source Code
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          ResumeScore is developed transparently on GitHub. If you discover a security concern or privacy defect, please submit an issue or security advisory via the official repository:
        </p>
        <a
          href="https://github.com/skmdshariff143-ai/resumescore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          github.com/skmdshariff143-ai/resumescore <ExternalLink size={14} />
        </a>
      </section>
    </article>
  );
}
