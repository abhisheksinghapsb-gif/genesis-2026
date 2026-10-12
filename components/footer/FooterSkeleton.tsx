import React from 'react';
import Link from 'next/link';

export const FooterSkeleton: React.FC = () => {
  return (
    <footer
      className="relative w-full border-t-4 border-[#071329] bg-[#040814] px-4 py-12 text-center select-none"
      aria-label="Event Footer"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <span className="font-heading text-3xl tracking-wider text-white drop-shadow-[0_2px_0_#000]">
            GENESIS <span className="text-amber-400">2026</span>
          </span>
          <p className="mt-1 font-body text-xs md:text-sm font-bold text-sky-300/80">
            5th Edition AR/VR & Gaming Festival • GDXR Club, Army Institute of Technology, Pune
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-heading text-xs tracking-wider text-amber-300">
          <Link href="#home" className="hover:text-white transition-colors">HOME</Link>
          <Link href="#about" className="hover:text-white transition-colors">ABOUT</Link>
          <Link href="#timeline" className="hover:text-white transition-colors">TIMELINE</Link>
          <Link href="#prizes" className="hover:text-white transition-colors">PRIZES</Link>
          <Link href="#sponsors" className="hover:text-white transition-colors">SPONSORS</Link>
          <Link href="#memories" className="hover:text-white transition-colors">MEMORIES</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQS</Link>
          <Link href="#register" className="hover:text-white transition-colors">REGISTER</Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-body text-slate-500">
          © 2026 GDXR Club, AIT Pune. All rights reserved. Game UI art inspired by Brawl Stars.
        </div>
      </div>
    </footer>
  );
};
