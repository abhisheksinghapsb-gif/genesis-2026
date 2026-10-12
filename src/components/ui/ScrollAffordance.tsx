'use client';

import React, { useState, useEffect } from 'react';

export const ScrollAffordance: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // Only show if page content exceeds viewport height by at least 80px and user is near top
      const isOverflowing = scrollHeight > clientHeight + 80;
      const atTop = scrollTop < 50;

      setShow(isOverflowing && atTop);
    };

    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    const timer = setTimeout(checkScroll, 400);

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Bottom Fade Gradient */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-black/70 to-transparent z-30 transition-opacity duration-300"
      />

      {/* Floating Scroll Chip */}
      <button
        onClick={() => {
          window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
        }}
        aria-label="Scroll down for more content"
        className="fixed bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-40 bg-panel-header hover:bg-panel-header-bevel-light active:scale-95 border-2 border-black rounded-full px-4 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.7)] flex items-center gap-1.5 cursor-pointer font-display text-white text-xs sm:text-sm tracking-widest uppercase text-outline-sm select-none transition-all duration-200 animate-bounce motion-reduce:animate-none"
      >
        <span aria-hidden="true" className="text-cta-yellow">▼</span>
        <span>MORE</span>
      </button>
    </>
  );
};
