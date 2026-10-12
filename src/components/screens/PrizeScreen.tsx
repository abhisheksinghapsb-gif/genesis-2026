'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { NavigationRail } from '../ui/NavigationRail';
import { Window } from '../ui/Window';
import { Badge } from '../ui/Badge';
import { ScrollAffordance } from '../ui/ScrollAffordance';
import { prizeTracks } from '@/content/prizes';
import { formatPrize } from '@/lib/format';

export const PrizeScreen: React.FC = () => {
  const mainTrack = prizeTracks.find((t) => t.id === 'main');
  const vrTrack = prizeTracks.find((t) => t.id === 'vr');

  const totalPrizeAmount = prizeTracks.reduce(
    (acc, track) => acc + track.prizes.reduce((sum, p) => sum + p.amount, 0),
    0
  );

  const [displayTotal, setDisplayTotal] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  // Animated rolling count up (Feature F-01)
  useEffect(() => {
    // If reduced motion is active, show final amount immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayTotal(totalPrizeAmount);
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * totalPrizeAmount);
      setDisplayTotal(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayTotal(totalPrizeAmount);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [totalPrizeAmount]);

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-clip select-none">
      {/* Top Bar with PRIZE POOL Banner */}
      <TopBar title="PRIZE POOL" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 pt-[84px] sm:pt-[96px] pb-6 z-10 flex flex-col justify-center">
        {/* Total Prize Pool Banner Counter (F-01) */}
        <div
          ref={counterRef}
          className="mb-4 sm:mb-6 flex justify-center items-center"
        >
          <div className="bg-panel-inset/80 border-2 border-black rounded-full px-6 py-2 shadow-lg flex items-center gap-3">
            <span className="font-display text-cta-yellow text-sm sm:text-base tracking-widest uppercase text-outline-sm">
              TOTAL PRIZE POOL:
            </span>
            <span className="font-display text-white text-xl sm:text-2xl md:text-3xl tracking-wider text-outline">
              {formatPrize(displayTotal)}
            </span>
          </div>
        </div>

        {/* Two Windows: Stacked on mobile/portrait; Side-by-Side on >= 1280px & Short Viewports (§4.2) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 short:grid-cols-2 gap-6 items-start w-full">
          {/* 1. Window: PRIZES (Main Track) */}
          {mainTrack && (
            <Window title={mainTrack.title} className="w-full">
              <div className="flex items-center justify-around flex-wrap gap-3 sm:gap-4 py-2 sm:py-4 md:py-6">
                {mainTrack.prizes.map((p) => (
                  <div key={p.rank} className="flex justify-center flex-1 min-w-[110px] max-w-[240px]">
                    <Badge rank={p.rank} amount={p.amount} trackName="Main Track" />
                  </div>
                ))}
              </div>
            </Window>
          )}

          {/* 2. Window: VR TRACK */}
          {vrTrack && (
            <Window title={vrTrack.title} className="w-full">
              <div className="flex items-center justify-around flex-wrap gap-4 sm:gap-8 py-2 sm:py-4 md:py-6">
                {vrTrack.prizes.map((p) => (
                  <div key={p.rank} className="flex justify-center flex-1 min-w-[110px] max-w-[240px]">
                    <Badge rank={p.rank} amount={p.amount} trackName="VR Track" />
                  </div>
                ))}
              </div>
            </Window>
          )}
        </div>
      </main>

      {/* Scroll Affordance (Section 4.4) */}
      <ScrollAffordance />

      {/* Navigation Sequence Rail (Section 3.6) */}
      <NavigationRail />

      {/* Footer */}
      <Footer />
    </div>
  );
};
