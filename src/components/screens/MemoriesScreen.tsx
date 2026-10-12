'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { NavigationRail } from '../ui/NavigationRail';
import { Button3D } from '../ui/Button3D';
import { Modal } from '../ui/Modal';
import { ScrollAffordance } from '../ui/ScrollAffordance';
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

  // Sync lightbox with URL hash #photo=N (Section 3.4)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#photo=')) {
        const idx = parseInt(hash.replace('#photo=', ''), 10);
        if (!isNaN(idx) && idx >= 0 && idx < filteredMemories.length) {
          setActivePhotoIndex(idx);
        }
      } else if (activePhotoIndex !== null) {
        setActivePhotoIndex(null);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [filteredMemories.length, activePhotoIndex]);

  const openPhoto = (idx: number) => {
    if (window.location.hash !== `#photo=${idx}`) {
      window.location.hash = `photo=${idx}`;
    }
    setActivePhotoIndex(idx);
  };

  const closePhoto = () => {
    setActivePhotoIndex(null);
    if (window.location.hash.startsWith('#photo=')) {
      window.history.back();
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-clip select-none">
      {/* Top Bar with MEMORIES Banner */}
      <TopBar title="MEMORIES" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pt-[84px] sm:pt-[96px] pb-6 z-10 space-y-8">
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

        {/* Empty State Banner if no photos found for selected year */}
        {filteredMemories.length === 0 && (
          <div className="text-center py-12 px-4 bg-panel-inset/60 rounded-xl border border-white/20 max-w-lg mx-auto">
            <h3 className="font-display text-2xl text-white text-outline-sm mb-2">
              Memories from GENESIS {selectedEdition} are landing soon!
            </h3>
            <p className="font-body text-white/80 text-sm">
              Drop your photos into public/memories/{selectedEdition}/ to populate the gallery.
            </p>
          </div>
        )}

        {/* Collectible Photo Card Grid matching memories.png */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pb-10">
          {filteredMemories.map((photo, idx) => {
            const isPlaceholder = photo.src.startsWith('/placeholder-');

            return (
              <div
                key={photo.id}
                onClick={() => openPhoto(idx)}
                className={`transform ${getTilt(
                  idx
                )} transition-transform duration-200 hover:rotate-0 hover:scale-105 cursor-pointer`}
              >
                {/* 3D Collectible Card Frame */}
                <article className="relative bg-white rounded-lg p-1.5 sm:p-2 border-2 border-black shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  {/* Aspect-Ratio Box */}
                  <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-gradient-to-br from-[#40128B] to-[#7914B0] flex items-center justify-center">
                    {isPlaceholder ? (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Image
                          src="/art/badge.png"
                          alt=""
                          width={60}
                          height={54}
                          className="w-12 h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-2 animate-bounce"
                        />
                        <span className="font-display text-white text-xs sm:text-sm tracking-wider text-outline-sm uppercase">
                          GENESIS #{String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </main>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && filteredMemories[activePhotoIndex] && (
        <Modal
          isOpen={activePhotoIndex !== null}
          onClose={closePhoto}
          title={`MEMORIES · ${filteredMemories[activePhotoIndex].year}`}
        >
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/3] max-h-[60vh] bg-black/50 rounded-lg overflow-hidden flex items-center justify-center">
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
                onClick={() => {
                  const nextIdx =
                    activePhotoIndex > 0 ? activePhotoIndex - 1 : filteredMemories.length - 1;
                  openPhoto(nextIdx);
                }}
                className="px-5 py-2 text-sm"
              >
                PREV
              </Button3D>

              <div className="flex items-center gap-3">
                <span className="font-display text-sm text-white">
                  {activePhotoIndex + 1} of {filteredMemories.length}
                </span>

                {/* Photo Share Link (F-10) */}
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-panel-header text-white font-display text-xs border border-black/30 hover:bg-panel-header-bevel-light active:scale-95 transition-all"
                  title="Copy link to this photo"
                  aria-label="Copy photo link"
                >
                  SHARE LINK
                </button>

                {/* Download link (F-10) */}
                <a
                  href={filteredMemories[activePhotoIndex].src}
                  download={`genesis-memory-${filteredMemories[activePhotoIndex].id}.webp`}
                  className="px-2.5 py-1 rounded bg-cta-yellow text-black font-display text-xs border border-black/30 hover:bg-cta-yellow-hi active:scale-95 transition-all"
                  aria-label="Download full resolution photo"
                >
                  SAVE
                </a>
              </div>

              <Button3D
                variant="slate"
                onClick={() => {
                  const nextIdx =
                    activePhotoIndex < filteredMemories.length - 1 ? activePhotoIndex + 1 : 0;
                  openPhoto(nextIdx);
                }}
                className="px-5 py-2 text-sm"
              >
                NEXT
              </Button3D>
            </div>
          </div>
        </Modal>
      )}

      {/* Scroll Affordance (Section 4.4) */}
      <ScrollAffordance />

      {/* Navigation Sequence Rail (Section 3.6) */}
      <NavigationRail />

      {/* Footer */}
      <Footer />
    </div>
  );
};
