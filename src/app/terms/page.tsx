import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldAlert, Scale, HelpCircle, ExternalLink, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — ResumeScore',
  description:
    'Terms of service, user rights, intellectual property ownership, and heuristic scoring disclaimers for ResumeScore.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service — ResumeScore',
    description:
      'Terms of service, user rights, intellectual property ownership, and heuristic scoring disclaimers for ResumeScore.',
    url: 'https://resumescore-phi.vercel.app/terms',
    images: ['/og-image.png'],
  },
};

export default function TermsPage() {
  return (
    <article className="page-shell max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="eyebrow flex items-center gap-2">
          <Scale size={16} className="text-brand" /> Legal & Terms of Service
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Terms of Service</h1>
        <p className="text-base text-muted leading-relaxed">
          Please read these terms carefully before using ResumeScore. By accessing or using the platform, you agree to be bound by these terms.
        </p>
      </header>

      {/* Owner Review Flag Alert */}
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-xs sm:text-sm text-body space-y-1">
        <p className="font-semibold text-warning flex items-center gap-1.5">
          <ShieldAlert size={16} /> Notice to Site Operator & Users
        </p>
        <p className="text-muted leading-relaxed">
          This document reflects the operational and privacy architecture of ResumeScore. It is provided for transparency and requires final formal review by the site owner or legal counsel for jurisdiction-specific adaptation.
        </p>
      </div>

      {/* Key Principles Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm">
            <CheckCircle size={16} /> 100% User Ownership
          </div>
          <p className="text-xs text-muted leading-relaxed">
            You retain complete copyright and ownership of all resume text and content you submit.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-warning font-semibold text-sm">
            <FileText size={16} /> Guidance, Not Warranty
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Scores are heuristic algorithmic estimates, not recruiter certifications or hiring guarantees.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
          <div className="flex items-center gap-2 text-success font-semibold text-sm">
            <Scale size={16} /> Open Source Platform
          </div>
          <p className="text-xs text-muted leading-relaxed">
            The software is provided transparently under the standard open-source MIT license terms.
          </p>
        </div>
      </div>

      <section className="space-y-4 pt-2">
        <h2 className="text-xl font-semibold text-ink">1. Acceptance & Scope of Service</h2>
        <p className="text-body leading-relaxed">
          ResumeScore provides automated, evidence-based resume evaluation, ATS readability checks, semantic job description matching, and document editing tools. By accessing or using our website, you agree to these Terms of Service and our{' '}
          <Link href="/privacy" className="font-medium text-brand hover:underline">
            Privacy Policy
          </Link>
          . If you do not agree, you should discontinue use immediately.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">2. Heuristic Scoring & No Employment Guarantees</h2>
        <div className="rounded-xl bg-subtle p-4 space-y-2 text-sm text-body border border-line">
          <p className="font-semibold text-ink">Crucial Career Disclaimer</p>
          <p className="text-muted leading-relaxed">
            ResumeScore utilizes deterministic rules and semantic pattern matching to estimate document quality and keyword alignment. We do not:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted text-xs sm:text-sm pl-2">
            <li>Guarantee that your resume will pass any third-party Applicant Tracking System (ATS).</li>
            <li>Guarantee that you will receive job interviews, callbacks, or employment offers.</li>
            <li>Certify or verify the factual truthfulness of your qualifications, achievements, or employment history.</li>
            <li>Act as an employment agency, recruiter, or legal career counselor.</li>
          </ul>
        </div>
        <p className="text-body leading-relaxed">
          You are solely responsible for verifying the accuracy, truthfulness, and applicability of all resume edits, suggestions, and career materials before submitting them to prospective employers.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">3. User Intellectual Property & Privacy Rights</h2>
        <p className="text-body leading-relaxed">
          You retain 100% intellectual property ownership of your resume, work history, job descriptions, and any content you upload or paste into ResumeScore. We do not claim any copyright, license, or proprietary rights over your personal career documents.
        </p>
        <p className="text-body leading-relaxed">
          By default, document extraction and analysis execute locally inside your web browser. Resume bodies are not saved to a server database. If you enable optional browser history, records remain solely within your local device storage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">4. Acceptable Use & Conduct</h2>
        <p className="text-body leading-relaxed">
          When using ResumeScore, you agree that you will not:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-body text-sm pl-2">
          <li>Upload malicious code, viruses, corrupted files, or payloads designed to compromise server or client infrastructure.</li>
          <li>Attempt to bypass rate limits, server quotas, or security headers.</li>
          <li>Use automated scrapers, bots, or automated extraction tools against our API endpoints without authorization.</li>
          <li>Submit unlawful, defamatory, or fraudulent content misrepresenting your identity.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">5. Disclaimer of Warranties & Limitation of Liability</h2>
        <p className="text-body leading-relaxed">
          ResumeScore is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express, statutory, or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p className="text-body leading-relaxed">
          In no event shall ResumeScore, its developers, contributors, or operators be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising out of or in connection with your use or inability to use the service, including but not limited to loss of employment opportunities, missed applications, or technical errors.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">6. Modifications to Service & Terms</h2>
        <p className="text-body leading-relaxed">
          We reserve the right to modify, suspend, or discontinue any feature of ResumeScore at any time without prior notice. These terms may be revised periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.
        </p>
      </section>

      <section className="border-t border-line pt-6 space-y-3">
        <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
          <HelpCircle size={18} className="text-brand" /> Questions & Open Source Feedback
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          ResumeScore is developed transparently on GitHub. For inquiries, feedback, or legal questions, please visit our repository:
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
