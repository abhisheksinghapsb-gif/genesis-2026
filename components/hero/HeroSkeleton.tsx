import React from 'react';
import { GameButton } from '@/components/ui/GameButton';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const HeroSkeleton: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#060D24] via-[#0A163B] to-[#0D1F52] px-4 text-center"
      aria-label="Genesis 2026 Hero"
    >
      <WatermarkPattern opacity={0.12} animated />

      {/* Hero Content Container */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center justify-center">
        {/* Edition Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-yellow-400/40 bg-yellow-500/10 px-4 py-1 font-heading text-xs tracking-widest text-amber-300 uppercase shadow-inner">
          <span className="h-2 w-2 rounded-full bg-yellow-400 animate-ping" />
          5TH EDITION • GDXR CLUB AIT PUNE
        </div>

        {/* Chunky GENESIS 2026 Title */}
        <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white uppercase drop-shadow-[0_8px_0_#070A12] stroke-black select-none">
          GENESIS <span className="text-[#FFB703]">2026</span>
        </h1>

        <p className="mt-3 max-w-xl font-body text-base md:text-xl font-bold text-sky-200 drop-shadow-[0_2px_0_#000]">
          The Ultimate Flagship Gaming & Virtual Reality Experience.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <GameButton variant="yellow" size="xl" href="#register">
            REGISTER YOUR SQUAD
          </GameButton>
          <GameButton variant="blue" size="xl" href="#timeline">
            EXPLORE TIMELINE
          </GameButton>
        </div>
      </div>
    </section>
  );
};
