'use client';

import React, { useState } from 'react';
import { Window } from '../ui/Window';
import { Badge } from '../ui/Badge';
import { Tilt3D } from '../motion/Tilt3D';
import { CountUp } from '../motion/CountUp';
import { ScreenShake } from '../motion/ScreenShake';
import { StarBurst } from '../motion/StarBurst';
import { NpcDialogBubble } from '../ui/NpcDialogBubble';
import { prizePool } from '@/content/prizes';
import { sound } from '@/lib/audio';

interface PrizeSceneProps {
  scrollProgress?: number;
}

export const PrizeScene: React.FC<PrizeSceneProps> = ({ scrollProgress = 0 }) => {
  const [shaking, setShaking] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [prizesCollapsed, setPrizesCollapsed] = useState(false);
  const [vrCollapsed, setVrCollapsed] = useState(false);

  const mainTrack = prizePool.find((t) => t.id === 'main');
  const vrTrack = prizePool.find((t) => t.id === 'vr');

  const totalPrizeAmount = prizePool.reduce(
    (acc, track) => acc + track.prizes.reduce((sum, p) => sum + p.amount, 0),
    0
  );

  const handleBadgeHover = () => {
    sound.playTap();
  };

  const handleBadgeClick = (rank: number) => {
    if (rank === 1) {
      sound.playSlam();
      setShaking(true);
      setBurstActive(true);
      setTimeout(() => setShaking(false), 220);
    } else {
      sound.playPop();
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Title Header */}
      <div className="relative z-20 text-center mb-4">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
          PRIZE POOL
        </h2>
        {/* Total Prize Pool Dynamic Counter */}
        <div className="mt-2 inline-flex items-center gap-2 px-6 py-2 bg-black/60 border-2 border-cta-yellow rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          <span className="font-display text-sm sm:text-base text-cta-yellow tracking-wider">
            TOTAL POOL:
          </span>
          <span className="font-display text-lg sm:text-2xl text-white font-bold tracking-widest text-outline-sm">
            <CountUp end={totalPrizeAmount} prefix="₹" formatThousands />
          </span>
        </div>
      </div>

      {/* Main Content: Both Windows Visible */}
      <ScreenShake active={shaking} className="relative max-w-[1240px] mx-auto w-full z-10 space-y-6 md:space-y-8 flex-1">
        {/* 1. Main Track Window (PRIZES) */}
        {mainTrack && (
          <Window
            title={mainTrack.title}
            isCollapsed={prizesCollapsed}
            onToggleCollapse={() => {
              sound.playTap();
              setPrizesCollapsed(!prizesCollapsed);
            }}
          >
            <div className="py-4 sm:py-6 px-2 flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 relative">
              <StarBurst active={burstActive} onComplete={() => setBurstActive(false)} />

              {mainTrack.prizes.map((prize) => {
                const isFirst = prize.rank === 1;

                return (
                  <div
                    key={prize.rank}
                    onMouseEnter={handleBadgeHover}
                    onClick={() => handleBadgeClick(prize.rank)}
                    className="relative cursor-pointer transition-transform hover:scale-108 active:scale-95"
                  >
                    {/* Rotating Conic Light Rays for 1st Place */}
                    {isFirst && (
                      <div className="absolute -inset-10 pointer-events-none opacity-35 animate-ray-fan z-0">
                        <svg viewBox="0 0 200 200" className="w-full h-full text-cta-yellow">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="10 15" />
                        </svg>
                      </div>
                    )}

                    <Tilt3D maxTilt={10}>
                      <Badge
                        rank={prize.rank}
                        label={prize.rank === 1 ? '1ST' : prize.rank === 2 ? '2ND' : '3RD'}
                        amount={prize.amount}
                      />
                    </Tilt3D>
                  </div>
                );
              })}
            </div>
          </Window>
        )}

        {/* 2. VR Track Window (VR TRACK) */}
        {vrTrack && (
          <Window
            title={vrTrack.title}
            isCollapsed={vrCollapsed}
            onToggleCollapse={() => {
              sound.playTap();
              setVrCollapsed(!vrCollapsed);
            }}
          >
            <div className="py-4 sm:py-6 px-2 flex flex-wrap items-center justify-center gap-8 sm:gap-16 md:gap-24">
              {vrTrack.prizes.map((prize) => (
                <div
                  key={prize.rank}
                  onMouseEnter={handleBadgeHover}
                  onClick={() => handleBadgeClick(prize.rank)}
                  className="cursor-pointer transition-transform hover:scale-108 active:scale-95"
                >
                  <Tilt3D maxTilt={10}>
                    <Badge
                      rank={prize.rank}
                      label={prize.rank === 1 ? '1ST' : '2ND'}
                      amount={prize.amount}
                    />
                  </Tilt3D>
                </div>
              ))}
            </div>
          </Window>
        )}
      </ScreenShake>

      {/* NPC Dialogue Bubble */}
      <div className="mt-8 self-start max-w-lg z-20">
        <NpcDialogBubble
          avatar="villager"
          characterName="CHIEF BRAWLER"
          dialogue="WIN LOOT BIG ENOUGH TO MAKE THE ENTIRE LOBBY JEALOUS!"
          position="left"
        />
      </div>
    </div>
  );
};
