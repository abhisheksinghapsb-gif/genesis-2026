'use client';

import React, { useMemo } from 'react';

export interface HeroStarsProps {
  shouldAnimate: boolean;
  nearOffset?: { x: number; y: number };
  midOffset?: { x: number; y: number };
  farOffset?: { x: number; y: number };
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export const HeroStars: React.FC<HeroStarsProps> = ({
  shouldAnimate,
  nearOffset = { x: 0, y: 0 },
  midOffset = { x: 0, y: 0 },
  farOffset = { x: 0, y: 0 },
}) => {
  // Generate deterministic starfield across 3 depth layers
  const { farStars, midStars, nearStars } = useMemo(() => {
    const makeStars = (count: number, minSize: number, maxSize: number, seed: number): Star[] => {
      const stars: Star[] = [];
      for (let i = 0; i < count; i++) {
        const x = ((Math.sin(i * 997 + seed) * 10000) % 100 + 100) % 100;
        const y = ((Math.cos(i * 7919 + seed) * 10000) % 85 + 85) % 85;
        const size = minSize + (((Math.sin(i * 123 + seed) + 1) / 2) * (maxSize - minSize));
        const duration = 2.5 + (((Math.cos(i * 456 + seed) + 1) / 2) * 3.5);
        const delay = -(((Math.sin(i * 789 + seed) + 1) / 2) * 5);
        stars.push({
          id: i,
          x,
          y,
          size,
          opacity: 0.4 + (size / maxSize) * 0.6,
          duration,
          delay,
        });
      }
      return stars;
    };

    return {
      farStars: makeStars(45, 1, 2, 11),
      midStars: makeStars(28, 2, 3.5, 37),
      nearStars: makeStars(16, 3.5, 5, 83),
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Far Stars (deepest, slowest) */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{ transform: `translate3d(${farOffset.x}px, ${farOffset.y}px, 0)` }}
      >
        {farStars.map((star) => (
          <div
            key={`far-${star.id}`}
            className="absolute rounded-full bg-cyan-100"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: shouldAnimate
                ? `gentle-pulse ${star.duration}s ease-in-out infinite`
                : 'none',
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 2. Mid Stars */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{ transform: `translate3d(${midOffset.x}px, ${midOffset.y}px, 0)` }}
      >
        {midStars.map((star) => (
          <div
            key={`mid-${star.id}`}
            className="absolute rounded-full bg-white shadow-[0_0_6px_#38D4FF]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: shouldAnimate
                ? `gentle-pulse ${star.duration}s ease-in-out infinite`
                : 'none',
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 3. Near 4-point Sparkle Stars */}
      <div
        className="absolute inset-0 transition-transform duration-75 will-change-transform"
        style={{ transform: `translate3d(${nearOffset.x}px, ${nearOffset.y}px, 0)` }}
      >
        {nearStars.map((star) => (
          <div
            key={`near-${star.id}`}
            className="absolute text-cyan-200"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: star.opacity,
              animation: shouldAnimate
                ? `gentle-pulse ${star.duration}s ease-in-out infinite`
                : 'none',
              animationDelay: `${star.delay}s`,
            }}
          >
            <svg
              width={star.size * 2.5}
              height={star.size * 2.5}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-[0_0_8px_#00E5FF]"
            >
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* 4. Shooting Star Streak every 7s */}
      {shouldAnimate && (
        <div className="absolute -top-10 left-1/4 h-[2px] w-48 -rotate-45 bg-gradient-to-r from-transparent via-cyan-300 to-white shadow-[0_0_12px_#38D4FF] animate-shooting-star opacity-0" />
      )}
    </div>
  );
};
