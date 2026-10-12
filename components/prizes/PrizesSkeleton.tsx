import React from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { PanelWindow } from '@/components/ui/PanelWindow';
import { ShieldBadge } from '@/components/ui/ShieldBadge';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const PrizesSkeleton: React.FC = () => {
  return (
    <section
      id="prizes"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1638] via-[#0E204E] to-[#0A1535] px-4 py-16"
      aria-label="Prize Pool"
    >
      <WatermarkPattern opacity={0.08} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <SlantedBanner title="PRIZE POOL" subtitle="TOTAL CASH REWARDS • ₹60,000" color="orange" />

        <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {/* Main Gaming Track */}
          <PanelWindow tabLabel="TRACK 01" title="MAIN GAMING CHAMPIONSHIP">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-amber-600/30 bg-amber-950/30 p-3">
                <div className="flex items-center gap-3">
                  <ShieldBadge rank="1ST" tier="gold" size="sm" />
                  <span className="font-heading text-lg text-white">1ST PLACE</span>
                </div>
                <span className="font-heading text-2xl text-amber-300 drop-shadow-[0_2px_0_#000]">
                  ₹17,500
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-orange-600/30 bg-orange-950/30 p-3">
                <div className="flex items-center gap-3">
                  <ShieldBadge rank="2ND" tier="orange" size="sm" />
                  <span className="font-heading text-lg text-white">2ND PLACE</span>
                </div>
                <span className="font-heading text-2xl text-orange-300 drop-shadow-[0_2px_0_#000]">
                  ₹15,000
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-slate-600/30 bg-slate-900/30 p-3">
                <div className="flex items-center gap-3">
                  <ShieldBadge rank="3RD" tier="silver" size="sm" />
                  <span className="font-heading text-lg text-white">3RD PLACE</span>
                </div>
                <span className="font-heading text-2xl text-slate-200 drop-shadow-[0_2px_0_#000]">
                  ₹12,500
                </span>
              </div>
            </div>
          </PanelWindow>

          {/* VR Track */}
          <PanelWindow tabLabel="TRACK 02" title="VIRTUAL REALITY ARENA">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-cyan-600/30 bg-cyan-950/30 p-3">
                <div className="flex items-center gap-3">
                  <ShieldBadge rank="1ST" tier="cyan" size="sm" />
                  <span className="font-heading text-lg text-white">VR CHAMPION</span>
                </div>
                <span className="font-heading text-2xl text-cyan-300 drop-shadow-[0_2px_0_#000]">
                  ₹10,000
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border-2 border-cyan-600/30 bg-cyan-950/30 p-3">
                <div className="flex items-center gap-3">
                  <ShieldBadge rank="2ND" tier="cyan" size="sm" />
                  <span className="font-heading text-lg text-white">VR RUNNER-UP</span>
                </div>
                <span className="font-heading text-2xl text-cyan-300 drop-shadow-[0_2px_0_#000]">
                  ₹5,000
                </span>
              </div>
            </div>
          </PanelWindow>
        </div>
      </div>
    </section>
  );
};
