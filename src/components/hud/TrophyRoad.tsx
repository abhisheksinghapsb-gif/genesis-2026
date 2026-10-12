'use client';

import React from 'react';
import { sound } from '@/lib/audio';

export interface Station {
  id: string;
  label: string;
}

export const STATIONS: Station[] = [
  { id: 'hero', label: 'HUB' },
  { id: 'about', label: 'ABOUT' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'prize-pool', label: 'PRIZES' },
  { id: 'memories', label: 'MEMORIES' },
  { id: 'sponsors', label: 'SPONSORS' },
  { id: 'faqs', label: 'FAQS' },
  { id: 'register', label: 'REGISTER' },
];

interface TrophyRoadProps {
  currentSection: string;
  scrollProgress: number; // 0 to 1
  onJump: (sectionId: string) => void;
}

export const TrophyRoad: React.FC<TrophyRoadProps> = ({
  currentSection,
  scrollProgress,
  onJump,
}) => {
  const currentIdx = STATIONS.findIndex((s) => s.id === currentSection);

  return (
    <>
      {/* DESKTOP RAIL (Fixed Right Edge) */}
      <nav
        aria-label="Trophy Road Sections"
        className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-50 flex-col items-center py-4 px-2 bg-slate/80 backdrop-blur-md border-2 border-black rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
      >
        {/* Rail track */}
        <div className="relative flex flex-col items-center gap-4">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-2 w-1.5 bg-black rounded-full" />
          <div
            className="absolute top-2 w-1.5 bg-cta-yellow rounded-full transition-all duration-150"
            style={{
              height: `${Math.max(0, Math.min(100, scrollProgress * 100))}%`,
            }}
          />

          {/* Stations */}
          {STATIONS.map((station, idx) => {
            const isCurrent = station.id === currentSection;
            const isPassed = idx < currentIdx;

            return (
              <button
                key={station.id}
                onClick={() => {
                  sound.playTap();
                  onJump(station.id);
                }}
                title={station.label}
                aria-label={`Jump to ${station.label}`}
                aria-current={isCurrent ? 'true' : undefined}
                className="group relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-cta-yellow"
              >
                {/* Node icon */}
                <div
                  className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-cta-yellow scale-125 shadow-[0_0_12px_#FBEF44]'
                      : isPassed
                      ? 'bg-orange-500'
                      : 'bg-slate-700/80 border-slate-400'
                  }`}
                >
                  {isCurrent && (
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                  )}
                </div>

                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute right-9 px-2 py-1 bg-black text-white font-display text-xs uppercase tracking-wider rounded border border-cta-yellow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  {station.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE BOTTOM RUNNER (Fixed Bottom Bar) */}
      <nav
        aria-label="Mobile Section Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t-2 border-black px-2 py-1.5 flex items-center justify-between"
      >
        {STATIONS.map((station, idx) => {
          const isCurrent = station.id === currentSection;
          const isPassed = idx < currentIdx;

          return (
            <button
              key={station.id}
              onClick={() => {
                sound.playTap();
                onJump(station.id);
              }}
              aria-label={station.label}
              aria-current={isCurrent ? 'true' : undefined}
              className="flex-1 py-1 flex flex-col items-center justify-center gap-0.5"
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border border-black transition-all ${
                  isCurrent
                    ? 'bg-cta-yellow scale-125 shadow-[0_0_8px_#FBEF44]'
                    : isPassed
                    ? 'bg-orange-500'
                    : 'bg-slate-700'
                }`}
              />
              <span
                className={`text-[9px] font-display uppercase tracking-tight ${
                  isCurrent ? 'text-cta-yellow font-bold' : 'text-slate-400'
                }`}
              >
                {station.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
