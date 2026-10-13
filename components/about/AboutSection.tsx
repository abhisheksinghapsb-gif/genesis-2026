'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { useParallax } from '@/animations/useParallax';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { AboutRobot } from './AboutRobot';
import { AboutHoloPlanets } from './AboutHoloPlanets';
import { AboutCrowd } from './AboutCrowd';

export const AboutSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const parallax = useParallax();
  const [speedBoost, setSpeedBoost] = useState(false);

  const handleRobotScan = () => {
    setSpeedBoost(true);
    setTimeout(() => setSpeedBoost(false), 2000);
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1A44] via-[#21093E] to-[#120626] px-4 py-16 text-center select-none"
      aria-label="About Genesis 2026"
    >
      {/* 1. Dynamic Nebula & Glass Dome Ambient Aura with slow hue drift */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          transform: `translate3d(${parallax.farX * 0.4}px, ${parallax.farY * 0.4}px, 0)`,
        }}
        aria-hidden="true"
      >
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-[#FF5400]/25 to-[#9D4EDD]/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-gradient-to-tl from-[#9D4EDD]/30 to-[#38D4FF]/20 blur-3xl" />
      </div>

      {/* 1b. Endless Loop Video Animation Layer */}
      <video
        src="/videos/about-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 z-0"
      />

      {/* 2. Section Header: Red ABOUT + Grey GENESIS */}
      <div className="relative z-20 mb-8 flex flex-col items-center">
        <div className="flex items-center justify-center gap-3">
          <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#FF2A55] tracking-wide uppercase drop-shadow-[0_6px_0_#070A12] stroke-black">
            ABOUT
          </span>
          <span className="font-heading text-4xl sm:text-6xl md:text-7xl text-slate-300 tracking-wide uppercase drop-shadow-[0_6px_0_#070A12] stroke-black">
            GENESIS
          </span>
        </div>
        <p className="mt-1 font-heading text-xs sm:text-sm text-amber-300 tracking-widest uppercase">
          THE 5TH EDITION AR/VR & GAMING ODYSSEY
        </p>
      </div>

      {/* 3. Main Stage: Two-Column Responsive Layout (Art on top on Mobile, side-by-side on Desktop) */}
      <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Desktop) / Bottom (Mobile): Cream Chamfered Card */}
        <div
          className="order-2 lg:order-1 lg:col-span-6 w-full text-left transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(${parallax.nearX * 0.3}px, ${parallax.nearY * 0.3}px, 0)`,
          }}
        >
          <ChamferCard variant="cream" elevation="lg" cornerSize={18}>
            <div className="flex flex-col gap-4 p-2 sm:p-4">
              <div className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#E52E2E] animate-ping" />
                <span className="font-heading text-xs tracking-widest text-[#B81335] uppercase">
                  OFFICIAL BRIEFING • ARENA CALL
                </span>
              </div>

              {/* Exact card text with glowing yellow keywords */}
              <p className="font-body text-base sm:text-lg md:text-xl font-extrabold text-[#261706] leading-relaxed">
                Brawlers, gear up! The{' '}
                <span className="rounded bg-yellow-400 px-1 py-0.5 text-black font-black shadow-[0_2px_0_#000] inline-block animate-pulse">
                  GDXR Club
                </span>{' '}
                is dropping into the arena with the Fifth Edition of{' '}
                <span className="rounded bg-yellow-400 px-1 py-0.5 text-black font-black shadow-[0_2px_0_#000] inline-block animate-pulse">
                  GENESIS 2026
                </span>{' '}
                and this time, the battle is closer to home than ever!
              </p>

              <p className="font-body text-sm sm:text-base font-bold text-[#4D2E07] leading-relaxed">
                After the last showdown in 2025, GENESIS is back, bigger and bolder. This isn&apos;t
                just about pixels, code, or pressing buttons. It&apos;s about unleashing your inner{' '}
                <span className="rounded bg-yellow-400 px-1 py-0.5 text-black font-black shadow-[0_2px_0_#000] inline-block animate-pulse">
                  Brawler
                </span>
                , teaming up, showing off your skills, and turning your passion for gaming into an
                epic real-world showdown.
              </p>

              <p className="font-heading text-base sm:text-lg text-[#B81335] tracking-wide uppercase pt-2 border-t-2 border-[#CCA66E]/50">
                Lock and load, Brawlers. It&apos;s time to make history!
              </p>
            </div>
          </ChamferCard>
        </div>

        {/* Right Column (Desktop) / Top (Mobile): Robot Brawler on Podium with Orbiting Holo Planets */}
        <div
          className="order-1 lg:order-2 lg:col-span-6 relative flex flex-col items-center justify-center transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(${parallax.midX * 0.5}px, ${parallax.midY * 0.5}px, 0)`,
          }}
        >
          {/* Orbiting Holo Planets with speed boost trigger */}
          <AboutHoloPlanets speedBoost={speedBoost} />

          {/* Robot Brawler Hero Figure */}
          <AboutRobot shouldAnimate={shouldAnimate} onScanTrigger={handleRobotScan} />
        </div>
      </div>

      {/* 4. Cheering Crowd Silhouettes along the Bottom Edge */}
      <AboutCrowd shouldAnimate={shouldAnimate} />
    </section>
  );
};
