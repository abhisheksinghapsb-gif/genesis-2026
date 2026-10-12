'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GameButton } from '@/components/ui/GameButton';

export const FooterSection: React.FC = () => {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunchRocket = () => {
    setIsLaunching(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsLaunching(false);
    }, 1500);
  };

  const handleDownloadBrochure = () => {
    // Demo brochure trigger: creates a friendly prompt or link
    const blob = new Blob(
      [
        `GENESIS 2026 — 5th EDITION RULEBOOK & BROCHURE\nGDXR Club, Army Institute of Technology, Pune\n\nDates: 12-13 December 2026\nTracks: Main Esports LAN (BGMI, Valorant, FIFA) + VR Track (Meta Quest 3)\nPrize Pool: ₹50,000 Total Pool\nEligibility: University students with valid credentials\nOfficial Contact: gdxr@aitpune.edu.in`,
      ],
      { type: 'text/plain' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GENESIS_2026_OFFICIAL_RULEBOOK.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer
      className="relative w-full border-t-[6px] border-[#071329] bg-gradient-to-b from-[#0A1738] via-[#060D24] to-[#040817] px-4 pt-16 pb-12 text-center select-none"
      aria-label="Event Footer"
    >
      {/* Decorative Wooden/Plank Header Border */}
      <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-48 rounded-full border-2 border-amber-500/40 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 shadow-[0_4px_12px_rgba(255,170,0,0.4)]" />

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10">
        {/* Top Section: Brand & Festival Info */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-4 py-1 font-heading text-xs text-cyan-300">
            <span>AR / VR & ESPORTS EXTRAVAGANZA</span>
          </div>
          <h2 className="mt-3 font-heading text-3xl sm:text-4xl md:text-5xl tracking-wider text-white drop-shadow-[0_4px_0_#000]">
            GENESIS <span className="text-amber-400">2026</span>
          </h2>
          <p className="mt-2 max-w-xl font-body text-xs sm:text-sm font-bold text-sky-200">
            The 5th edition of Army Institute of Technology&apos;s premier AR/VR and competitive gaming
            festival. Hosted with pride by the <strong>GDXR (Game Dev & Extended Reality) Club</strong>.
          </p>
        </div>

        {/* Action Row: Rulebook Download & Back to Top Rocket */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <GameButton
            variant="yellow"
            size="md"
            onClick={handleDownloadBrochure}
            aria-label="Download Official Event Rulebook and Brochure"
          >
            📄 RULEBOOK / BROCHURE
          </GameButton>

          {/* Blast-Off Rocket Button */}
          <button
            onClick={handleLaunchRocket}
            type="button"
            title="Launch Back to Top"
            aria-label="Launch back to top of page"
            className="group relative flex items-center gap-2 rounded-2xl border-4 border-[#071733] bg-gradient-to-b from-[#00A8FF] to-[#0055AA] px-5 py-3 font-heading text-sm text-white shadow-[0_6px_0_#040914] transition-all hover:scale-105 active:translate-y-1"
          >
            <span
              className={`text-xl transition-all duration-700 ${
                isLaunching
                  ? '-translate-y-16 scale-150 opacity-0'
                  : 'group-hover:-translate-y-1'
              }`}
            >
              🚀
            </span>
            <span>BACK TO TOP</span>
            <span
              className={`absolute -bottom-2 left-6 text-sm transition-opacity duration-300 ${
                isLaunching ? 'opacity-100 animate-ping' : 'opacity-0'
              }`}
            >
              🔥
            </span>
          </button>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-heading text-xs tracking-widest text-amber-300 uppercase">
            CONNECT WITH GDXR CLUB
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'DISCORD', href: 'https://discord.gg/aitpune', icon: '💬' },
              { name: 'INSTAGRAM', href: 'https://instagram.com/gdxr_ait', icon: '📸' },
              { name: 'LINKEDIN', href: 'https://linkedin.com/company/gdxr-club', icon: '💼' },
              { name: 'GITHUB', href: 'https://github.com/gdxr-ait', icon: '🐙' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 rounded-xl border-2 border-[#152B58] bg-[#07132B] px-3.5 py-1.5 font-heading text-xs text-sky-200 shadow-[0_3px_0_#040917] transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:text-white"
              >
                <span>{social.icon}</span>
                <span>{social.name}</span>
                <span className="text-[10px] text-cyan-400 opacity-60 group-hover:opacity-100">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Nav Anchor Links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-heading text-xs tracking-wider text-sky-300"
          aria-label="Footer Navigation"
        >
          <Link href="#home" className="hover:text-amber-300 transition-colors">HOME</Link>
          <Link href="#about" className="hover:text-amber-300 transition-colors">ABOUT</Link>
          <Link href="#timeline" className="hover:text-amber-300 transition-colors">TIMELINE</Link>
          <Link href="#prizes" className="hover:text-amber-300 transition-colors">PRIZES</Link>
          <Link href="#sponsors" className="hover:text-amber-300 transition-colors">SPONSORS</Link>
          <Link href="#memories" className="hover:text-amber-300 transition-colors">MEMORIES</Link>
          <Link href="#faq" className="hover:text-amber-300 transition-colors">FAQS</Link>
          <Link href="#register" className="hover:text-amber-300 transition-colors">REGISTER</Link>
        </nav>

        {/* Copyright & Technical Accreditations */}
        <div className="border-t border-[#122247] pt-6 flex flex-col items-center gap-1.5 text-[11px] font-body text-slate-400">
          <div>
            © 2026 <strong>GDXR Club, Army Institute of Technology, Pune</strong>. All rights reserved.
          </div>
          <div>
            Built with Next.js, Tailwind CSS, TypeScript & Three.js. Visual theme inspired by Supercell Brawl Stars.
          </div>
        </div>
      </div>
    </footer>
  );
};
