'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface HeroPlanetsProps {
  shouldAnimate: boolean;
  midOffset?: { x: number; y: number };
}

export const HeroPlanets: React.FC<HeroPlanetsProps> = ({
  shouldAnimate,
  midOffset = { x: 0, y: 0 },
}) => {
  const [isWobbling, setIsWobbling] = useState(false);

  const handlePlanetClick = () => {
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 800);
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Ringed Planet (Top Right) */}
      <div
        className="pointer-events-auto absolute right-4 top-16 md:right-16 md:top-20 z-10 transition-transform duration-100 will-change-transform cursor-pointer"
        style={{
          transform: `translate3d(${midOffset.x * 0.7}px, ${midOffset.y * 0.7}px, 0)`,
        }}
        onClick={handlePlanetClick}
      >
        <div
          className={`relative h-28 w-28 md:h-44 md:w-44 transition-transform ${
            isWobbling ? 'animate-bounce' : shouldAnimate ? 'animate-gentle-float' : ''
          }`}
          style={{ animationDuration: '6.5s' }}
        >
          <Image
            src="/img/hero/ringed-planet.webp"
            alt="Ringed Planet"
            fill
            sizes="(max-width: 768px) 112px, 176px"
            className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,180,255,0.35)] hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* 2. Small Orb 1 (Top Left) */}
      <div
        className={`absolute left-8 top-28 md:left-24 md:top-36 h-8 w-8 md:h-12 md:w-12 rounded-full bg-gradient-to-tr from-[#00A8FF] to-[#38D4FF] shadow-[0_0_15px_#00A8FF] ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '5.2s', animationDelay: '-1.8s' }}
      />

      {/* 3. Small Orb 2 (Mid Right) */}
      <div
        className={`absolute right-12 top-1/2 md:right-32 md:top-1/3 h-6 w-6 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-[#9B4AEB] to-[#D946EF] shadow-[0_0_15px_#D946EF] ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '7.8s', animationDelay: '-3.2s' }}
      />

      {/* 4. Small Orb 3 (Bottom Center Left) - Hidden on mobile */}
      <div
        className={`hidden md:block absolute left-1/4 bottom-32 h-7 w-7 rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FFDE00] shadow-[0_0_15px_#FFB703] ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '8.4s', animationDelay: '-4.5s' }}
      />
    </div>
  );
};
