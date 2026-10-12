'use client';

import React from 'react';
import Image from 'next/image';

export interface HeroTelescopeProps {
  shouldAnimate: boolean;
  nearOffset?: { x: number; y: number };
}

export const HeroTelescope: React.FC<HeroTelescopeProps> = ({
  shouldAnimate,
  nearOffset = { x: 0, y: 0 },
}) => {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 z-20 w-[42vw] max-w-[340px] select-none transition-transform duration-100 will-change-transform"
      style={{
        transform: `translate3d(${nearOffset.x * 0.6}px, ${nearOffset.y * 0.6}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div
        className={`relative aspect-[350/340] w-full transition-transform ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '7.2s' }}
      >
        <Image
          src="/img/hero/telescope.webp"
          alt="Observatory Telescope"
          fill
          sizes="(max-width: 768px) 40vw, 340px"
          className="object-contain object-bottom-left filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
        />

        {/* Lens Glint every ~7s */}
        <div className="absolute left-[38%] top-[28%] h-4 w-4 rounded-full bg-cyan-200 shadow-[0_0_12px_#38D4FF] animate-ping opacity-75" />
      </div>
    </div>
  );
};
