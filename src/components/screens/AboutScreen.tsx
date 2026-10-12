'use client';

import React from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { about } from '@/content/about';

const aboutTransforms = [
  { dy: '-4px', rot: '-3deg' }, // A
  { dy: '2px', rot: '2deg' },   // B
  { dy: '-5px', rot: '-2deg' }, // O
  { dy: '3px', rot: '3deg' },   // U
  { dy: '-2px', rot: '-3deg' }, // T
];

const genesisTransforms = [
  { dy: '-3px', rot: '-2deg' }, // G
  { dy: '3px', rot: '2deg' },   // E
  { dy: '-5px', rot: '-3deg' }, // N
  { dy: '2px', rot: '3deg' },   // E
  { dy: '-4px', rot: '-2deg' }, // S
  { dy: '1px', rot: '2deg' },   // I
  { dy: '-4px', rot: '3deg' },  // S
];

export const AboutScreen: React.FC = () => {
  return (
    <div className="relative min-h-[100dvh] bg-[#01072B] flex flex-col justify-between overflow-x-hidden select-none">
      {/* Pinned Top Bar with Back and Home tabs (no banner) */}
      <TopBar showBanner={false} />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 pt-2 md:pt-4 pb-12 flex flex-col lg:flex-row items-center lg:items-start justify-between z-10">
        {/* Left Column: Stacked Title + Cream Card */}
        <div className="relative w-full lg:w-[680px] xl:w-[720px] flex flex-col z-20 mt-2 sm:mt-4">
          {/* Accessible Hidden H1 */}
          <h1 className="sr-only">{about.title}</h1>

          {/* Outlined Stacked Bouncy Title: "ABOUT" over "GENESIS" */}
          <div className="relative z-30 mb-[-36px] sm:mb-[-44px] md:mb-[-52px] ml-4 sm:ml-8 pointer-events-none">
            {/* "ABOUT" in --title-red (#D80A0B) */}
            <div className="flex items-center text-[52px] sm:text-[76px] md:text-[98px] font-display font-black leading-none">
              {'ABOUT'.split('').map((char, idx) => {
                const trans = aboutTransforms[idx % aboutTransforms.length];
                return (
                  <span
                    key={idx}
                    className="inline-block transform"
                    style={{
                      transform: `translateY(${trans.dy}) rotate(${trans.rot})`,
                      color: 'var(--title-red)',
                      WebkitTextStroke: '8px #000000',
                      paintOrder: 'stroke fill',
                      textShadow: '0 8px 0 #000000',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* "GENESIS" in --wordmark-grey (#D9D9D9) */}
            <div className="flex items-center text-[56px] sm:text-[84px] md:text-[108px] font-display font-black leading-none -mt-3 sm:-mt-5">
              {'GENESIS'.split('').map((char, idx) => {
                const trans = genesisTransforms[idx % genesisTransforms.length];
                return (
                  <span
                    key={idx}
                    className="inline-block transform"
                    style={{
                      transform: `translateY(${trans.dy}) rotate(${trans.rot})`,
                      color: 'var(--wordmark-grey)',
                      WebkitTextStroke: '9px #000000',
                      paintOrder: 'stroke fill',
                      textShadow: '0 10px 0 #000000',
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Chamfered Cream Card (§3.3) */}
          <div className="chamfer-outer w-full shadow-[0_16px_40px_rgba(0,0,0,0.8)] animate-popIn">
            <div className="chamfer-inner p-6 sm:p-10 md:p-12 text-black font-body">
              <div className="space-y-6 pt-10 sm:pt-14 md:pt-16">
                {about.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-lg md:text-[22px] lg:text-[24px] font-extrabold leading-[1.3] text-black tracking-normal"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Art (Robot Astronomer + Holographic Planets) */}
        <div className="relative w-full lg:w-[620px] xl:w-[680px] h-[340px] sm:h-[480px] md:h-[620px] lg:h-[780px] flex items-center justify-center lg:justify-end mt-8 lg:mt-0 z-10">
          <div className="relative w-full h-full animate-float">
            <Image
              src="/art/about-hero.webp"
              alt="GENESIS Robot Astronomer projecting holographic planetary orbits"
              fill
              className="object-contain object-center lg:object-right drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
              priority
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
