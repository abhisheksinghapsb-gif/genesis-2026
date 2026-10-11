'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { Button3D } from '../ui/Button3D';
import { Modal } from '../ui/Modal';
import memoriesData from '@/content/memories.generated.json';

interface MemoryItem {
  id: string;
  year: string;
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export const MemoriesScreen: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState<string>('ALL');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const memories = memoriesData as MemoryItem[];

  // Deterministic tilt: ±2deg based on index
  const getTilt = (idx: number) => {
    const tilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];
    return tilts[idx % tilts.length];
  };

  const filteredMemories =
    selectedEdition === 'ALL'
      ? memories
      : memories.filter((m) => m.year === selectedEdition);

  const editions = ['ALL', '2025', '2024'];

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar with MEMORIES Banner */}
      <TopBar title="MEMORIES" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 z-10 space-y-8">
        {/* Edition Tabs */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
          {editions.map((edition) => (
            <Button3D
              key={edition}
              variant={selectedEdition === edition ? 'yellow' : 'slate'}
              className="px-6 py-2.5 text-base sm:text-lg"
              onClick={() => setSelectedEdition(edition)}
            >
              {edition}
            </Button3D>
          ))}
        </div>

        {/* Gallery Content or Themed Fallback */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredMemories.map((photo, idx) => (
              <div
                key={photo.id || idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative transform ${getTilt(
                  idx
                )} hover:rotate-0 hover:scale-105 transition-all duration-200 cursor-pointer rounded-[14px] bg-white p-1.5 border-[3px] border-black shadow-[0_12px_24px_rgba(0,0,0,0.6)] group`}
              >
                <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-neutral-900">
                  <Image
                    src={photo.src}
                    alt={photo.alt || 'GENESIS hackathon memory'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {photo.caption && (
                  <p className="mt-2 text-xs font-bold text-black font-body px-1 truncate">
                    {photo.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State: 12 Themed Collectible Cards with skull-star badge (§5.5) */
          <div className="space-y-8">
            <div className="text-center py-4 bg-black/40 rounded-lg max-w-xl mx-auto border border-white/20">
              <p className="font-display text-white text-lg sm:text-xl md:text-2xl tracking-wide text-outline-sm">
                Memories from GENESIS 2025 are landing soon!
              </p>
              <p className="font-body text-sm text-white/80 mt-1">
                Drop your photos into public/memories/2025/ to populate the gallery.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`relative transform ${getTilt(
                    idx
                  )} hover:rotate-0 hover:scale-105 transition-all duration-200 rounded-[14px] bg-white p-2 border-[3px] border-black shadow-[0_10px_20px_rgba(0,0,0,0.6)] cursor-default`}
                >
                  <div className="relative w-full aspect-[4/3] rounded-[10px] bg-gradient-to-br from-[#291588] to-[#9146EA] flex flex-col items-center justify-center p-4">
                    <Image
                      src="/art/badge.png"
                      alt=""
                      width={64}
                      height={60}
                      className="w-14 h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                    />
                    <span className="font-display text-white text-xs tracking-wider text-outline-sm mt-3">
                      GENESIS #0{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && filteredMemories[activePhotoIndex] && (
        <Modal
          isOpen={activePhotoIndex !== null}
          onClose={() => setActivePhotoIndex(null)}
          title={`MEMORY ${activePhotoIndex + 1} / ${filteredMemories.length}`}
          maxWidth="max-w-[800px]"
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-black">
              <Image
                src={filteredMemories[activePhotoIndex].src}
                alt={filteredMemories[activePhotoIndex].alt}
                fill
                className="object-contain"
              />
            </div>

            {filteredMemories[activePhotoIndex].caption && (
              <p className="font-body text-base text-white text-center font-medium">
                {filteredMemories[activePhotoIndex].caption}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button3D
                variant="slate"
                onClick={() =>
                  setActivePhotoIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : filteredMemories.length - 1
                  )
                }
                className="px-5 py-2 text-sm"
              >
                PREV
              </Button3D>

              <span className="font-display text-sm text-white">
                {activePhotoIndex + 1} of {filteredMemories.length}
              </span>

              <Button3D
                variant="slate"
                onClick={() =>
                  setActivePhotoIndex((prev) =>
                    prev !== null && prev < filteredMemories.length - 1 ? prev + 1 : 0
                  )
                }
                className="px-5 py-2 text-sm"
              >
                NEXT
              </Button3D>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};
