'use client';

import React from 'react';
import Link from 'next/link';
import { site } from '@/content/site';
import { trackEvent } from '@/lib/analytics';

interface FooterProps {
  onRegisterClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRegisterClick }) => {
  const handleRegister = () => {
    trackEvent({ name: 'register_click', placement: 'footer' });
    if (onRegisterClick) {
      onRegisterClick();
    } else if (site.registrationUrl && site.registrationUrl.startsWith('https://')) {
      window.open(site.registrationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <footer className="w-full mt-auto py-8 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 bg-[#002787]/80 text-white/90 text-sm select-none z-20">
      <div className="flex items-center gap-3 font-body font-medium flex-wrap">
        <span>© {site.year} {site.club} · {site.college}</span>
        <span className="text-white/40">·</span>
        <Link href="/privacy" className="text-white/80 hover:text-cta-yellow underline underline-offset-2 text-xs">
          Privacy Policy
        </Link>
      </div>

      {/* Social links (if configured and not TODO) */}
      <div className="flex items-center gap-4">
        {site.socials
          .filter((s) => !s.url.includes('TODO'))
          .map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cta-yellow transition-colors font-medium hover:underline"
            >
              {s.label}
            </a>
          ))}
      </div>

      {/* Compact Yellow Register Pill */}
      <button
        type="button"
        onClick={handleRegister}
        className="btn-3d-yellow px-5 py-2 text-black font-display font-bold text-sm tracking-wider rounded-sm cursor-pointer"
      >
        <span className="transform skew-x-[8deg] drop-shadow-none">
          REGISTER
        </span>
      </button>
    </footer>
  );
};
