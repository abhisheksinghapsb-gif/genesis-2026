import React from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const MemoriesSkeleton: React.FC = () => {
  const memoryTiles = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `GENESIS FLASHBACK #${i + 1}`,
    caption: 'EDITION MOMENTS',
  }));

  return (
    <section
      id="memories"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A183C] via-[#120F36] to-[#0A1128] px-4 py-16"
      aria-label="Event Memories"
    >
      <WatermarkPattern opacity={0.06} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <SlantedBanner title="MEMORIES" subtitle="PREVIOUS EDITIONS ARCHIVE" color="orange" />

        <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {memoryTiles.map((tile) => (
            <div
              key={tile.id}
              className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-xl border-[3px] border-[#0A1B38] bg-gradient-to-b from-[#152B58] to-[#09152E] p-3 shadow-[0_5px_0_#060B17] transition-transform hover:scale-105"
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-cyan-400/20 bg-slate-900/60 p-2 text-center">
                <span className="font-heading text-xs text-amber-400 uppercase tracking-widest">
                  {tile.caption}
                </span>
                <span className="mt-1 font-heading text-sm text-white group-hover:text-cyan-300">
                  {tile.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
