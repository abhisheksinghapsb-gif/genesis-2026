'use client';

import React, { useState } from 'react';
import { useScrollSection } from '@/animations/useScrollSection';
import { useAudio } from '@/animations/useAudio';
import { useMotionPreference } from '@/animations/useMotionPreference';
import { GameDrawer } from './GameDrawer';
import { GameButton } from '@/components/ui/GameButton';
import { HomeIcon, MenuIcon } from '@/components/ui/GameIcons';

export const Hud: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    activeSection,
    activeSectionId,
    isHeroPassed,
    scrollProgress,
    canGoBack,
    scrollToSection,
    goBackSection,
  } = useScrollSection();

  const { isAudioEnabled, toggleAudio } = useAudio();
  const { isReducedMotion, toggleMotion } = useMotionPreference();

  return (
    <>
      {/* Global Top HUD - slides down when hero is ~60% passed */}
      <header
        role="banner"
        aria-label="Event Navigation HUD"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 pointer-events-none select-none ${
          isHeroPassed
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 md:px-6 md:py-3 pointer-events-auto">
          {/* Left: Game Back Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={goBackSection}
              disabled={!canGoBack}
              aria-label="Previous section"
              className={`flex items-center gap-1.5 rounded-xl border-[3px] border-[#3B2200] bg-gradient-to-b from-[#FFF248] via-[#FFD000] to-[#F59E0B] px-3 py-1.5 md:px-4 md:py-2 font-heading text-xs md:text-sm text-[#2B1400] uppercase shadow-[0_4px_0_#080A10] transition-transform active:translate-y-1 active:shadow-none ${
                canGoBack ? 'opacity-100 hover:scale-105' : 'opacity-40 cursor-not-allowed filter grayscale'
              }`}
            >
              <span className="text-base md:text-lg leading-none">◀</span>
              <span className="hidden sm:inline">BACK</span>
            </button>
          </div>

          {/* Center: Slanted Orange Section Banner with Flipping Title */}
          <div className="relative mx-2 flex-1 max-w-xs md:max-w-md flex justify-center">
            <div className="relative w-full max-w-[280px] md:max-w-[340px] px-4 py-1.5 md:py-2 text-center rounded-md border-2 md:border-[3px] border-[#3F1600] bg-gradient-to-b from-[#FFB340] via-[#FF7700] to-[#D95500] shadow-[0_4px_0_#080A10] [clip-path:polygon(4%_0%,_96%_0%,_100%_100%,_0%_100%)]">
              {/* Inner shine highlight */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-80" />
              <h1
                key={activeSection.id}
                className="font-heading text-sm md:text-xl lg:text-2xl tracking-wider text-white uppercase drop-shadow-[0_2px_0_#080A10] animate-gentle-pulse truncate"
              >
                {activeSection.label}
              </h1>
            </div>
          </div>

          {/* Right: Home Button + Hamburger Menu Trigger */}
          <div className="flex items-center gap-2">
            {/* Home button */}
            <button
              onClick={() => scrollToSection('home')}
              aria-label="Scroll to Home"
              className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl border-2 md:border-[3px] border-[#07244F] bg-gradient-to-b from-[#4ED8FF] via-[#00A3FF] to-[#0066CC] text-white shadow-[0_4px_0_#080A10] transition-transform hover:scale-105 active:translate-y-1 active:shadow-none"
            >
              <HomeIcon size={18} />
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={isDrawerOpen}
              className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl border-2 md:border-[3px] border-[#3B2200] bg-gradient-to-b from-[#FFF248] via-[#FFD000] to-[#F59E0B] text-[#2B1400] shadow-[0_4px_0_#080A10] transition-transform hover:scale-105 active:translate-y-1 active:shadow-none"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        {/* Thin yellow scroll-progress bar directly under the HUD */}
        <div className="h-1.5 w-full bg-[#080A10]/60">
          <div
            className="h-full bg-gradient-to-r from-[#FFD000] via-[#FF8800] to-[#FF3B6B] transition-all duration-100 ease-out shadow-[0_0_8px_#FFD000]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Sticky Register Pill on Mobile after Hero */}
      <div
        className={`fixed bottom-4 inset-x-4 z-40 md:hidden transition-all duration-300 ${
          isHeroPassed && activeSectionId !== 'register'
            ? 'translate-y-0 opacity-100'
            : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <GameButton
          variant="yellow"
          size="md"
          fullWidth
          onClick={() => scrollToSection('register')}
          className="shadow-[0_6px_0_#080A10]"
        >
          ⚡ REGISTER FOR GENESIS
        </GameButton>
      </div>

      {/* Navigation Game Drawer Modal */}
      <GameDrawer
        isOpen={isDrawerOpen}
        activeSectionId={activeSectionId}
        isAudioEnabled={isAudioEnabled}
        isReducedMotion={isReducedMotion}
        onClose={() => setIsDrawerOpen(false)}
        onSelectSection={scrollToSection}
        onToggleAudio={toggleAudio}
        onToggleMotion={toggleMotion}
      />
    </>
  );
};
