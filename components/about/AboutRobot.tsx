'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface AboutRobotProps {
  shouldAnimate: boolean;
  onScanTrigger?: () => void;
}

export const AboutRobot: React.FC<AboutRobotProps> = ({ shouldAnimate, onScanTrigger }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    if (onScanTrigger) onScanTrigger();
    setTimeout(() => setIsScanning(false), 1200);
  };

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Light Beams & Spotlights behind podium */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 md:h-96 md:w-96 rounded-full bg-gradient-to-t from-purple-600/30 via-orange-500/20 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Robot Brawler Container */}
      <button
        type="button"
        onClick={handleScan}
        aria-label="Robot Brawler — click to scan"
        className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-200 active:scale-95 ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '4.8s' }}
      >
        {/* Hologram Scanline Glint across the robot during scan interaction */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-3xl">
            <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-shine-sweep" />
          </div>
        )}

        {/* Robot Brawler Render */}
        <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-[420px] md:w-[420px]">
          <Image
            src="/img/about/robot-brawler.webp"
            alt="Robot Brawler Hero"
            fill
            sizes="(max-width: 768px) 320px, 420px"
            className="object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.9)] group-hover:brightness-110 transition-all"
          />

          {/* Glowing Eye Visor Pulse */}
          <div className="absolute left-[45%] top-[26%] h-3 w-5 rounded-full bg-cyan-300 shadow-[0_0_12px_#00E5FF] animate-ping opacity-80" />
        </div>

        {/* Podium Base Shadow */}
        <div className="mt-[-25px] h-6 w-56 rounded-full bg-black/70 blur-md" />
      </button>
    </div>
  );
};
