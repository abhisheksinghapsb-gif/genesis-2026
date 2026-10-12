'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Banner } from './Banner';

interface TopBarProps {
  title?: string;
  showBanner?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = '',
  showBanner = true,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 w-full flex items-start justify-between px-0 sm:px-4 md:px-6 pt-0 pointer-events-none">
      {/* Back Tab - Flush with top and left edges */}
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="pointer-events-auto btn-3d-slate w-[72px] sm:w-[110px] md:w-[145px] h-[52px] sm:h-[64px] md:h-[72px] flex items-center justify-center cursor-pointer select-none rounded-none rounded-br-md -ml-2 -mt-1"
      >
        <span className="transform skew-x-[8deg] flex items-center gap-1 sm:gap-2 text-white font-display text-sm sm:text-base md:text-xl">
          {/* White Chevron */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white stroke-[4] drop-shadow-[0_2px_0_#000]"
          >
            <path d="M 15 19 L 8 12 L 15 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Title Banner - Positioned top-center */}
      {showBanner && title && (
        <div className="pointer-events-auto flex justify-center flex-1 mx-2 pt-3 sm:pt-4 md:pt-5">
          <Banner title={title} />
        </div>
      )}

      {/* Home Tab - Flush with top and right edges */}
      <Link
        href="/"
        aria-label="Home"
        className="pointer-events-auto btn-3d-slate w-[72px] sm:w-[110px] md:w-[145px] h-[52px] sm:h-[64px] md:h-[72px] flex items-center justify-center cursor-pointer select-none rounded-none rounded-bl-md -mr-2 -mt-1"
      >
        <span className="transform skew-x-[8deg] flex items-center gap-1 sm:gap-2 text-white font-display text-sm sm:text-base md:text-xl">
          {/* White House Icon */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white drop-shadow-[0_2px_0_#000]"
          >
            <path d="M 12 3 L 3 10 L 5 10 L 5 20 L 10 20 L 10 14 L 14 14 L 14 20 L 19 20 L 19 10 L 21 10 Z" />
          </svg>
        </span>
      </Link>
    </header>
  );
};
