'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Banner } from './Banner';
import { useNavigation } from '@/context/NavigationContext';

interface TopBarProps {
  title?: string;
  showBanner?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = '',
  showBanner = true,
}) => {
  const { goBack, openMenu } = useNavigation();
  const [isCompact, setIsCompact] = useState(false);

  // Compact mode after ~48px of scroll (Section 3.1)
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 48);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-start justify-between px-0 sm:px-4 md:px-6 pt-0 pointer-events-none transition-transform duration-200 origin-top ${
        isCompact ? 'scale-90' : 'scale-100'
      }`}
      style={{
        height: 'calc(var(--topbar-h, 72px) + env(safe-area-inset-top, 0px))',
      }}
    >
      {/* Back Tab - Flush with top and left edges */}
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="pointer-events-auto btn-3d-slate w-[56px] sm:w-[90px] md:w-[130px] h-[48px] sm:h-[60px] md:h-[68px] flex items-center justify-center cursor-pointer select-none rounded-none rounded-br-md -ml-1 -mt-1 active:translate-y-1"
      >
        <span className="transform skew-x-[8deg] flex items-center gap-1 sm:gap-2 text-white font-display text-sm sm:text-base md:text-xl">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white stroke-[4] drop-shadow-[0_2px_0_#000]"
          >
            <path d="M 15 19 L 8 12 L 15 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden sm:inline">BACK</span>
        </span>
      </button>

      {/* Title Banner - Positioned top-center */}
      {showBanner && title ? (
        <div className="pointer-events-auto flex justify-center flex-1 mx-1 sm:mx-2 pt-2 sm:pt-3 md:pt-4 max-w-[min(48vw,420px)] sm:max-w-none">
          <Banner title={title} />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right Cluster: [Home] + [Menu] (Section 3.2) */}
      <div className="pointer-events-auto flex items-start -mr-1 -mt-1">
        {/* Home Tab */}
        <Link
          href="/"
          aria-label="Home"
          className="btn-3d-slate w-[48px] sm:w-[68px] md:w-[84px] h-[48px] sm:h-[60px] md:h-[68px] flex items-center justify-center cursor-pointer select-none rounded-none active:translate-y-1"
        >
          <span className="transform skew-x-[8deg] flex items-center justify-center text-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-[0_2px_0_#000]"
            >
              <path d="M 12 3 L 2 12 L 5 12 L 5 20 L 10 20 L 10 14 L 14 14 L 14 20 L 19 20 L 19 12 L 22 12 Z" />
            </svg>
          </span>
        </Link>

        {/* Menu Tab */}
        <button
          type="button"
          onClick={openMenu}
          aria-label="Menu"
          className="btn-3d-orange w-[52px] sm:w-[76px] md:w-[94px] h-[48px] sm:h-[60px] md:h-[68px] flex items-center justify-center cursor-pointer select-none rounded-none rounded-bl-md active:translate-y-1 ml-0.5"
        >
          <span className="transform skew-x-[8deg] flex items-center justify-center text-white font-display text-sm sm:text-base md:text-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-white stroke-[3.5] drop-shadow-[0_2px_0_#000]"
            >
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};
