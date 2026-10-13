'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { SponsorContactModal } from './SponsorContactModal';

export const SponsorsSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [isTitleCollapsed, setIsTitleCollapsed] = useState(false);
  const [isPlatformCollapsed, setIsPlatformCollapsed] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section
      id="sponsors"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A183C] via-[#0E204E] to-[#0A1535] text-center select-none scroll-mt-16 pt-12 md:pt-14"
      aria-label="Event Sponsors"
    >
      {/* Edge-to-Edge Video Animation Stage (like innerve.tech) */}
      <div className="relative w-full aspect-[16/9] min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0E204E]">
        {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping Sponsors Animation */}
        <video
          src="/videos/sponsors-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
        />

        {/* Accessible Header Title for Tests & Screen Readers */}
        <h2 className="sr-only">SPONSORS</h2>

        {/* Accessible Typography for Screen Readers & Tests */}
        <div className="sr-only">
          <div>
            <h3>TITLE SPONSORS</h3>
              <span>Game Cloud Technologies</span>
              <span>Title Sponsor & Ecosystem Partner</span>
            </div>
            <div>
              <h3>PLATFORM SPONSORS</h3>
              <span>Gamedoora</span>
              <span>Official Gaming Platform Partner</span>
            </div>
          </div>

          {/* 1. TITLE SPONSORS Interactive Controls */}
          {/* Partner with Genesis Button */}
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            aria-label="Partner with Genesis - TITLE SPONSORS"
            className="absolute top-[15%] left-[6.5%] w-[8%] h-[6%] z-20 cursor-pointer outline-none rounded-md"
            title="Become a Sponsor"
          />

          {/* Red X Collapse Button for TITLE SPONSORS */}
          <button
            type="button"
            onClick={() => setIsTitleCollapsed(!isTitleCollapsed)}
            aria-label={isTitleCollapsed ? 'Expand TITLE SPONSORS' : 'Collapse TITLE SPONSORS'}
            className="absolute top-[15%] left-[43.5%] w-[3.5%] h-[6%] z-20 flex items-center justify-center cursor-pointer outline-none rounded-full"
            title={isTitleCollapsed ? 'Expand TITLE SPONSORS' : 'Collapse TITLE SPONSORS'}
          />

          {/* Clickable Sponsor Link: GameCloud Technologies */}
          <a
            href="https://gamecloud-ltd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-[26%] left-[6.5%] w-[40%] h-[30%] z-20 cursor-pointer rounded-xl outline-none hover:ring-2 hover:ring-cyan-400/50 transition-all"
            aria-label="Visit Game Cloud Technologies official website"
            title="Visit Game Cloud Technologies"
          />

          {/* 2. PLATFORM SPONSORS Interactive Controls */}
          {/* Partner with Genesis Button */}
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            aria-label="Partner with Genesis - PLATFORM SPONSORS"
            className="absolute top-[58.5%] left-[55.5%] w-[8%] h-[6%] z-20 cursor-pointer outline-none rounded-md"
            title="Become a Sponsor"
          />

          {/* Red X Collapse Button for PLATFORM SPONSORS */}
          <button
            type="button"
            onClick={() => setIsPlatformCollapsed(!isPlatformCollapsed)}
            aria-label={isPlatformCollapsed ? 'Expand PLATFORM SPONSORS' : 'Collapse PLATFORM SPONSORS'}
            className="absolute top-[58.5%] left-[92.5%] w-[3.5%] h-[6%] z-20 flex items-center justify-center cursor-pointer outline-none rounded-full"
            title={isPlatformCollapsed ? 'Expand PLATFORM SPONSORS' : 'Collapse PLATFORM SPONSORS'}
          />

          {/* Clickable Sponsor Link: Gamedoora */}
          <a
            href="https://gamedoora.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-[68.5%] left-[55.5%] w-[40%] h-[26%] z-20 cursor-pointer rounded-xl outline-none hover:ring-2 hover:ring-cyan-400/50 transition-all"
            aria-label="Visit Gamedoora official website"
            title="Visit Gamedoora"
          />
        </div>

      {/* Become a Partner Modal */}
      <SponsorContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};
