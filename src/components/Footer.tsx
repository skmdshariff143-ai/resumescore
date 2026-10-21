import Link from 'next/link';
import { FileText, LockKeyhole, ExternalLink, ShieldCheck, Sparkles, Code2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="page-shell space-y-10 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-ink text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                <FileText size={16} />
              </span>
              ResumeScore
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Transparent, evidence-based resume scoring and job match intelligence. Designed to help you apply with verified confidence.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1 text-success font-medium">
                <ShieldCheck size={14} /> 100% Client-Side Default
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Sparkles size={14} className="text-brand" /> No Commercial AI Leaks
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Navigation</p>
            <nav aria-label="Footer navigation" className="flex flex-col space-y-2 text-sm text-body">
              <Link className="hover:text-brand transition-colors" href="/analyze">Analyze Resume</Link>
              <Link className="hover:text-brand transition-colors" href="/analyze?mode=job_match">Job Match Analysis</Link>
              <Link className="hover:text-brand transition-colors" href="/history">History & Dashboard</Link>
              <Link className="hover:text-brand transition-colors" href="/privacy">Privacy & Choices</Link>
            </nav>
          </div>

          {/* Methodology */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Methodology</p>
            <ul className="space-y-2 text-sm text-muted">
              <li>Deterministic 7-Pillar Scoring</li>
              <li>Layered Semantic Skill Extraction</li>
              <li>Anti-Hallucination Bullet Revisions</li>
              <li>Standard ATS Readability Metrics</li>
              <li>DOCX & Selectable PDF Export</li>
            </ul>
          </div>

          {/* Transparency & Open Source */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink">Trust & Code</p>
            <ul className="space-y-2 text-sm text-body">
              <li>
                <a
                  href="https://github.com/skmdshariff143-ai/resumescore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-body hover:text-brand transition-colors"
                >
                  <Code2 size={15} /> Source Code on GitHub <ExternalLink size={12} className="text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/skmdshariff143-ai/resumescore/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-body hover:text-brand transition-colors"
                >
                  Report an Issue <ExternalLink size={12} className="text-muted" />
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-body hover:text-brand transition-colors"
                >
                  llms.txt (LLM Documentation)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Operational Disclaimer */}
        <div className="flex items-start gap-3 rounded-xl bg-subtle p-4 text-xs sm:text-sm text-muted">
          <LockKeyhole size={18} className="mt-0.5 shrink-0 text-brand" />
          <p className="leading-relaxed">
            Browser-only analysis by default. History is optional. Paid AI is disabled. Scores are guidance, not hiring predictions or ATS certification. No resume text is uploaded to server databases.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
          <p>© {new Date().getFullYear()} ResumeScore. Built for your next step.</p>
          <p className="text-right">Private • Deterministic • Open Source</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
