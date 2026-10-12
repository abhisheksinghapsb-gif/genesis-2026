'use client';

import React, { useState, useMemo } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { MemoriesLightbox, type MemoryItem } from './MemoriesLightbox';
import memoryData from '@/content/memories.json';

const ALL_MEMORIES = memoryData as MemoryItem[];

export const MemoriesSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Filter memories based on selected year
  const filteredMemories = useMemo(() => {
    if (selectedYear === 'ALL') return ALL_MEMORIES;
    return ALL_MEMORIES.filter((m) => m.year === selectedYear);
  }, [selectedYear]);

  // Split filtered memories into two rows for the double marquee
  const { row1, row2 } = useMemo(() => {
    const r1: MemoryItem[] = [];
    const r2: MemoryItem[] = [];
    filteredMemories.forEach((item, idx) => {
      if (idx % 2 === 0) {
        r1.push(item);
      } else {
        r2.push(item);
      }
    });
    // Ensure both rows have items even if few
    if (r2.length === 0 && r1.length > 0) {
      return { row1: r1, row2: r1 };
    }
    return { row1: r1, row2: r2 };
  }, [filteredMemories]);

  // Duplicate items for continuous seamless marquee loops
  const marqueeRow1 = useMemo(() => [...row1, ...row1, ...row1], [row1]);
  const marqueeRow2 = useMemo(() => [...row2, ...row2, ...row2], [row2]);

  const activeItem = activeItemIndex !== null ? (filteredMemories[activeItemIndex] ?? null) : null;

  const handlePrev = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) =>
      prev === null ? 0 : (prev - 1 + filteredMemories.length) % filteredMemories.length,
    );
  };

  const handleNext = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) =>
      prev === null ? 0 : (prev + 1) % filteredMemories.length,
    );
  };

  return (
    <section
      id="memories"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A183C] via-[#10193E] to-[#0A1128] py-20 select-none"
      aria-label="Event Memories Gallery"
    >
      <WatermarkPattern opacity={0.07} animated={shouldAnimate} />

      {/* Floating Sparkles & Background Icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute top-1/4 left-[8%] text-3xl opacity-20 animate-gentle-float">
          🎮
        </span>
        <span className="absolute top-2/3 right-[10%] text-3xl opacity-20 animate-gentle-float" style={{ animationDelay: '-2s' }}>
          ⭐
        </span>
        <span className="absolute bottom-1/4 left-[15%] text-2xl opacity-20 animate-gentle-float" style={{ animationDelay: '-1.5s' }}>
          🏆
        </span>
      </div>

      {/* Section Header */}
      <div className="relative z-10 mb-8 flex flex-col items-center px-4">
        <SlantedBanner
          title="MEMORIES"
          subtitle="GDXR ARCHIVES • PREVIOUS EDITIONS"
          color="orange"
        />

        {/* Year Filter Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {['ALL', '2025', '2024', '2023'].map((year) => {
            const isActive = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`rounded-xl border-[2.5px] px-4 py-1.5 font-heading text-xs sm:text-sm tracking-wider uppercase transition-all ${
                  isActive
                    ? 'border-[#7A3E00] bg-gradient-to-b from-[#FFDE00] to-[#FF8A00] text-black shadow-[0_4px_0_#4D2600] scale-105'
                    : 'border-[#173063] bg-[#0A1A3A] text-sky-200 shadow-[0_3px_0_#050C1B] hover:border-cyan-400 hover:text-white active:translate-y-0.5'
                }`}
              >
                {year === 'ALL' ? 'ALL EDITIONS' : `GENESIS ${year}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marquee Living Galleries Container */}
      <div className="relative z-10 flex w-full flex-col gap-6 overflow-hidden py-4">
        {/* Row 1: Leftwards Marquee */}
        <div className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className={`flex shrink-0 items-center gap-6 ${
              shouldAnimate ? 'animate-marquee-left group-hover:[animation-play-state:paused]' : ''
            }`}
          >
            {marqueeRow1.map((item, idx) => {
              const originalIndex = filteredMemories.findIndex((m) => m.id === item.id);
              return (
                <button
                  key={`${item.id}-r1-${idx}`}
                  type="button"
                  onClick={() => setActiveItemIndex(originalIndex >= 0 ? originalIndex : 0)}
                  className="group/card relative flex h-48 w-72 sm:h-56 sm:w-80 shrink-0 -rotate-1.5 flex-col overflow-hidden rounded-2xl border-4 border-[#0B1D40] bg-gradient-to-b from-[#132A5C] via-[#0E2047] to-[#08132B] p-3 text-left shadow-[0_6px_0_#050B17] transition-all duration-300 hover:z-20 hover:scale-105 hover:rotate-0 hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(0,168,255,0.5)] active:translate-y-1"
                >
                  {/* Subtle Card Glow / Ambient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.colorGradient} opacity-40 transition-opacity group-hover/card:opacity-70`}
                  />

                  {/* Inner Frame */}
                  <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-xl border border-cyan-400/20 bg-slate-950/60 p-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-heading text-[10px] text-amber-300 uppercase">
                        {item.category}
                      </span>
                      <span className="font-heading text-xs text-sky-300">
                        {item.edition}
                      </span>
                    </div>

                    {/* Bottom Title & Caption */}
                    <div>
                      <h4 className="font-heading text-lg sm:text-xl text-white group-hover/card:text-amber-300 transition-colors drop-shadow">
                        {item.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 font-body text-xs font-bold text-sky-200">
                        {item.caption}
                      </p>
                    </div>

                    {/* Hover Hint */}
                    <div className="flex items-center justify-between border-t border-cyan-900/40 pt-2 font-heading text-[10px] text-cyan-400">
                      <span>AIT PUNE</span>
                      <span className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                        CLICK TO EXPAND ↗
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Rightwards Marquee */}
        <div className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div
            className={`flex shrink-0 items-center gap-6 ${
              shouldAnimate ? 'animate-marquee-right group-hover:[animation-play-state:paused]' : ''
            }`}
          >
            {marqueeRow2.map((item, idx) => {
              const originalIndex = filteredMemories.findIndex((m) => m.id === item.id);
              return (
                <button
                  key={`${item.id}-r2-${idx}`}
                  type="button"
                  onClick={() => setActiveItemIndex(originalIndex >= 0 ? originalIndex : 0)}
                  className="group/card relative flex h-48 w-72 sm:h-56 sm:w-80 shrink-0 rotate-1.5 flex-col overflow-hidden rounded-2xl border-4 border-[#0B1D40] bg-gradient-to-b from-[#132A5C] via-[#0E2047] to-[#08132B] p-3 text-left shadow-[0_6px_0_#050B17] transition-all duration-300 hover:z-20 hover:scale-105 hover:rotate-0 hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(0,168,255,0.5)] active:translate-y-1"
                >
                  {/* Subtle Card Glow / Ambient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.colorGradient} opacity-40 transition-opacity group-hover/card:opacity-70`}
                  />

                  {/* Inner Frame */}
                  <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-xl border border-cyan-400/20 bg-slate-950/60 p-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-heading text-[10px] text-amber-300 uppercase">
                        {item.category}
                      </span>
                      <span className="font-heading text-xs text-sky-300">
                        {item.edition}
                      </span>
                    </div>

                    {/* Bottom Title & Caption */}
                    <div>
                      <h4 className="font-heading text-lg sm:text-xl text-white group-hover/card:text-amber-300 transition-colors drop-shadow">
                        {item.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 font-body text-xs font-bold text-sky-200">
                        {item.caption}
                      </p>
                    </div>

                    {/* Hover Hint */}
                    <div className="flex items-center justify-between border-t border-cyan-900/40 pt-2 font-heading text-[10px] text-cyan-400">
                      <span>AIT PUNE</span>
                      <span className="opacity-0 group-hover/card:opacity-100 transition-opacity">
                        CLICK TO EXPAND ↗
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <MemoriesLightbox
        isOpen={activeItemIndex !== null}
        item={activeItem}
        currentIndex={activeItemIndex ?? 0}
        totalCount={filteredMemories.length}
        onClose={() => setActiveItemIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};
