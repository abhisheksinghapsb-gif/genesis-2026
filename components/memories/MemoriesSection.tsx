'use client';

import React, { useState, useMemo } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { MemoriesLightbox, type MemoryItem } from './MemoriesLightbox';
import memoryData from '@/content/memories.json';

const ALL_MEMORIES = memoryData as MemoryItem[];

export const MemoriesSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  // Filter memories based on selected year
  const filteredMemories = useMemo(() => {
    if (selectedYear === 'ALL') return ALL_MEMORIES;
    return ALL_MEMORIES.filter((m) => m.year === selectedYear);
  }, [selectedYear]);

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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A183C] via-[#10193E] to-[#0A1128] text-center select-none scroll-mt-16 pt-12 md:pt-14"
      aria-label="Event Memories Gallery"
    >
      {/* Edge-to-Edge Video Animation Stage (like innerve.tech) */}
      <div className="relative w-full aspect-[16/9] min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#10193E]">
        {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping Memories Animation */}
        <video
          src="/videos/memories-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
        />

          {/* Accessible Header Title for Tests & Screen Readers */}
          <h2 className="sr-only">MEMORIES</h2>

          {/* Year Filter Chips Overlay Bar */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-[90%]">
            {['ALL', '2025', '2024', '2023'].map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`rounded-lg border-[2px] px-2.5 py-1 sm:px-3 sm:py-1.5 font-heading text-[10px] sm:text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 ${
                    isActive
                      ? 'border-[#7A3E00] bg-gradient-to-b from-[#FFDE00] to-[#FF8A00] text-black shadow-[0_2px_0_#4D2600] scale-105 font-bold'
                      : 'border-[#173063] bg-[#0A1A3A]/85 text-sky-200 hover:border-cyan-400 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  {year === 'ALL' ? 'ALL EDITIONS' : `GENESIS ${year}`}
                </button>
              );
            })}
          </div>

          {/* Interactive Central Polaroid Hotspot */}
          <button
            type="button"
            onClick={() => setActiveItemIndex(0)}
            aria-label="View featured festival memories gallery"
            className="absolute top-[32%] left-[38%] w-[24%] h-[46%] z-20 cursor-pointer rounded-lg outline-none hover:scale-105 active:scale-95 transition-transform"
            title="Click to explore full memory archive"
          >
            <div className="pointer-events-none opacity-0 hover:opacity-100 transition-opacity bg-amber-500 text-black font-heading text-[10px] px-2 py-0.5 rounded-full shadow-lg font-bold">
              OPEN ARCHIVE 📸
            </div>
          </button>

          {/* Interactive Memory Card Buttons for Filtered Items */}
          <div className="sr-only">
            {filteredMemories.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItemIndex(idx)}
                aria-label={`Open memory: ${item.title}`}
              >
                <span>{item.edition}</span>
                <span>{item.title}</span>
                <span>{item.category}</span>
                <span>{item.caption}</span>
              </button>
            ))}
          </div>
        </div>

      {/* Accessible Fullscreen Lightbox Modal */}
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
