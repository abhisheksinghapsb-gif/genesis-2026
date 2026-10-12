'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface TimelineTradingCardProps {
  shouldAnimate: boolean;
}

export const TimelineTradingCard: React.FC<TimelineTradingCardProps> = ({ shouldAnimate }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="relative flex items-center justify-center select-none perspective-[1000px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Tilting Card Container */}
      <div
        className={`relative z-10 transition-transform duration-150 ease-out will-change-transform ${
          shouldAnimate && !isHovered ? 'animate-gentle-float' : ''
        }`}
        style={{
          transform: isHovered
            ? `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.05)`
            : 'rotateY(0deg) rotateX(0deg) scale(1)',
          animationDuration: '5.5s',
        }}
      >
        {/* Glow halo behind card */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-cyan-400/20 to-purple-500/20 blur-xl pointer-events-none" />

        {/* Card Artwork Image */}
        <div className="relative h-[360px] w-[260px] sm:h-[440px] sm:w-[320px] rounded-3xl overflow-hidden border-[4px] border-[#3F2000] bg-gradient-to-b from-[#132A5E] to-[#081229] shadow-[0_12px_24px_rgba(0,0,0,0.9)]">
          <Image
            src="/img/timeline/trading-card.webp"
            alt="Genesis Brawler Trading Card"
            fill
            sizes="(max-width: 640px) 260px, 320px"
            className="object-cover object-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          />

          {/* Holographic foil shine sweep overlay */}
          <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine-sweep opacity-70" />

          {/* Stopwatch spinning second hand indicator in bottom corner */}
          <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-yellow-400 bg-black/75 shadow-[0_0_8px_#FFD000]">
            <span
              className="h-3 w-0.5 rounded-full bg-amber-300 origin-bottom animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>

          {/* Cash Bills flutter tag in top corner */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-lg border-2 border-[#3F1600] bg-gradient-to-r from-[#FFB703] to-[#FB8500] px-2 py-0.5 font-heading text-[10px] text-black uppercase shadow-[0_2px_0_#000]">
            <span>💰 CASH PRIZES</span>
          </div>
        </div>
      </div>
    </div>
  );
};
