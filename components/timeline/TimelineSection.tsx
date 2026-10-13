'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { TimelineMilestoneModal, MilestoneItem } from './TimelineMilestoneModal';
import timelineData from '@/content/timeline.json';

// Exact coordinates for the 4 milestone slots in timeline-loop.mp4
const SLOT_STYLES = [
  'top-[7%] left-[34.2%] w-[15.6%] h-[42%]',   // 01: Top card
  'top-[60%] left-[49%] w-[15.6%] h-[40%]',    // 02: Bottom card
  'top-[7%] left-[64%] w-[15.6%] h-[42%]',    // 03: Top card
  'top-[60%] left-[83.6%] w-[15.6%] h-[40%]',  // 04: Bottom card
];

export const TimelineSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [activeModalItem, setActiveModalItem] = useState<MilestoneItem | null>(null);

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#120626] via-[#0B1A42] to-[#0A1636] px-4 py-16 text-center select-none"
      aria-label="Event Timeline"
    >
      {/* Main Video Animation Stage */}
      <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl select-none shadow-[0_0_50px_rgba(0,168,255,0.25)] border-2 border-cyan-500/30 bg-[#0B1A42]">
        {/* 16:9 Video Canvas Frame */}
        <div className="relative w-full pb-[56.25%]">
          {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping Timeline Animation */}
          <video
            src="/videos/timeline-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
          />

          {/* Accessible Header Title for Tests & Screen Readers */}
          <h2 className="sr-only">TIMELINE</h2>

          {/* Colt Brawler Trading Card Hotspot on the Left */}
          <button
            type="button"
            onClick={() => setActiveModalItem(timelineData[0] ?? null)}
            aria-label="Colt Trading Card"
            className="absolute top-[16%] left-[6.5%] w-[25%] h-[72%] z-20 cursor-pointer rounded-2xl outline-none hover:ring-2 hover:ring-yellow-400/50 transition-all"
            title="Click Colt to view Stage 01 Overview"
          />

          {/* 4 Interactive Milestone Card Hotspots */}
          {timelineData.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveModalItem(step)}
              aria-label={`View rules and venue details for ${step.title}`}
              className={`group absolute ${SLOT_STYLES[idx] ?? ''} z-20 cursor-pointer rounded-xl outline-none transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center px-1.5 py-1 text-center`}
              title={`Click to view rules and details for ${step.title}`}
            >
              {/* Visible Milestone Details inside the Card Frame */}
              <span className="font-heading text-[8px] sm:text-[10px] md:text-xs text-amber-800 uppercase tracking-wider font-extrabold">
                {step.date}
              </span>

              <h4 className="font-heading text-[10px] sm:text-xs md:text-sm lg:text-base text-[#2B1400] font-black uppercase leading-tight mt-0.5 group-hover:text-amber-900 transition-colors">
                {step.title}
              </h4>

              <p className="mt-0.5 sm:mt-1 font-body text-[8px] sm:text-[9px] md:text-[11px] font-bold text-[#573507] line-clamp-2 px-1 leading-snug">
                {step.shortDesc}
              </p>

              {/* Action Button */}
              <div className="mt-1 sm:mt-1.5 flex items-center gap-1 rounded-full border border-[#573507] bg-gradient-to-b from-amber-300 to-amber-500 px-2 py-0.5 font-heading text-[7px] sm:text-[9px] md:text-[10px] text-black uppercase shadow-sm font-bold transition-transform group-hover:scale-105">
                <span>DETAILS ℹ</span>
              </div>

              {/* Screen reader tags */}
              <span className="sr-only">{step.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessible Milestone Modal */}
      <TimelineMilestoneModal
        milestone={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
};
