'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { SponsorContactModal } from './SponsorContactModal';
import sponsorTiers from '@/content/sponsors.json';

export const SponsorsSection: React.FC = () => {
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const [collapsedTiers, setCollapsedTiers] = useState<Record<string, boolean>>({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleCollapse = (tierId: string) => {
    setCollapsedTiers((prev) => ({ ...prev, [tierId]: !prev[tierId] }));
  };

  return (
    <section
      id="sponsors"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A183C] via-[#0E204E] to-[#0A1535] px-4 py-20 text-center select-none"
      aria-label="Event Sponsors"
    >
      <WatermarkPattern opacity={0.08} animated={shouldAnimate} />

      {/* Header Banner */}
      <div className="relative z-10 mb-10 flex flex-col items-center">
        <SlantedBanner
          title="SPONSORS"
          subtitle="POWERED BY INDUSTRY GIANTS"
          color="orange"
        />
      </div>

      {/* Staggered Windows Grid */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10">
        {sponsorTiers.map((tierGroup, idx) => {
          const isCollapsed = collapsedTiers[tierGroup.id];
          const isLeft = tierGroup.staggerDirection === 'left' || idx % 2 === 0;

          return (
            <div
              key={tierGroup.id}
              className={`w-full max-w-3xl transition-all duration-300 ${
                isLeft ? 'self-start sm:translate-x-4' : 'self-end sm:-translate-x-4'
              }`}
            >
              {/* Game Window Container */}
              <div className="relative rounded-2xl border-[3px] sm:border-4 border-[#071733] bg-[#0E2042] p-3 sm:p-5 shadow-2xl">
                {/* Window Header Bar */}
                <div className="flex items-center justify-between border-b-2 border-[#1E3B75] pb-3">
                  {/* Left: Blue Tab Icon (Click opens contact modal) */}
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    type="button"
                    title="Become a partner"
                    aria-label={`Partner with Genesis - ${tierGroup.tier}`}
                    className="group inline-flex items-center gap-1.5 rounded-lg border-2 border-[#092B60] bg-gradient-to-r from-[#00A8FF] to-[#0066CC] px-3 py-1 font-heading text-xs text-white uppercase shadow-[0_2px_0_#061A3A] transition-transform hover:scale-105 active:translate-y-0.5"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-200 animate-ping" />
                    <span>{tierGroup.tierBadge}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">(PARTNER)</span>
                  </button>

                  {/* Center Title */}
                  <h3 className="font-heading text-base sm:text-xl md:text-2xl text-white drop-shadow-[0_2px_0_#000]">
                    {tierGroup.tier}
                  </h3>

                  {/* Right: Red X Collapse Toggle */}
                  <button
                    onClick={() => toggleCollapse(tierGroup.id)}
                    aria-label={isCollapsed ? `Expand ${tierGroup.tier}` : `Collapse ${tierGroup.tier}`}
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#080A10] transition-transform active:translate-y-0.5"
                  >
                    {isCollapsed ? (
                      <span className="font-heading text-lg leading-none">▼</span>
                    ) : (
                      <CloseXIcon size={16} />
                    )}
                  </button>
                </div>

                {/* Window Body (Sponsor Logo Pedestals) */}
                {!isCollapsed && (
                  <div className="mt-6 grid grid-cols-1 gap-6 p-2">
                    {tierGroup.sponsors.map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col sm:flex-row items-center justify-between rounded-xl border-2 border-[#1E3B75] bg-gradient-to-r from-[#07132B] via-[#0A1A3A] to-[#07132B] p-5 shadow-[0_6px_0_#040814] transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,168,255,0.4)]"
                      >
                        {/* Logo Pedestal */}
                        <div className="relative flex h-24 w-full sm:w-64 items-center justify-center rounded-lg border border-cyan-500/20 bg-slate-950/60 p-3">
                          <Image
                            src={sponsor.logo}
                            alt={sponsor.name}
                            width={260}
                            height={75}
                            className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
                          />
                          {/* Periodic Metallic Shine Sweep */}
                          <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-sweep opacity-60" />
                        </div>

                        {/* Sponsor Credentials */}
                        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-1 flex-col items-center sm:items-start text-center sm:text-left">
                          <h4 className="font-heading text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors">
                            {sponsor.shortName}
                          </h4>
                          <p className="mt-1 font-body text-xs sm:text-sm font-bold text-sky-200">
                            {sponsor.role}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 font-heading text-xs text-cyan-400 group-hover:underline">
                            VISIT OFFICIAL SITE ↗
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Become a Partner Modal */}
      <SponsorContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};
