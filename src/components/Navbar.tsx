'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/history', label: 'History' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/10 shadow-lg shadow-black/20'
          : 'bg-white/5'
      } backdrop-blur-xl border-b border-white/10`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
            ✨
          </span>
          <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            ResumeScore
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}

                  {/* animated underline */}
                  <span
                    className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              mobileOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
              mobileOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* ── Mobile menu panel ── */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          mobileOpen ? 'max-h-60 border-t border-white/10' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3" role="list">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
