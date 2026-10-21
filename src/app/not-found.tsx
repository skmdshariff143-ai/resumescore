import Link from 'next/link';
import { FileQuestion, ArrowRight, Home, ShieldCheck, Scale, History } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <FileQuestion size={32} />
        </div>

        <div className="space-y-2">
          <p className="eyebrow">404 Error</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Page not found
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been relocated, or the link may be outdated.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/analyze" className="action action-primary w-full sm:w-auto">
            Analyze Resume <ArrowRight size={16} />
          </Link>
          <Link href="/" className="action w-full sm:w-auto">
            <Home size={16} /> Return Home
          </Link>
        </div>

        <div className="border-t border-line pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Helpful Links
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-body">
            <Link href="/history" className="inline-flex items-center gap-1 hover:text-brand transition-colors">
              <History size={13} /> Dashboard & History
            </Link>
            <span>•</span>
            <Link href="/privacy" className="inline-flex items-center gap-1 hover:text-brand transition-colors">
              <ShieldCheck size={13} /> Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="inline-flex items-center gap-1 hover:text-brand transition-colors">
              <Scale size={13} /> Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
