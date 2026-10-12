'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface HeroBadgeProps {
  shouldAnimate: boolean;
}

interface Particle {
  id: number;
  angle: number;
  speed: number;
  size: number;
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({ shouldAnimate }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleBadgeClick = () => {
    // Star burst explosion on click
    const newParticles: Particle[] = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 14) * 360,
      speed: Math.random() * 60 + 40,
      size: Math.random() * 8 + 8,
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none my-2">
      {/* Click Burst Particles */}
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * p.speed;
        const ty = Math.sin(rad) * p.speed;
        return (
          <div
            key={p.id}
            className="pointer-events-none absolute z-30 text-amber-300 transition-all duration-700 ease-out"
            style={{
              transform: `translate3d(${tx}px, ${ty}px, 0) scale(0)`,
              opacity: 0,
            }}
          >
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        );
      })}

      {/* Main Winged Badge Container */}
      <button
        type="button"
        onClick={handleBadgeClick}
        aria-label="Genesis Emblem — click for star burst"
        className={`group relative flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95 ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
      >
        {/* Glow halo behind crest */}
        <div className="absolute h-36 w-36 md:h-52 md:w-52 rounded-full bg-cyan-400/25 blur-2xl animate-gentle-pulse pointer-events-none" />

        {/* Extracted Badge Image */}
        <div className="relative z-10 h-28 w-48 sm:h-36 sm:w-64 md:h-44 md:w-80">
          <Image
            src="/img/hero/winged-badge.webp"
            alt="GENESIS Crest Badge"
            fill
            priority
            sizes="(max-width: 768px) 256px, 320px"
            className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] group-hover:brightness-110"
          />

          {/* Periodic metallic shine sweep across the badge */}
          <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-sweep opacity-75" />
        </div>
      </button>
    </div>
  );
};
