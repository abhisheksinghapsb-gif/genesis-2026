'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { HeroCountdown } from './HeroCountdown';

export const GenesisBrawlHero: React.FC = () => {
  // Gunfire state for Colt
  const [coltRecoil, setColtRecoil] = useState(false);

  // Leon ninja star throw
  const [isLeonActive, setIsLeonActive] = useState(false);

  // Balloon bounce
  const [isBalloonBounced, setIsBalloonBounced] = useState(false);

  // GDAI celebration
  const [isGdaiBurst, setIsGdaiBurst] = useState(false);

  // Brochure modal
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  // Synthesize lightweight laser blast sound using Web Audio API
  const playBlasterSound = useCallback(() => {
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

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(820, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  }, []);

  // Colt Rapid Fire Burst Trigger
  const triggerColtBurst = useCallback(() => {
    setColtRecoil(true);
    playBlasterSound();

    setTimeout(() => {
      playBlasterSound();
    }, 110);

    setTimeout(() => {
      playBlasterSound();
      setColtRecoil(false);
    }, 220);
  }, [playBlasterSound]);

  // Automatic periodic gunfire loop (every ~4.5s)
  useEffect(() => {
    const fireInterval = setInterval(() => {
      triggerColtBurst();
    }, 4500);

    return () => clearInterval(fireInterval);
  }, [triggerColtBurst]);

  // Trigger Leon action
  const handleLeonClick = () => {
    setIsLeonActive(true);
    setTimeout(() => setIsLeonActive(false), 1200);
  };

  // Trigger Balloon bounce
  const handleBalloonClick = () => {
    setIsBalloonBounced(true);
    setTimeout(() => setIsBalloonBounced(false), 800);
  };

  // Trigger GDAI burst
  const handleGdaiClick = () => {
    setIsGdaiBurst(true);
    setTimeout(() => setIsGdaiBurst(false), 1000);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-2xl select-none shadow-[0_0_50px_rgba(0,168,255,0.25)] border-2 border-cyan-500/30 bg-[#060D24]">
      {/* Aspect Ratio Box: 1024 / 728 = 1.40659 */}
      <div className="relative w-full pb-[71.09375%]">
        {/* 1. STRICT BASE ARTWORK: First paint placeholder */}
        <Image
          src="/img/hero/genesis-brawl-hero.webp"
          alt="GENESIS 2026 Official Arena Artwork"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="pointer-events-none object-cover z-0"
        />

        {/* 1b. ENDLESS LOOP VIDEO ANIMATION: Continuous looping reference animation */}
        <video
          src="/videos/hero-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/img/hero/genesis-brawl-hero.webp"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
        />

        {/* Accessible H1 Title aligned over Artwork title for SEO and Test assertions */}
        <h1 className="pointer-events-none absolute top-[25.5%] left-1/2 -translate-x-1/2 font-heading text-transparent select-none text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase drop-shadow-[0_0_25px_rgba(255,183,3,0.35)] z-20">
          GENESIS 2026
        </h1>

        {/* 2. INTERACTIVE HOTSPOT: Colt Gun Fire & Audio */}
        <div
          onClick={triggerColtBurst}
          className="absolute top-[38%] left-[14%] w-[25%] h-[38%] z-20 cursor-pointer group"
          title="Click Colt to fire weapons!"
          style={{
            transform: coltRecoil ? 'translate3d(0, -5px, 0) scale(1.02)' : 'translate3d(0, 0, 0)',
            transition: 'transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)',
          }}
        >
          {/* Colt Hover Cue Pill */}
          <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/90 text-white font-heading text-[11px] px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-lg tracking-wider">
            TAP TO FIRE 💥
          </div>
        </div>

        {/* 3. INTERACTIVE HOTSPOT: Leon Shuriken Throw */}
        <div
          onClick={handleLeonClick}
          className={`absolute top-[42%] left-[63%] w-[25%] h-[38%] z-20 cursor-pointer group transition-transform duration-150 ${
            isLeonActive ? 'scale-105 -translate-y-1' : ''
          }`}
          title="Click Leon to throw ninja star!"
        >
          {/* Leon Hover Cue */}
          <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600/90 text-white font-heading text-[11px] px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-lg tracking-wider">
            THROW STAR ⭐
          </div>
        </div>

        {/* 4. INTERACTIVE HOTSPOT: Balloon Character */}
        <div
          onClick={handleBalloonClick}
          className={`absolute top-[70%] left-[84%] w-[15%] h-[28%] z-20 cursor-pointer group transition-transform ${
            isBalloonBounced ? 'scale-110 -translate-y-2' : ''
          }`}
          title="Click balloon to bounce!"
        />

        {/* 9. FUNCTIONAL INTERACTIVE HOTSPOT: Center "REGISTER" Plaque */}
        <a
          href="#register"
          className="group absolute top-[58.2%] left-[42.2%] w-[15.8%] h-[6.8%] z-30 rounded-lg flex items-center justify-center overflow-hidden transition-transform active:translate-y-1 hover:scale-105 outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
          aria-label="Register Your Squad for Genesis 2026"
        >
          {/* Subtle Shine Sweep Across the Register Button */}
          <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep opacity-75" />
          {/* Glowing Border Hover Frame */}
          <div className="absolute inset-0 rounded-lg border-2 border-yellow-300/0 group-hover:border-yellow-300 group-hover:shadow-[0_0_20px_rgba(255,183,3,0.7)] transition-all" />
        </a>

        {/* 10. LIVE TOURNAMENT COUNTDOWN & SQUADS HUD ON OBSERVATORY DECK */}
        <div className="pointer-events-auto absolute top-[66.5%] left-[22%] w-[56%] z-30 flex flex-col items-center justify-center transform scale-[0.72] sm:scale-[0.88] md:scale-95 lg:scale-100 origin-top">
          <HeroCountdown />
        </div>

        {/* 11. FUNCTIONAL INTERACTIVE HOTSPOTS: Top Navigation Items */}
        {/* Top-Left: GDAI Crest */}
        <button
          onClick={handleGdaiClick}
          className="group absolute top-[1.5%] left-[4.8%] w-[6.5%] h-[11%] z-30 rounded-lg transition-transform active:scale-95 hover:scale-105 outline-none"
          aria-label="GDAI Crest — click for celebration burst"
        >
          <div className="absolute inset-0 rounded-md group-hover:shadow-[0_0_15px_#FF4655] transition-all" />
          {isGdaiBurst && (
            <div className="pointer-events-none absolute inset-0 -inset-4 rounded-full border-4 border-red-500 animate-ping" />
          )}
        </button>


        {/* Top-Right: Hamburger Menu Button */}
        <button
          onClick={() => {
            // Trigger global HUD menu drawer button if present
            const hudDrawerBtn = document.querySelector('button[aria-label="Open navigation menu"]') as HTMLButtonElement | null;
            if (hudDrawerBtn) {
              hudDrawerBtn.click();
            }
          }}
          className="group absolute top-[7.5%] left-[89.5%] w-[8.2%] h-[8%] z-30 rounded-xl transition-all hover:scale-105 active:scale-95 outline-none"
          aria-label="Open Game Navigation Menu"
        >
          <div className="absolute inset-0 rounded-xl border border-white/0 group-hover:border-white group-hover:bg-white/10 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all" />
        </button>
      </div>

      {/* Interactive Brochure & Rulebook Modal */}
      {showBrochureModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        >
          <div className="relative w-full max-w-lg rounded-2xl border-4 border-yellow-400 bg-gradient-to-b from-[#0F1E4A] to-[#070D22] p-6 text-white shadow-[0_15px_0_#050814,0_0_50px_rgba(255,183,3,0.4)]">
            <div className="flex items-center justify-between border-b-2 border-yellow-400/30 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📄</span>
                <div>
                  <h3 className="font-heading text-2xl text-yellow-300">GENESIS 2026 BROCHURE</h3>
                  <p className="font-body text-xs text-sky-200">5th Edition Official Rulebook & Briefing</p>
                </div>
              </div>
              <button
                onClick={() => setShowBrochureModal(false)}
                className="rounded-lg bg-red-600 px-3 py-1 font-heading text-sm text-white hover:bg-red-500 active:scale-95"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="mt-4 space-y-3 font-body text-sm text-slate-200">
              <div className="rounded-xl border border-sky-500/30 bg-sky-950/40 p-3">
                <div className="font-heading text-sm text-cyan-300">🎮 TOURNAMENT TRACKS</div>
                <p className="mt-1 text-xs">
                  • <strong>Main Gaming Championship:</strong> ₹45,000 INR Cash Prize Pool<br />
                  • <strong>VR Immersion Arena:</strong> ₹15,000 INR Cash Prize Pool
                </p>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-amber-950/40 p-3">
                <div className="font-heading text-sm text-yellow-300">📍 VENUE & DATES</div>
                <p className="mt-1 text-xs">
                  • <strong>Venue:</strong> Army Institute of Technology (AIT), Pune<br />
                  • <strong>Dates:</strong> December 12–13, 2026 (Grand LAN Finale)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href="#register"
                  onClick={() => setShowBrochureModal(false)}
                  className="flex-1 rounded-xl bg-gradient-to-b from-yellow-400 to-amber-500 py-3 text-center font-heading text-black shadow-[0_4px_0_#78350F] hover:brightness-105 active:translate-y-1"
                >
                  ⚡ REGISTER NOW
                </a>
                <button
                  onClick={() => {
                    alert('Official brochure download will initiate shortly.');
                    setShowBrochureModal(false);
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 py-3 text-center font-heading text-white shadow-[0_4px_0_#0C4A6E] hover:brightness-105 active:translate-y-1"
                >
                  DOWNLOAD PDF 📥
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
