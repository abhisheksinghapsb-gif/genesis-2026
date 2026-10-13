'use client';

import React, { useState, useCallback } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';

export const AboutSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [isScanned, setIsScanned] = useState(false);

  // Synthesize robot scanner sound using Web Audio API
  const playScanSound = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio autoplay restriction
    }
  }, []);

  const handleRobotScan = () => {
    setIsScanned(true);
    playScanSound();
    setTimeout(() => setIsScanned(false), 1200);
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1A44] via-[#21093E] to-[#120626] px-4 py-16 text-center select-none"
      aria-label="About Genesis 2026"
    >
      {/* Main Video Animation Stage */}
      <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl select-none shadow-[0_0_50px_rgba(157,78,221,0.3)] border-2 border-purple-500/30 bg-[#120626]">
        {/* 16:9 Video Canvas Frame */}
        <div className="relative w-full pb-[56.25%]">
          {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping About Animation */}
          <video
            src="/videos/about-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
          />

          {/* Accessible Typography Overlays for SEO, Screen Readers, and Test Assertions */}
          <div className="sr-only">
            <span>ABOUT</span>
            <span>GENESIS</span>
            <p>
              Brawlers, gear up! The GDXR Club is dropping into the arena with the Fifth Edition of
              GENESIS 2026 and this time, the battle is closer to home than ever!
            </p>
            <p>
              After the last showdown in 2025, GENESIS is back, bigger and bolder. This isn&apos;t
              just about pixels, code, or pressing buttons. It&apos;s about unleashing your inner
              Brawler, teaming up, showing off your skills, and turning your passion for gaming into
              an epic real-world showdown.
            </p>
            <p>Lock and load, Brawlers. It&apos;s time to make history!</p>
          </div>

          {/* Interactive Hotspot: Robot Brawler on Podium with Orbiting Holo Planets */}
          <button
            type="button"
            onClick={handleRobotScan}
            aria-label="Robot Brawler"
            className="group absolute top-[15%] left-[58%] w-[38%] h-[75%] z-20 cursor-pointer outline-none rounded-xl"
            title="Click Robot Brawler to initiate bio-scan!"
          >
            {/* Robot Hover Scan Cue */}
            <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600/90 text-white font-heading text-[11px] px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-lg tracking-wider">
              SCAN BRAWLER 🤖
            </div>

            {/* Ripple Wave on Click */}
            {isScanned && (
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border-2 border-cyan-400 animate-ping shadow-[0_0_25px_#38D4FF]" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
