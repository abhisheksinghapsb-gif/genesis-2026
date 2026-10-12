'use client';

import React, { useState, useEffect } from 'react';
import { NpcDialogBubble } from '../ui/NpcDialogBubble';
import { siteConfig } from '@/content/site';

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 14,
    minutes: 32,
    seconds: 18,
  });

  useEffect(() => {
    // Dynamic countdown timer loop
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full py-12 md:py-20 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 1. Main Game Countdown Box */}
      <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Top Header Tab */}
        <div className="relative -mb-3 z-20 px-6 py-2 rounded-t-2xl bg-gradient-to-b from-[#25AA87] via-[#0FAE7E] to-[#00875F] border-2 border-[#52F4C0] shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-white/60 bg-[#FFD747] animate-spin" style={{ animationDuration: '6s' }} />
          <h2 className="font-display font-black text-lg md:text-2xl text-white tracking-wider uppercase drop-shadow-[0_2px_0_#000]">
            HACKATHON COMMENCES IN
          </h2>
        </div>

        {/* Counter Body Container */}
        <div className="w-full bg-gradient-to-b from-[#023C2D] via-[#026144] to-[#029267] rounded-3xl p-5 md:p-8 border-4 border-[#1E7152] shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-[#07241A] border-2 border-[#55BD9A] rounded-2xl p-2 md:p-4 shadow-inner flex flex-col items-center justify-center"
              >
                <span className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-[#52F4C0] drop-shadow-[0_2px_0_#000]">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-white/80 mt-1 uppercase">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hanging Brass Chains / Ropes */}
        <div className="w-3/4 flex justify-between px-8 md:px-16 pointer-events-none">
          <div className="w-2.5 h-10 md:h-14 bg-gradient-to-b from-[#332008] via-[#B8860B] to-[#5C4033] border-x border-[#FFD700]/50" />
          <div className="w-2.5 h-10 md:h-14 bg-gradient-to-b from-[#332008] via-[#B8860B] to-[#5C4033] border-x border-[#FFD700]/50" />
        </div>

        {/* Hanging Event Date Plaque */}
        <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFF2D6] via-[#E8D4A2] to-[#BFA16B] border-4 border-[#3D250C] rounded-2xl p-4 md:p-6 shadow-[0_10px_28px_rgba(0,0,0,0.6)] flex items-center justify-between gap-4">
          {/* Shield Badge on Left */}
          <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-gradient-to-b from-[#C0392B] to-[#7B241C] border-2 border-[#F39C12] shadow flex items-center justify-center shrink-0">
            <span className="text-2xl md:text-3xl" role="img" aria-label="Shield">
              🛡️
            </span>
          </div>

          {/* Dates & Location */}
          <div className="flex-1 text-center">
            <div className="font-display font-black text-xl md:text-3xl text-[#2B1B0C] tracking-wide uppercase drop-shadow-[0_1px_0_#FFF]">
              TODO: DATES 2026
            </div>
            <div className="text-xs md:text-sm font-mono font-bold text-[#573A18] tracking-widest uppercase mt-0.5">
              {siteConfig.college} • HYBRID ARENA
            </div>
          </div>
        </div>

        {/* NPC Dialogue Quote beneath Countdown */}
        <div className="mt-8 self-start">
          <NpcDialogBubble
            avatar="villager"
            characterName="CHIEF COLT"
            dialogue="LOCK IN YOUR SQUADS — TROPHY ROAD COMMENCES!"
            position="left"
          />
        </div>
      </div>
    </div>
  );
};
