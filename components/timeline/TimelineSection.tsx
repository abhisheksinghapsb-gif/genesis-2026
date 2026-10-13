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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#120626] via-[#0B1A42] to-[#0A1636] text-center select-none scroll-mt-16 pt-12 md:pt-14"
      aria-label="Event Timeline"
    >
      {/* Edge-to-Edge Video Animation Stage (like innerve.tech) */}
      <div className="relative w-full aspect-[16/9] min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0B1A42]">
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

        {/* 4 Interactive Milestone Card Hotspots - Clean Hitboxes over 3D Rotating Video Cards */}
        {timelineData.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveModalItem(step)}
            aria-label={`View rules and venue details for ${step.title}`}
            className={`group absolute ${SLOT_STYLES[idx] ?? ''} z-20 cursor-pointer rounded-xl outline-none hover:ring-2 hover:ring-yellow-400/50 hover:bg-yellow-400/5 transition-all`}
            title={`Click to view rules and venue details for Stage ${step.num}: ${step.title}`}
          >
            {/* Unique screen reader tag for exact step.num testing & accessibility */}
            <span className="sr-only">{step.num}</span>
          </button>
        ))}
      </div>

      {/* Stage Schedule HUD: Clean Details Card Grid On Side / Bottom */}
      <div className="mx-auto mt-6 w-full max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {timelineData.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveModalItem(step)}
              className="group relative flex flex-col text-left rounded-xl border-2 border-cyan-500/30 bg-[#0B1A42]/90 backdrop-blur-md p-3.5 shadow-lg transition-all hover:border-yellow-400 hover:scale-[1.02] active:scale-[0.98] outline-none"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md bg-yellow-400/20 px-2 py-0.5 font-heading text-[11px] font-black text-yellow-300 border border-yellow-400/40">
                  PHASE {step.num}
                </span>
                <span className="font-heading text-xs text-cyan-300 font-bold">
                  {step.date}
                </span>
              </div>
              <h3 className="font-heading text-sm text-white font-black uppercase mt-2 group-hover:text-yellow-300 transition-colors">
                {step.title}
              </h3>
              <p className="font-body text-xs text-sky-200/80 mt-1 line-clamp-2 leading-relaxed">
                {step.shortDesc}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-heading text-yellow-400 font-bold">
                <span className="text-slate-400">📍 {step.venue}</span>
                <span className="group-hover:translate-x-1 transition-transform">DETAILS ▶</span>
              </div>
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
