'use client';

import React, { useState, useEffect } from 'react';
import { SkullIcon } from './GameIcons';

export const GameLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // Quick progress increment up to 100% in ~800ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#070D1D] select-none transition-opacity duration-300"
      aria-label="Loading Genesis 2026"
      role="status"
    >
      {/* Spinning Skull Emblem */}
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[#3D2500] bg-gradient-to-b from-[#FFF066] via-[#FFB703] to-[#D47000] p-4 shadow-[0_8px_0_#080A10] animate-bounce">
        <SkullIcon size={48} className="text-[#2B1400] drop-shadow-[0_2px_0_#FFF]" />
      </div>

      {/* Chunky Loading Title */}
      <h2 className="mb-4 font-heading text-2xl tracking-widest text-amber-300 uppercase drop-shadow-[0_3px_0_#000]">
        LOADING GENESIS...
      </h2>

      {/* Progress Bar Container with drop base */}
      <div className="relative h-6 w-64 max-w-[85vw] rounded-full border-[3px] border-[#3B2200] bg-[#0A1329] p-0.5 shadow-[0_4px_0_#080A10]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FFB703] via-[#FF8800] to-[#E5383B] transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      {/* Percentage */}
      <span className="mt-2 font-heading text-xs tracking-wider text-amber-200/80">
        {Math.min(100, progress)}%
      </span>
    </div>
  );
};
