'use client';

import React from 'react';
import { useTilt3D } from '@/animations/useTilt3D';
import type { MemoryItem } from './MemoriesLightbox';

export interface MemoryCardProps {
  item: MemoryItem;
  rotationClass: string;
  onClick: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ item, rotationClass, onClick }) => {
  const { ref, transformStyle, glareStyle, onPointerMove, onPointerLeave, onPointerDown, onPointerUp } =
    useTilt3D<HTMLButtonElement>({ maxTilt: 8, scale: 1.04 });

  return (
    <button
      ref={ref}
      style={transformStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      type="button"
      className={`group/card relative flex h-48 w-72 sm:h-56 sm:w-80 shrink-0 ${rotationClass} flex-col overflow-hidden rounded-2xl border-4 border-[#0B1D40] bg-gradient-to-b from-[#132A5C] via-[#0E2047] to-[#08132B] p-3 text-left shadow-[0_6px_0_#050B17] transition-all duration-300 hover:z-20 hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(0,168,255,0.5)] select-none`}
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-md transition-opacity duration-150"
        style={glareStyle}
      />

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
};
