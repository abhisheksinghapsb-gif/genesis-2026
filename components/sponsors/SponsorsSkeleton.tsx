import React from 'react';
import Image from 'next/image';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { PanelWindow } from '@/components/ui/PanelWindow';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const SponsorsSkeleton: React.FC = () => {
  return (
    <section
      id="sponsors"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1535] via-[#0E204E] to-[#0A183C] px-4 py-16"
      aria-label="Event Sponsors"
    >
      <WatermarkPattern opacity={0.08} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <SlantedBanner title="SPONSORS" subtitle="POWERED BY INDUSTRY LEADERS" color="orange" />

        <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {/* Title Sponsor Window */}
          <PanelWindow tabLabel="TIER 01" title="TITLE SPONSOR">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative flex h-28 w-full max-w-xs items-center justify-center rounded-xl border-2 border-amber-500/30 bg-[#081226] p-4 shadow-[0_4px_0_#040814]">
                <Image
                  src="/img/sponsors/game-cloud.webp"
                  alt="Game Cloud Technologies Private Limited"
                  width={280}
                  height={80}
                  className="max-h-20 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                />
              </div>
              <p className="mt-4 font-heading text-lg text-amber-300">
                GAME CLOUD TECHNOLOGIES
              </p>
              <span className="font-body text-xs font-bold text-slate-300">
                Title Sponsor & Ecosystem Partner
              </span>
            </div>
          </PanelWindow>

          {/* Platform Sponsor Window */}
          <PanelWindow tabLabel="TIER 02" title="PLATFORM SPONSOR">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative flex h-28 w-full max-w-xs items-center justify-center rounded-xl border-2 border-cyan-500/30 bg-[#081226] p-4 shadow-[0_4px_0_#040814]">
                <Image
                  src="/img/sponsors/gamedoora.webp"
                  alt="Gamedoora"
                  width={240}
                  height={70}
                  className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                />
              </div>
              <p className="mt-4 font-heading text-lg text-cyan-300">
                GAMEDOORA
              </p>
              <span className="font-body text-xs font-bold text-slate-300">
                Official Gaming Platform Partner
              </span>
            </div>
          </PanelWindow>
        </div>
      </div>
    </section>
  );
};
