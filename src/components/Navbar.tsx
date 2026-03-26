'use client';

import Link from 'next/link';
import { SeasonSelector } from './SeasonSelector';

export function Navbar() {
  return (
    <header className="sticky pl-48 top-0 z-50 w-full border-b border-purple-900/40 bg-[#0A0A0F]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black tracking-tighter text-white">
            SIX
            <span className="text-purple-400 group-hover:text-yellow-400 transition-colors duration-300">
              MAN
            </span>
          </span>
          <span className="hidden sm:inline-block rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-purple-300 border border-purple-500/30">
            Bench Report
          </span>
        </Link>

        {/* Nav links + Season Selector */}
        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/players"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Rankings
            </Link>
          </nav>
          <SeasonSelector />
        </div>
      </div>
    </header>
  );
}
