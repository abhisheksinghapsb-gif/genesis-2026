'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/audio';

interface FloatingControlsProps {
  onBackToTop: () => void;
  showBackToTop?: boolean;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onBackToTop,
  showBackToTop = true,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const toggleSound = () => {
    const unmuted = sound.toggleMute();
    setIsMuted(!unmuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 select-none">
      {/* 1. Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onBackToTop();
          }}
          title="Back to top"
          aria-label="Back to top"
          className="w-12 h-12 rounded-full bg-[#F39C12] hover:bg-[#E67E22] text-white border-2 border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* 2. Audio Mute / Unmute Button (Supercell Golden Circle) */}
      <button
        type="button"
        onClick={toggleSound}
        title={isMuted ? 'Unmute game audio' : 'Mute game audio'}
        aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-b from-[#FFD27F] via-[#EAA908] to-[#B37800] border-2 border-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
      >
        {isMuted ? (
          // Muted Icon
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white stroke-current stroke-2 fill-none">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          // Unmuted Icon with sound waves
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white stroke-current stroke-2 fill-none animate-pulse">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
