import Link from 'next/link';
import { FileText, LockKeyhole } from 'lucide-react';
export function Footer() {
  return <footer className="mt-16 border-t border-line bg-surface">
    <div className="page-shell space-y-8">
      <div className="flex flex-col justify-between gap-6 sm:flex-row">
        <div className="max-w-sm space-y-3"><Link href="/" className="flex items-center gap-2 font-bold text-ink"><FileText size={20} className="text-brand"/>ResumeScore</Link><p className="text-sm text-muted">Clear resume feedback. Thoughtful improvements. Your next application, better prepared.</p></div>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-start gap-x-6 gap-y-3 text-sm font-medium text-body"><Link className="py-2" href="/analyze">Analyze</Link><Link className="py-2" href="/analyze?mode=job_match">Job Match</Link><Link className="py-2" href="/history">History</Link><Link className="py-2" href="/privacy">Privacy</Link></nav>
      </div>
      <div className="flex items-start gap-3 rounded-xl bg-subtle p-4 text-sm text-muted"><LockKeyhole size={18} className="mt-0.5 shrink-0 text-brand"/><p>Browser-only analysis by default. History is optional. Paid AI is disabled. Scores are guidance, not hiring predictions or ATS certification.</p></div>
      <p className="border-t border-line pt-6 text-xs text-muted">© {new Date().getFullYear()} ResumeScore. Built for your next step.</p>
    </div>
  </footer>;
}
export default Footer;
