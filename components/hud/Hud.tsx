'use client';

import React, { useState } from 'react';
import { useScrollSection } from '@/animations/useScrollSection';
import { useAudio } from '@/animations/useAudio';
import { useMotionPreference } from '@/animations/useMotionPreference';
import { GameDrawer } from './GameDrawer';
import { GameButton } from '@/components/ui/GameButton';
import { MenuIcon } from '@/components/ui/GameIcons';

export const Hud: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    activeSectionId,
    isHeroPassed,
    scrollProgress,
    scrollToSection,
  } = useScrollSection();

  const { isAudioEnabled, toggleAudio } = useAudio();
  const { isReducedMotion, toggleMotion } = useMotionPreference();

  const navLinks = [
    { id: 'about', label: 'ABOUT' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'prizes', label: 'PRIZES' },
    { id: 'sponsors', label: 'SPONSORS' },
    { id: 'memories', label: 'MEMORIES' },
    { id: 'faq', label: 'FAQS' },
  ];

  return (
    <>
      {/* Sleek Top Navigation Bar (Innerve.tech style) */}
      <header
        role="banner"
        aria-label="Game HUD"
        className="fixed top-0 inset-x-0 z-50 select-none bg-[#080A12]/90 backdrop-blur-md border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all duration-300 pointer-events-auto"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 md:px-8 md:py-2.5">
          {/* Left: Brand Logo / Event Badge */}
          <button
            onClick={() => scrollToSection('home')}
            aria-label="Scroll to Home"
            className="group flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[#FFD000] bg-gradient-to-b from-[#FFF248] via-[#FFD000] to-[#F59E0B] shadow-[0_2px_0_#080A10]">
              <span className="font-heading text-base font-black text-[#2B1400]">G</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading text-sm md:text-base font-black tracking-wider text-white drop-shadow-[0_2px_0_#000] group-hover:text-[#FFD000] transition-colors">
                GENESIS <span className="text-[#FFD000]">2026</span>
              </span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">
                GDAI TECH FEST
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = activeSectionId === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-3.5 py-1.5 font-heading text-xs xl:text-sm font-bold tracking-wider uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-[#FFD000] drop-shadow-[0_0_8px_rgba(255,208,0,0.6)]'
                      : 'text-[#E2E8F0] hover:text-[#FFD000] hover:drop-shadow-[0_0_6px_rgba(255,208,0,0.4)]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#FFD000] to-[#FF8800] rounded-full shadow-[0_0_6px_#FFD000]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Register CTA + Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection('register')}
              aria-label="Register for Genesis"
              className="relative overflow-hidden rounded-xl border-2 border-[#3B2200] bg-gradient-to-b from-[#FFF248] via-[#FFD000] to-[#F59E0B] px-3.5 py-1.5 md:px-5 md:py-2 font-heading text-xs md:text-sm font-black text-[#2B1400] uppercase shadow-[0_3px_0_#080A10] transition-all hover:scale-105 active:translate-y-0.5 active:shadow-none"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>⚡</span>
                <span>REGISTER</span>
              </span>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-80" />
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-expanded={isDrawerOpen}
              className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl border-2 border-white/20 bg-[#161B2E] text-white shadow-[0_2px_0_#080A10] transition-transform hover:scale-105 hover:border-[#FFD000] active:translate-y-0.5"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        {/* Thin scroll-progress indicator line directly under navbar */}
        <div className="h-[2px] w-full bg-white/5">
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
