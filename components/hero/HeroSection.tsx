'use client';

import React from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { useParallax } from '@/animations/useParallax';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { GameButton } from '@/components/ui/GameButton';
import { HeroStars } from './HeroStars';
import { HeroBadge } from './HeroBadge';
import { HeroPlanets } from './HeroPlanets';
import { HeroCountdown } from './HeroCountdown';
import { HeroTelescope } from './HeroTelescope';
import { HeroCrate } from './HeroCrate';

const TITLE_LETTERS = ['G', 'E', 'N', 'E', 'S', 'I', 'S'];

export const HeroSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const parallax = useParallax();

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#030716] via-[#071330] to-[#0A1A44] px-4 pt-12 pb-16 text-center select-none"
      aria-label="Genesis 2026 Hero"
    >
      {/* 1. Seamless Diagonal Tiling Watermark Pattern */}
      <WatermarkPattern opacity={0.12} animated={shouldAnimate} />

      {/* 2. 3-Depth Starfield with Shooting Stars */}
      <HeroStars
        shouldAnimate={shouldAnimate}
        farOffset={{ x: parallax.farX, y: parallax.farY }}
        midOffset={{ x: parallax.midX, y: parallax.midY }}
        nearOffset={{ x: parallax.nearX, y: parallax.nearY }}
      />

      {/* 3. Big Pale-Blue Moon Dome (Background Depth) */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 will-change-transform"
        style={{
          transform: `translate3d(calc(-50% + ${parallax.farX * 0.5}px), calc(-50% + ${parallax.farY * 0.5}px), 0)`,
        }}
        aria-hidden="true"
      >
        <div
          className={`h-[70vw] w-[70vw] max-h-[720px] max-w-[720px] rounded-full bg-gradient-to-b from-[#A8E2FF]/35 via-[#38A5FF]/15 to-transparent blur-2xl ${
            shouldAnimate ? 'animate-gentle-pulse' : ''
          }`}
          style={{ animationDuration: '6.2s' }}
        />
      </div>

      {/* 4. Ringed Planet and Floating Orbs */}
      <HeroPlanets
        shouldAnimate={shouldAnimate}
        midOffset={{ x: parallax.midX, y: parallax.midY }}
      />

      {/* 5. Center Hero Content Stage */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(${parallax.midX * 0.4}px, ${parallax.midY * 0.4}px, 0)`,
        }}
      >
        {/* Edition Subtitle Tag */}
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 px-4 py-1 font-heading text-xs sm:text-sm tracking-widest text-amber-300 uppercase shadow-inner">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
          5TH EDITION • GDXR CLUB AIT PUNE
        </div>

        {/* Winged Star-Skull Crest Badge */}
        <HeroBadge shouldAnimate={shouldAnimate} />

        {/* Staggered Animated Title Letters (G-E-N-E-S-I-S) */}
        <h1 className="relative mt-1 mb-2 flex items-center justify-center gap-1 sm:gap-2">
          {TITLE_LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={`inline-block font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase drop-shadow-[0_8px_0_#070A12] stroke-black ${
                shouldAnimate ? 'animate-gentle-float' : ''
              }`}
              style={{
                animationDuration: '3.6s',
                animationDelay: `${index * 0.12 - 2}s`,
              }}
            >
              {letter}
            </span>
          ))}
          <span className="ml-2 inline-block font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#FFB703] uppercase drop-shadow-[0_8px_0_#070A12] stroke-black animate-gentle-pulse">
            2026
          </span>
        </h1>

        {/* Live Countdown & Entrants Counter */}
        <HeroCountdown />

        {/* Register CTA Button with Tactile Physics and Shine Pulse */}
        <div className="mt-4 flex w-full flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <GameButton
            variant="yellow"
            size="xl"
            href="#register"
            className="w-full sm:w-auto shadow-[0_9px_0_#070A12] hover:scale-105 animate-gentle-pulse"
          >
            ⚡ REGISTER YOUR SQUAD
          </GameButton>
          <GameButton
            variant="blue"
            size="xl"
            href="#about"
            className="w-full sm:w-auto shadow-[0_9px_0_#070A12] hover:scale-105"
          >
            ENTER THE ARENA
          </GameButton>
        </div>
      </div>

      {/* 6. Foreground Living Scenery Props */}
      <HeroTelescope
        shouldAnimate={shouldAnimate}
        nearOffset={{ x: parallax.nearX, y: parallax.nearY }}
      />
      <HeroCrate
        shouldAnimate={shouldAnimate}
        nearOffset={{ x: parallax.nearX, y: parallax.nearY }}
      />

      {/* 7. Curved Observatory Floor Line */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#02050D] to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
};
