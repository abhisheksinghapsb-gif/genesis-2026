'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Window } from '../ui/Window';
import { Tilt3D } from '../motion/Tilt3D';
import { StarBurst } from '../motion/StarBurst';
import { ShineSweep } from '../motion/ShineSweep';
import { sponsors } from '@/content/sponsors';
import { sound } from '@/lib/audio';

interface SponsorsSceneProps {
  scrollProgress?: number;
}

export const SponsorsScene: React.FC<SponsorsSceneProps> = ({ scrollProgress = 0 }) => {
  const [unlocked, setUnlocked] = useState(true);
  const [burstActive, setBurstActive] = useState(false);
  const [titleCollapsed, setTitleCollapsed] = useState(false);
  const [platformCollapsed, setPlatformCollapsed] = useState(false);

  const titleSponsor = sponsors.find((s) => s.id === 'title');
  const platformSponsor = sponsors.find((s) => s.id === 'platform');

  const handleSponsorClick = (url?: string) => {
    sound.playTap();
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Title Header */}
      <div className="relative z-20 text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
          SPONSORS
        </h2>
      </div>

      {/* Main Content: Staggered Diagonal Windows */}
      <div className="relative max-w-[1240px] mx-auto w-full z-10 flex-1 flex flex-col justify-center space-y-8 lg:space-y-12">
        <StarBurst active={burstActive} onComplete={() => setBurstActive(false)} />

        {/* 1. Title Sponsors Window (Top Left Stagger) */}
        {titleSponsor && (
          <div className="w-full lg:max-w-[700px] lg:self-start">
            <Window
              title={titleSponsor.title}
              isCollapsed={titleCollapsed}
              onToggleCollapse={() => {
                sound.playTap();
                setTitleCollapsed(!titleCollapsed);
              }}
              infoUrl={titleSponsor.sponsors[0]?.url}
            >
              <div className="p-4 sm:p-6 flex items-center justify-center">
                <div className="w-full max-w-[560px] bg-[#0B4BBE] p-4 sm:p-6 rounded-2xl border-2 border-black/50 shadow-inner flex items-center justify-center">
                  {titleSponsor.sponsors.map((company) => (
                    <Tilt3D key={company.name} maxTilt={8} className="w-full">
                      <div
                        onClick={() => handleSponsorClick(company.url)}
                        className="relative w-full bg-[#D9D9D9] hover:bg-[#ECECEC] p-6 sm:p-8 rounded-2xl border-[3.5px] border-black shadow-[0_12px_24px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer transition-all hover:scale-102"
                      >
                        <ShineSweep />
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={440}
                          height={140}
                          className="max-h-[80px] sm:max-h-[110px] w-auto object-contain filter contrast-105 animate-float"
                          priority
                        />
                      </div>
                    </Tilt3D>
                  ))}
                </div>
              </div>
            </Window>
          </div>
        )}

        {/* 2. Platform Sponsors Window (Bottom Right Stagger) */}
        {platformSponsor && (
          <div className="w-full lg:max-w-[700px] lg:self-end">
            <Window
              title={platformSponsor.title}
              isCollapsed={platformCollapsed}
              onToggleCollapse={() => {
                sound.playTap();
                setPlatformCollapsed(!platformCollapsed);
              }}
              infoUrl={platformSponsor.sponsors[0]?.url}
            >
              <div className="p-4 sm:p-6 flex items-center justify-center">
                <div className="w-full max-w-[560px] bg-[#0B4BBE] p-4 sm:p-6 rounded-2xl border-2 border-black/50 shadow-inner flex items-center justify-center">
                  {platformSponsor.sponsors.map((company) => (
                    <Tilt3D key={company.name} maxTilt={8} className="w-full">
                      <div
                        onClick={() => handleSponsorClick(company.url)}
                        className="relative w-full bg-[#D9D9D9] hover:bg-[#ECECEC] p-6 sm:p-8 rounded-2xl border-[3.5px] border-black shadow-[0_12px_24px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer transition-all hover:scale-102"
                      >
                        <ShineSweep />
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={440}
                          height={140}
                          className="max-h-[80px] sm:max-h-[110px] w-auto object-contain filter contrast-105 animate-float-slow"
                          priority
                        />
                      </div>
                    </Tilt3D>
                  ))}
                </div>
              </div>
            </Window>
          </div>
        )}
      </div>
    </div>
  );
};
