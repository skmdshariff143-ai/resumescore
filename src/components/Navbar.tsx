'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  History,
  Shield,
  Menu,
  X,
  ArrowRight,
  Activity,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/analyze', label: 'Analyze', icon: FileText },
    { href: '/history', label: 'Dashboard & History', icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#080C14]/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Career Signal Badge */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-slate-100 tracking-tight">ResumeScore</span>
              <span className="text-[10px] text-blue-400 font-mono block -mt-1 font-bold">Career Signal AI</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-800">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center ${
                    isActive
                      ? 'bg-slate-800/80 text-blue-300 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 mr-1.5 text-blue-400/80" />}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="hidden sm:flex items-center space-x-3">
          <div className="inline-flex items-center text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
            <Shield className="w-3 h-3 mr-1.5" />
            Local Data Privacy
          </div>

          <Link
            href="/analyze"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0F1A] border-b border-slate-800 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {link.icon && <link.icon className="w-4 h-4 mr-2 text-blue-400" />}
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-blue-600/30"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
