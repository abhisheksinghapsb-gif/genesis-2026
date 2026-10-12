'use client';

import React from 'react';
import Image from 'next/image';

export interface HeroCrateProps {
  shouldAnimate: boolean;
  nearOffset?: { x: number; y: number };
}

export const HeroCrate: React.FC<HeroCrateProps> = ({
  shouldAnimate,
  nearOffset = { x: 0, y: 0 },
}) => {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 z-20 w-[40vw] max-w-[340px] select-none transition-transform duration-100 will-change-transform"
      style={{
        transform: `translate3d(${nearOffset.x * 0.6}px, ${nearOffset.y * 0.6}px, 0)`,
      }}
      aria-hidden="true"
    >
      <div
        className={`relative aspect-[350/330] w-full transition-transform ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '6.8s', animationDelay: '-2.5s' }}
      >
        <Image
          src="/img/hero/crate.webp"
          alt="Planet Storage Crate"
          fill
          sizes="(max-width: 768px) 40vw, 340px"
          className="object-contain object-bottom-right filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
        />
      </div>
    </div>
  );
};
