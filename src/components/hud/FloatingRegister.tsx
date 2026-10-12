'use client';

import React from 'react';
import { siteConfig } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { sound } from '@/lib/audio';

interface FloatingRegisterProps {
  currentSection: string;
  onToast: (msg: string) => void;
}

export const FloatingRegister: React.FC<FloatingRegisterProps> = ({
  currentSection,
  onToast,
}) => {
  // Appears after hero scrolls away, and hides on register section
  const visible = currentSection !== 'hero' && currentSection !== 'register';

  if (!visible) return null;

  const handleClick = () => {
    sound.playTap();
    trackEvent('register_click', { placement: 'hud' });
    if (siteConfig.registrationUrl) {
      window.open(siteConfig.registrationUrl, '_blank', 'noopener,noreferrer');
    } else {
      onToast('Registrations opening soon! Stay tuned, Brawler.');
    }
  };

  return (
    <div className="fixed bottom-14 md:bottom-6 right-4 z-40">
      <button
        onClick={handleClick}
        className="px-5 py-2.5 bg-cta-yellow hover:bg-cta-yellow-hi text-black font-display text-sm md:text-base uppercase tracking-wider border-2 border-black rounded-xl shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.7)] transform-gpu hover:scale-105 active:scale-95 transition-all -skew-x-6 animate-pulse"
        aria-label="Register for GENESIS 2026"
      >
        <span className="skew-x-6 block font-bold">REGISTER</span>
      </button>
    </div>
  );
};
