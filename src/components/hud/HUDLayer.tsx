'use client';

import React, { useState } from 'react';
import { TrophyRoad, STATIONS } from './TrophyRoad';
import { NextPill } from './NextPill';
import { FloatingRegister } from './FloatingRegister';
import { MenuDrawerV2 } from './MenuDrawerV2';
import { CustomCursor } from '../motion/CustomCursor';
import { sound } from '@/lib/audio';

interface HUDLayerProps {
  currentSection: string;
  scrollProgress: number; // 0 to 1
  onJump: (sectionId: string) => void;
  activeOverlay?: string | null;
  onCloseOverlay?: () => void;
  onOpenBrawlerCard?: () => void;
  onToast: (msg: string) => void;
}

export const HUDLayer: React.FC<HUDLayerProps> = ({
  currentSection,
  scrollProgress,
  onJump,
  activeOverlay,
  onCloseOverlay,
  onOpenBrawlerCard,
  onToast,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const currentIdx = STATIONS.findIndex((s) => s.id === currentSection);
  const isFirst = currentIdx <= 0;

  // Smart Back Handler
  const handleSmartBack = () => {
    sound.playTap();
    // 1. If an overlay is open, close it
    if (activeOverlay && onCloseOverlay) {
      onCloseOverlay();
      return;
    }
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    // 2. Otherwise jump to previous section
    if (currentIdx > 0) {
      onJump(STATIONS[currentIdx - 1].id);
    }
  };

  const handleHome = () => {
    sound.playTap();
    if (activeOverlay && onCloseOverlay) onCloseOverlay();
    if (menuOpen) setMenuOpen(false);
    onJump('hero');
  };

  return (
    <>
      <CustomCursor />

      {/* Top 4px Progress Strip */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/40 z-[60] pointer-events-none">
        <div
          className="h-full bg-cta-yellow transition-all duration-75"
          style={{ width: `${Math.max(0, Math.min(100, scrollProgress * 100))}%` }}
        />
      </div>

      {/* Fixed Top Bar HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 py-2.5 flex items-center justify-between pointer-events-none">
        {/* Left: Smart Back and Home group */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!isFirst && (
            <button
              onClick={handleSmartBack}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-slate hover:bg-slate/90 text-white font-display text-sm sm:text-base border-2 border-black rounded-lg shadow-[0_3px_0_#000] -skew-x-6 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              aria-label="Previous Section"
            >
              <span className="skew-x-6 text-base">❮</span>
              <span className="skew-x-6 hidden xs:inline">BACK</span>
            </button>
          )}

          <button
            onClick={handleHome}
            className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-slate hover:bg-slate/90 text-white font-display text-sm sm:text-base border-2 border-black rounded-lg shadow-[0_3px_0_#000] -skew-x-6 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Jump to Home"
          >
            <span className="skew-x-6">🏠</span>
          </button>
        </div>

        {/* Center: Dynamic Active Section Indicator */}
        <div className="pointer-events-auto">
          <button
            onClick={handleHome}
            className="px-4 py-1 bg-banner-orange border-2 border-black rounded-lg shadow-[0_3px_0_#000] -skew-x-6 hover:brightness-105 transition-all"
            aria-label="GENESIS 2026 Home"
          >
            <span className="skew-x-6 font-display text-sm sm:text-base text-white tracking-wider text-outline-sm uppercase">
              {currentSection === 'hero' ? 'GENESIS' : currentSection.replace('-', ' ')}
            </span>
          </button>
        </div>

        {/* Right: Menu Hamburger Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTap();
              setMenuOpen(true);
            }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate hover:bg-slate/90 text-white font-display text-sm sm:text-base border-2 border-black rounded-lg shadow-[0_3px_0_#000] -skew-x-6 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            aria-label="Open Game Menu"
          >
            <span className="skew-x-6">☰</span>
            <span className="skew-x-6 hidden sm:inline">MENU</span>
          </button>
        </div>
      </header>

      {/* Trophy Road Navigation Rail */}
      <TrophyRoad
        currentSection={currentSection}
        scrollProgress={scrollProgress}
        onJump={onJump}
      />

      {/* Next Pill */}
      <NextPill currentSection={currentSection} onJump={onJump} />

      {/* Floating Register Pill */}
      <FloatingRegister currentSection={currentSection} onToast={onToast} />

      {/* Menu Drawer */}
      <MenuDrawerV2
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentSection={currentSection}
        onJump={onJump}
        onOpenBrawlerCard={onOpenBrawlerCard}
        onToast={onToast}
      />
    </>
  );
};
