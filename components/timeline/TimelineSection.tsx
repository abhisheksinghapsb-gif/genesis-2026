'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { NumberedCoin } from '@/components/ui/NumberedCoin';
import { InfoIcon } from '@/components/ui/GameIcons';
import { TimelineTradingCard } from './TimelineTradingCard';
import { TimelineMilestoneModal, MilestoneItem } from './TimelineMilestoneModal';
import timelineData from '@/content/timeline.json';

export const TimelineSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const [activeModalItem, setActiveModalItem] = useState<MilestoneItem | null>(null);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#120626] via-[#0B1A42] to-[#0A1636] px-4 py-20 text-center select-none"
      aria-label="Event Timeline"
    >
      {/* 1. Deep Space Pattern Background */}
      <WatermarkPattern opacity={0.09} animated={shouldAnimate} />

      {/* 1b. Endless Loop Video Animation Layer */}
      <video
        src="/videos/timeline-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 z-0"
      />

      {/* 2. Orange Slanted Header Banner */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <SlantedBanner title="TIMELINE" subtitle="ROADMAP TO THE GRAND ARENA" color="orange" />
      </div>

      {/* 3. Main Stage: Trading Card (Left) + Timeline Track (Right) */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        {/* Left Column: Brawler Trading Card */}
        <div className="lg:col-span-4 flex justify-center">
          <TimelineTradingCard shouldAnimate={shouldAnimate} />
        </div>

        {/* Right Column: Interactive Milestone Track */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {/* Milestone Track (Desktop horizontal grid, Mobile vertical flow) */}
          <div className="relative flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
            {/* Horizontal Golden Circuit Line on larger screens */}
            <div className="pointer-events-none hidden lg:block absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[5px] bg-gradient-to-r from-[#FFB703] via-[#FFA200] to-[#E5383B] shadow-[0_0_12px_#FFA200] z-0" />

            {timelineData.map((step) => (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
                onClick={() => setActiveModalItem(step)}
              >
                {/* Numbered Coin with glint & hover scale */}
                <div className="relative mb-3 flex items-center justify-center">
                  <NumberedCoin
                    number={step.num}
                    size="md"
                    className="group-hover:scale-110 shadow-[0_6px_0_#060B17]"
                  />
                  {/* Subtle rotating glow ring */}
                  <div className="pointer-events-none absolute inset-0 -m-1.5 rounded-full border border-yellow-300/40 animate-spin" style={{ animationDuration: '8s' }} />
                </div>

                {/* Milestone Slanted Info Card */}
                <ChamferCard variant="cream" elevation="sm" cornerSize={14}>
                  <div className="flex flex-col items-center p-1 sm:p-2">
                    <span className="font-heading text-xs text-amber-800 uppercase tracking-widest">
                      {step.date}
                    </span>

                    <h4 className="font-heading text-base sm:text-lg text-[#2B1400] mt-1 group-hover:text-amber-900 transition-colors">
                      {step.title}
                    </h4>

                    <p className="mt-1.5 font-body text-xs font-bold text-[#573507] line-clamp-2">
                      {step.shortDesc}
                    </p>

                    {/* "i" Info Button with Pulse Animation */}
                    <button
                      type="button"
                      aria-label={`View rules and venue details for ${step.title}`}
                      className="mt-3 flex items-center gap-1.5 rounded-full border-2 border-[#573507] bg-gradient-to-b from-amber-300 to-amber-500 px-3 py-1 font-heading text-[10px] text-black uppercase shadow-[0_2px_0_#000] transition-transform group-hover:scale-105 active:translate-y-0.5 animate-gentle-pulse"
                    >
                      <InfoIcon size={14} className="text-black" />
                      <span>DETAILS</span>
                    </button>
                  </div>
                </ChamferCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Accessible Milestone Modal */}
      <TimelineMilestoneModal
        milestone={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
};
