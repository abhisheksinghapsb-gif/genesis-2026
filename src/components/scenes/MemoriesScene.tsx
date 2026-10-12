'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button3D } from '../ui/Button3D';
import { Modal } from '../ui/Modal';
import { Tilt3D } from '../motion/Tilt3D';
import { sound } from '@/lib/audio';
import memoriesData from '@/content/memories.generated.json';

interface MemoryItem {
  src: string;
  year: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

interface MemoriesSceneProps {
  onOpenOverlay?: (id: string) => void;
  onCloseOverlay?: () => void;
  scrollProgress?: number;
}

export const MemoriesScene: React.FC<MemoriesSceneProps> = ({
  onOpenOverlay,
  onCloseOverlay,
  scrollProgress = 0,
}) => {
  const [selectedEdition, setSelectedEdition] = useState<string>('ALL');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const memories = memoriesData as MemoryItem[];

  const filteredMemories =
    selectedEdition === 'ALL'
      ? memories
      : memories.filter((m) => m.year === selectedEdition);

  const editions = ['ALL', '2025', '2024'];

  const handleOpenPhoto = (idx: number) => {
    sound.playPop();
    setActivePhotoIndex(idx);
    onOpenOverlay?.(`memory-${idx}`);
  };

  const handleCloseLightbox = () => {
    setActivePhotoIndex(null);
    onCloseOverlay?.();
  };

  const handleNextPhoto = () => {
    sound.playTap();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredMemories.length);
    }
  };

  const handlePrevPhoto = () => {
    sound.playTap();
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + filteredMemories.length) % filteredMemories.length
      );
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Title Header */}
      <div className="relative z-20 text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
          MEMORIES
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-[1400px] mx-auto w-full z-10 flex-1 space-y-8">
        {/* Edition Selector Tabs */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-2">
          {editions.map((edition) => (
            <Button3D
              key={edition}
              variant={selectedEdition === edition ? 'yellow' : 'slate'}
              className="px-6 py-2.5 text-base sm:text-lg"
              onClick={() => {
                sound.playTap();
                setSelectedEdition(edition);
              }}
            >
              {edition}
            </Button3D>
          ))}
        </div>

        {/* Gallery Grid or Collectible Empty State */}
        {filteredMemories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMemories.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenPhoto(idx)}
                className="cursor-pointer"
              >
                <Tilt3D maxTilt={6}>
                  <div className="bg-white p-3 pb-8 rounded-xl border-[3.5px] border-black shadow-[0_12px_24px_rgba(0,0,0,0.5)]">
                    <div className="relative w-full aspect-[4/3] bg-black/10 rounded-lg overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {photo.caption && (
                      <p className="mt-2 text-center font-display text-xs text-black">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </Tilt3D>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informational Callout */}
            <div className="max-w-[700px] mx-auto bg-black/70 border-2 border-cta-yellow rounded-2xl p-5 text-center shadow-lg">
              <p className="font-display text-lg text-cta-yellow tracking-wide">
                Memories from GENESIS 2025 are landing soon!
              </p>
              <p className="text-xs text-white/80 mt-1">
                Drop your event photos into <code className="text-cta-yellow">public/memories/2025/</code> to populate the gallery.
              </p>
            </div>

            {/* 12 Themed Collectible Empty-State Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <Tilt3D key={idx} maxTilt={6}>
                  <div className="bg-white p-3 pb-6 rounded-2xl border-[3.5px] border-black shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-indigo-700 via-purple-800 to-indigo-950 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner">
                      <Image
                        src="/art/badge.png"
                        alt=""
                        width={44}
                        height={38}
                        className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                      />
                      <span className="mt-2 font-display text-[10px] sm:text-xs text-white tracking-widest text-outline-sm">
                        GENESIS #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </Tilt3D>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && filteredMemories[activePhotoIndex] && (
        <Modal
          isOpen={activePhotoIndex !== null}
          onClose={handleCloseLightbox}
          title={`PHOTO ${activePhotoIndex + 1} OF ${filteredMemories.length}`}
        >
          <div className="relative w-full aspect-[16/10] bg-black/60 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src={filteredMemories[activePhotoIndex].src}
              alt={filteredMemories[activePhotoIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevPhoto}
              className="px-4 py-2 bg-slate text-white font-display text-sm border-2 border-black rounded-lg"
            >
              ❮ PREV
            </button>
            <p className="text-xs text-white/80 font-body">
              {filteredMemories[activePhotoIndex].caption ||
                filteredMemories[activePhotoIndex].alt}
            </p>
            <button
              onClick={handleNextPhoto}
              className="px-4 py-2 bg-slate text-white font-display text-sm border-2 border-black rounded-lg"
            >
              NEXT ❯
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
