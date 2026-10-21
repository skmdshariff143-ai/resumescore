'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Menu, X, ArrowUpRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const links = [
    { href:'/', label:'Home' }, { href:'/analyze', label:'Analyze Resume' },
    { href:'/analyze?mode=job_match', label:'Job Match' }, { href:'/history', label:'Dashboard' },
  ];
  return <header className="sticky top-0 z-50 border-b border-line bg-surface">
    <nav aria-label="Main navigation" onKeyDown={event => { if(event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }} className="container-shell">
      <div className="flex h-18 items-center justify-between gap-4">
        <Link href="/" aria-label="ResumeScore home" className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white"><FileText size={20}/></span>ResumeScore
        </Link>
        <div className="hidden lg:flex items-center gap-1">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-subtle'}`}>{link.label}</Link>)}</div>
        <Link href="/analyze" className="action action-primary hidden sm:inline-flex">Get started <ArrowUpRight size={16}/></Link>
        <button ref={toggle} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-controls="mobile-navigation" aria-expanded={open} onClick={() => setOpen(!open)} className="action p-2 lg:hidden">{open ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
      {open && <div id="mobile-navigation" className="grid gap-1 border-t border-line py-3 lg:hidden">{links.map(link => <Link onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-ink hover:bg-subtle" key={link.href} href={link.href}>{link.label}</Link>)}</div>}
    </nav>
  </header>;
}
export default Navbar;
