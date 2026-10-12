'use client';

import React, { useState, useEffect } from 'react';
import eventData from '@/content/event.json';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const HeroCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(eventData.startDate).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative z-20 flex flex-col items-center select-none my-4">
      {/* Live Teams Counter Banner */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-[#1E3B75] bg-[#0A1633]/90 px-4 py-1 shadow-[0_3px_0_#050B1A] backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-heading text-xs text-sky-300 uppercase tracking-wider">
          LIVE ENTRANTS:
        </span>
        <span className="font-heading text-sm text-amber-300">
          {eventData.demoSeedTeamsRegistered} SQUADS
        </span>
      </div>

      {/* Flip-Digit Style Countdown Grid */}
      <div className="flex items-center gap-2 sm:gap-3">
        {[
          { label: 'DAYS', val: timeLeft.days },
          { label: 'HRS', val: timeLeft.hours },
          { label: 'MIN', val: timeLeft.minutes },
          { label: 'SEC', val: timeLeft.seconds },
        ].map((unit, idx) => (
          <React.Fragment key={unit.label}>
            {idx > 0 && (
              <span className="font-heading text-xl sm:text-2xl text-amber-400 drop-shadow-[0_2px_0_#000] animate-pulse">
                :
              </span>
            )}
            <div className="flex flex-col items-center">
              {/* Digit Box with 3D drop-base */}
              <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl border-2 sm:border-[3px] border-[#3F1600] bg-gradient-to-b from-[#2B1704] via-[#1A0E02] to-[#0D0701] shadow-[0_4px_0_#080A10]">
                {/* Horizontal split divider */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/80" />
                <span className="font-heading text-xl sm:text-3xl text-amber-300 drop-shadow-[0_2px_0_#000]">
                  {formatDigit(unit.val)}
                </span>
              </div>
              <span className="mt-1 font-heading text-[10px] sm:text-xs text-amber-400/90 tracking-widest">
                {unit.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
