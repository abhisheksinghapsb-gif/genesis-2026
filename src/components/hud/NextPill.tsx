'use client';

import React from 'react';
import { sound } from '@/lib/audio';
import { STATIONS } from './TrophyRoad';

interface NextPillProps {
  currentSection: string;
  onJump: (sectionId: string) => void;
}

export const NextPill: React.FC<NextPillProps> = ({ currentSection, onJump }) => {
  const currentIdx = STATIONS.findIndex((s) => s.id === currentSection);
  const isLast = currentIdx === STATIONS.length - 1;
  const nextSection = isLast ? STATIONS[0] : STATIONS[currentIdx + 1];

  const handleClick = () => {
    sound.playTap();
    onJump(nextSection.id);
  };

  return (
    <div className="fixed bottom-12 md:bottom-6 left-1/2 -translate-x-1/2 z-40">
      <button
        onClick={handleClick}
        className="group relative px-5 py-2 bg-cta-yellow hover:bg-cta-yellow-hi text-black font-display text-sm uppercase tracking-wider border-2 border-black rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.6)] transform-gpu hover:scale-105 active:scale-95 transition-all animate-bounce"
        aria-label={isLast ? 'Back to top of page' : `Jump to ${nextSection.label}`}
      >
        <span className="flex items-center gap-1.5 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
          {isLast ? (
            <>
              BACK TO TOP <span className="text-base leading-none">▲</span>
            </>
          ) : (
            <>
              NEXT <span className="text-base leading-none">▼</span>
            </>
          )}
        </span>
      </button>
    </div>
  );
};
