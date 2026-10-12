'use client';

import React from 'react';
import Image from 'next/image';

interface NpcDialogBubbleProps {
  avatar?: 'colt' | 'robot' | 'villager';
  characterName: string;
  dialogue: string;
  position?: 'left' | 'right';
  className?: string;
}

export const NpcDialogBubble: React.FC<NpcDialogBubbleProps> = ({
  avatar = 'colt',
  characterName,
  dialogue,
  position = 'left',
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-end gap-3 z-30 select-none animate-float ${
        position === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'
      } ${className}`}
    >
      {/* Character Avatar Emblem */}
      <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-b from-[#FFE79A] to-[#B37812] p-[2.5px] shadow-[0_6px_16px_rgba(0,0,0,0.6)] border border-[#3E2304]">
        <div className="w-full h-full rounded-full bg-[#180F33] overflow-hidden flex items-center justify-center relative">
          {avatar === 'robot' ? (
            <span className="text-2xl md:text-3xl" role="img" aria-label="Robot">
              🤖
            </span>
          ) : avatar === 'villager' ? (
            <span className="text-2xl md:text-3xl" role="img" aria-label="Hero">
              🤠
            </span>
          ) : (
            <span className="text-2xl md:text-3xl" role="img" aria-label="Brawler">
              ⭐
            </span>
          )}
        </div>
        {/* Name pill beneath avatar */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0C061C] border border-[#FFE79A] px-2 py-0.5 rounded text-[9px] md:text-[10px] font-display font-bold text-[#FFD747] tracking-wider whitespace-nowrap shadow">
          {characterName}
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="relative max-w-[280px] sm:max-w-[340px] md:max-w-[420px] bg-[#FFFBF0] border-2 border-[#1A120B] rounded-2xl p-3 md:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        {/* Callout Arrow */}
        <div
          className={`absolute -bottom-[1px] ${
            position === 'right' ? '-right-2 border-r-transparent' : '-left-2 border-l-transparent'
          } w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-[#FFFBF0]`}
        />

        {/* Fancy Inner Border Ring */}
        <div className="absolute inset-1 border border-[#E8D4A2] rounded-xl pointer-events-none" />

        <p className="font-display font-bold text-[12px] sm:text-[14px] md:text-[15px] leading-tight text-[#2B1B0C] tracking-wide uppercase drop-shadow-[0_1px_0_#FFF]">
          &ldquo;{dialogue}&rdquo;
        </p>
      </div>
    </div>
  );
};
