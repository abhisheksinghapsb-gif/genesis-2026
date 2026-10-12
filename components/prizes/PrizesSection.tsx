'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { PrizeShieldCard, RewardItem } from './PrizeShieldCard';
import prizesData from '@/content/prizes.json';

export const PrizesSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const [isMainCollapsed, setIsMainCollapsed] = useState<boolean>(false);
  const [isVrCollapsed, setIsVrCollapsed] = useState<boolean>(false);

  return (
    <section
      id="prizes"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1636] via-[#0D1F52] to-[#0A183C] px-4 py-20 text-center select-none"
      aria-label="Prize Pool"
    >
      {/* 1. Deep Space Pattern Background */}
      <WatermarkPattern opacity={0.08} animated={shouldAnimate} />

      {/* 2. Orange Slanted Header Banner */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <SlantedBanner
          title="PRIZE POOL"
          subtitle="TOTAL CASH REWARDS • ₹60,000 INR"
          color="orange"
        />
      </div>

      {/* 3. Main Stage: Two Collapsible Track Panels */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* Panel 1: Main Gaming Championship */}
        <div className="relative w-full rounded-2xl border-[3px] sm:border-4 border-[#071733] bg-[#0E2042] p-2.5 sm:p-4 shadow-2xl">
          {/* Header Bar with Red Collapse X / Chevron Toggle */}
          <div className="flex items-center justify-between border-b-2 border-[#1E3B75] pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border-2 border-[#092B60] bg-gradient-to-r from-[#00A8FF] to-[#0066CC] px-3 py-1 font-heading text-xs text-white uppercase shadow-[0_2px_0_#061A3A]">
                {prizesData.mainTrack.tierTag}
              </span>
              <h3 className="font-heading text-lg sm:text-2xl text-white drop-shadow-[0_2px_0_#000]">
                {prizesData.mainTrack.title}
              </h3>
            </div>

            <button
              onClick={() => setIsMainCollapsed(!isMainCollapsed)}
              aria-label={isMainCollapsed ? 'Expand Main Gaming panel' : 'Collapse Main Gaming panel'}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#080A10] transition-transform active:translate-y-0.5"
            >
              {isMainCollapsed ? (
                <span className="font-heading text-lg leading-none">▼</span>
              ) : (
                <CloseXIcon size={16} />
              )}
            </button>
          </div>

          {/* Panel Content (Shields) */}
          {!isMainCollapsed && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {prizesData.mainTrack.rewards.map((reward) => (
                <PrizeShieldCard
                  key={reward.rank}
                  reward={reward as RewardItem}
                  shouldAnimate={shouldAnimate}
                />
              ))}
            </div>
          )}
        </div>

        {/* Panel 2: VR Track Arena */}
        <div className="relative w-full rounded-2xl border-[3px] sm:border-4 border-[#071733] bg-[#0E2042] p-2.5 sm:p-4 shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#1E3B75] pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border-2 border-[#064E3B] bg-gradient-to-r from-[#10B981] to-[#047857] px-3 py-1 font-heading text-xs text-white uppercase shadow-[0_2px_0_#022C22]">
                {prizesData.vrTrack.tierTag}
              </span>
              <h3 className="font-heading text-lg sm:text-2xl text-white drop-shadow-[0_2px_0_#000]">
                {prizesData.vrTrack.title}
              </h3>
            </div>

            <button
              onClick={() => setIsVrCollapsed(!isVrCollapsed)}
              aria-label={isVrCollapsed ? 'Expand VR Track panel' : 'Collapse VR Track panel'}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#080A10] transition-transform active:translate-y-0.5"
            >
              {isVrCollapsed ? (
                <span className="font-heading text-lg leading-none">▼</span>
              ) : (
                <CloseXIcon size={16} />
              )}
            </button>
          </div>

          {/* Panel Content (Shields) */}
          {!isVrCollapsed && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
              {prizesData.vrTrack.rewards.map((reward) => (
                <PrizeShieldCard
                  key={reward.rank}
                  reward={reward as RewardItem}
                  shouldAnimate={shouldAnimate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
