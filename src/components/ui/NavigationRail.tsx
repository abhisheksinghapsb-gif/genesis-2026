'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button3D } from './Button3D';
import { useNavigation } from '@/context/NavigationContext';

interface RailItem {
  path: string;
  label: string;
}

const railOrder: RailItem[] = [
  { path: '/about', label: 'ABOUT' },
  { path: '/timeline', label: 'TIMELINE' },
  { path: '/prize-pool', label: 'PRIZE POOL' },
  { path: '/memories', label: 'MEMORIES' },
  { path: '/sponsors', label: 'SPONSORS' },
  { path: '/faqs', label: 'FAQS' },
];

interface NavigationRailProps {
  onRegisterClick?: () => void;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({ onRegisterClick }) => {
  const pathname = usePathname()?.replace(/\/$/, '') || '';
  const { openMenu } = useNavigation();

  const currentIndex = railOrder.findIndex((item) => item.path === pathname);
  if (currentIndex === -1) return null;

  const prevItem =
    currentIndex === 0
      ? { path: '/', label: 'HOME' }
      : railOrder[currentIndex - 1];

  const nextItem =
    currentIndex === railOrder.length - 1
      ? null
      : railOrder[currentIndex + 1];

  return (
    <nav
      aria-label="Screen sequence navigation"
      className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 z-20"
    >
      {/* Previous Screen Tab */}
      <Link
        href={prevItem.path}
        aria-label={`Previous: ${prevItem.label}`}
        className="btn-3d-slate px-4 sm:px-6 py-2.5 text-xs sm:text-sm md:text-base flex items-center gap-2 rounded-sm cursor-pointer select-none"
      >
        <span className="transform skew-x-[8deg] flex items-center gap-2">
          <span>◀</span>
          <span>{prevItem.label}</span>
        </span>
      </Link>

      {/* Quick Menu Pill */}
      <button
        type="button"
        onClick={openMenu}
        aria-label="Quick menu"
        className="hidden sm:flex text-white/60 hover:text-white font-display text-xs tracking-wider uppercase transition-colors"
      >
        ••• MENU •••
      </button>

      {/* Next Screen Tab (or REGISTER on last screen) */}
      {nextItem ? (
        <Link
          href={nextItem.path}
          aria-label={`Next: ${nextItem.label}`}
          className="btn-3d-slate px-4 sm:px-6 py-2.5 text-xs sm:text-sm md:text-base flex items-center gap-2 rounded-sm cursor-pointer select-none"
        >
          <span className="transform skew-x-[8deg] flex items-center gap-2">
            <span>{nextItem.label}</span>
            <span>▶</span>
          </span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={onRegisterClick}
          aria-label="Register for Genesis 2026"
          className="btn-3d-yellow px-5 sm:px-8 py-2.5 text-sm sm:text-base md:text-lg flex items-center gap-2 rounded-sm cursor-pointer select-none"
        >
          <span className="transform skew-x-[8deg] flex items-center gap-2">
            <span>REGISTER</span>
            <span>★</span>
          </span>
        </button>
      )}
    </nav>
  );
};
