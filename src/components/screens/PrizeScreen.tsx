'use client';

import React from 'react';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { Window } from '../ui/Window';
import { Badge } from '../ui/Badge';
import { prizeTracks } from '@/content/prizes';

export const PrizeScreen: React.FC = () => {
  const mainTrack = prizeTracks.find((t) => t.id === 'main');
  const vrTrack = prizeTracks.find((t) => t.id === 'vr');

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar with PRIZE POOL Banner */}
      <TopBar title="PRIZE POOL" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-6 md:space-y-10 z-10 flex flex-col justify-center">
        {/* 1. Window: PRIZES (Main Track) */}
        {mainTrack && (
          <Window title={mainTrack.title} className="w-full">
            <div className="flex items-center justify-around flex-wrap gap-4 sm:gap-6 py-2 sm:py-6 md:py-8">
              {mainTrack.prizes.map((p) => (
                <div key={p.rank} className="flex justify-center flex-1 min-w-[130px] max-w-[280px]">
                  <Badge rank={p.rank} amount={p.amount} trackName="Main Track" />
                </div>
              ))}
            </div>
          </Window>
        )}

        {/* 2. Window: VR TRACK */}
        {vrTrack && (
          <Window title={vrTrack.title} className="w-full">
            <div className="flex items-center justify-around flex-wrap gap-6 sm:gap-12 py-2 sm:py-6 md:py-8">
              {vrTrack.prizes.map((p) => (
                <div key={p.rank} className="flex justify-center flex-1 min-w-[130px] max-w-[280px]">
                  <Badge rank={p.rank} amount={p.amount} trackName="VR Track" />
                </div>
              ))}
            </div>
          </Window>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
