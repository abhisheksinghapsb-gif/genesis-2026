'use client';

import React, { useState } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';

export const PrizesSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [isMainCollapsed, setIsMainCollapsed] = useState<boolean>(false);
  const [isVrCollapsed, setIsVrCollapsed] = useState<boolean>(false);

  return (
    <section
      id="prizes"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1636] via-[#0D1F52] to-[#0A183C] px-4 py-16 text-center select-none"
      aria-label="Prize Pool"
    >
      {/* Main Video Animation Stage */}
      <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl select-none shadow-[0_0_50px_rgba(255,183,3,0.3)] border-2 border-amber-500/30 bg-[#0D1F52]">
        {/* 16:9 Video Canvas Frame */}
        <div className="relative w-full pb-[56.25%]">
          {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping Prizes Animation */}
          <video
            src="/videos/prizes-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
          />

          {/* Accessible Typography for Screen Readers & Tests */}
          <div className="sr-only">
            <h2>PRIZE POOL</h2>
            <div>
              <h3>MAIN GAMING CHAMPIONSHIP</h3>
              <span>CHAMPION</span>
              <span>₹17,500</span>
              <span>RUNNER UP</span>
              <span>₹15,000</span>
              <span>2ND RUNNER UP</span>
              <span>₹12,500</span>
            </div>
            <div>
              <h3>VR TRACK ARENA</h3>
              <span>VR CHAMPION</span>
              <span>₹10,000</span>
              <span>VR RUNNER UP</span>
              <span>₹5,000</span>
            </div>
          </div>

          {/* Interactive Collapse/Expand Toggle Button: Main Gaming Panel */}
          <button
            type="button"
            onClick={() => setIsMainCollapsed(!isMainCollapsed)}
            aria-label={isMainCollapsed ? 'Expand Main Gaming panel' : 'Collapse Main Gaming panel'}
            className="absolute top-[8%] right-[6.8%] h-7 w-7 sm:h-9 sm:w-9 z-20 flex items-center justify-center rounded-full bg-red-600/0 hover:bg-red-600/30 transition-all outline-none"
            title={isMainCollapsed ? 'Expand Main Gaming panel' : 'Collapse Main Gaming panel'}
          >
            <span className="sr-only">
              {isMainCollapsed ? 'Expand Main Gaming panel' : 'Collapse Main Gaming panel'}
            </span>
          </button>

          {/* Interactive Collapse/Expand Toggle Button: VR Track Panel */}
          <button
            type="button"
            onClick={() => setIsVrCollapsed(!isVrCollapsed)}
            aria-label={isVrCollapsed ? 'Expand VR Track panel' : 'Collapse VR Track panel'}
            className="absolute top-[58%] right-[6.8%] h-7 w-7 sm:h-9 sm:w-9 z-20 flex items-center justify-center rounded-full bg-red-600/0 hover:bg-red-600/30 transition-all outline-none"
            title={isVrCollapsed ? 'Expand VR Track panel' : 'Collapse VR Track panel'}
          >
            <span className="sr-only">
              {isVrCollapsed ? 'Expand VR Track panel' : 'Collapse VR Track panel'}
            </span>
          </button>

          {/* Interactive Hotspots for Shields (Main Track) */}
          <div className="absolute top-[18%] left-[8%] w-[84%] h-[32%] z-20 flex justify-around">
            <button
              type="button"
              className="h-full w-[28%] rounded-xl outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="Champion: ₹17,500 Cash Prize"
              title="1st Place Champion: ₹17,500 INR"
            />
            <button
              type="button"
              className="h-full w-[28%] rounded-xl outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="Runner Up: ₹15,000 Cash Prize"
              title="2nd Place Runner Up: ₹15,000 INR"
            />
            <button
              type="button"
              className="h-full w-[28%] rounded-xl outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="2nd Runner Up: ₹12,500 Cash Prize"
              title="3rd Place: ₹12,500 INR"
            />
          </div>

          {/* Interactive Hotspots for Shields (VR Track) */}
          <div className="absolute top-[68%] left-[20%] w-[60%] h-[28%] z-20 flex justify-around">
            <button
              type="button"
              className="h-full w-[40%] rounded-xl outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="VR Champion: ₹10,000 Cash Prize"
              title="VR Champion: ₹10,000 INR"
            />
            <button
              type="button"
              className="h-full w-[40%] rounded-xl outline-none hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label="VR Runner Up: ₹5,000 Cash Prize"
              title="VR Runner Up: ₹5,000 INR"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
