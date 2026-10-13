'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Meteor {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  delay: number;
}

export const GenesisBrawlHero: React.FC = () => {
  // Gunfire state for Colt
  const [isFiringLeft, setIsFiringLeft] = useState(false);
  const [isFiringRight, setIsFiringRight] = useState(false);
  const [coltRecoil, setColtRecoil] = useState(false);

  // Leon ninja star throw
  const [isLeonActive, setIsLeonActive] = useState(false);

  // Balloon bounce
  const [isBalloonBounced, setIsBalloonBounced] = useState(false);

  // GDAI celebration
  const [isGdaiBurst, setIsGdaiBurst] = useState(false);

  // Brochure modal
  const [showBrochureModal, setShowBrochureModal] = useState(false);

  // Dynamic falling meteors state
  const [meteors, setMeteors] = useState<Meteor[]>([]);

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

    // Fire Right gun
    setIsFiringRight(true);
    setTimeout(() => setIsFiringRight(false), 90);

    // Fire Left gun with slight delay
    setTimeout(() => {
      setIsFiringLeft(true);
      playBlasterSound();
      setTimeout(() => setIsFiringLeft(false), 90);
    }, 110);

    // Second burst on right gun
    setTimeout(() => {
      setIsFiringRight(true);
      playBlasterSound();
      setTimeout(() => {
        setIsFiringRight(false);
        setColtRecoil(false);
      }, 90);
    }, 220);
  }, [playBlasterSound]);

  // Automatic periodic gunfire loop (every ~3.6s)
  useEffect(() => {
    const fireInterval = setInterval(() => {
      triggerColtBurst();
    }, 3600);

    return () => clearInterval(fireInterval);
  }, [triggerColtBurst]);

  // Initialize falling meteors
  useEffect(() => {
    const list: Meteor[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: 30 + Math.random() * 60, // Start between 30% and 90% width
      y: 5 + Math.random() * 25,  // Start in upper cosmic sky
      length: 80 + Math.random() * 70,
      speed: 1.2 + Math.random() * 0.8,
      angle: 32 + Math.random() * 8, // Diagonal streak angle matching artwork
      delay: i * 0.9,
    }));
    setMeteors(list);
  }, []);

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
        {/* 1. STRICT BASE ARTWORK: 100% complete with every single element preserved */}
        <Image
          src="/img/hero/genesis-brawl-hero.webp"
          alt="GENESIS 2026 Official Arena Artwork"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="pointer-events-none object-cover"
        />

        {/* 2. ANIMATED LAYER: Falling Meteors across the Cosmic Sky */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10" aria-hidden="true">
          {meteors.map((m) => (
            <div
              key={m.id}
              className="absolute pointer-events-none"
              style={{
                top: `${m.y}%`,
                left: `${m.x}%`,
                transform: `rotate(${m.angle}deg)`,
                transformOrigin: 'left center',
              }}
            >
              <div
                className="animate-meteor-fall"
                style={{
                  width: `${m.length}px`,
                  height: '2px',
                  animationDelay: `${m.delay}s`,
                  animationDuration: `${2.4 / m.speed}s`,
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,105,180,0.85) 30%, rgba(138,43,226,0.5) 70%, transparent 100%)',
                  boxShadow: '0 0 12px 2px rgba(255, 105, 180, 0.65)',
                }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_4px_#FFF,0_0_20px_6px_#FF69B4]" />
              </div>
            </div>
          ))}
        </div>

        {/* Accessible H1 Title aligned over Artwork title for SEO and Test assertions */}
        <h1 className="pointer-events-none absolute top-[25.5%] left-1/2 -translate-x-1/2 font-heading text-transparent select-none text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase drop-shadow-[0_0_25px_rgba(255,183,3,0.35)] z-20">
          GENESIS 2026
        </h1>

        {/* 3. ANIMATED LAYER: Twinkling Cosmic Stars in Space */}
        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          {/* Top-left stars */}
          <div className="absolute top-[14%] left-[12%] h-2.5 w-2.5 rounded-full bg-white animate-ping opacity-75" style={{ animationDuration: '3.1s' }} />
          <div className="absolute top-[22%] left-[21%] h-2 w-2 rounded-full bg-cyan-200 animate-pulse" style={{ animationDuration: '2.2s' }} />
          <div className="absolute top-[31%] left-[16%] h-3 w-3 rounded-full bg-amber-200 animate-ping opacity-60" style={{ animationDuration: '4.2s' }} />
          <div className="absolute top-[18%] left-[7%] h-1.5 w-1.5 rounded-full bg-white animate-pulse" style={{ animationDuration: '1.8s' }} />

          {/* Top-center stars behind title */}
          <div className="absolute top-[8%] left-[45%] h-2 w-2 rounded-full bg-pink-200 animate-pulse" style={{ animationDuration: '2.5s' }} />
          <div className="absolute top-[12%] left-[58%] h-2.5 w-2.5 rounded-full bg-white animate-ping opacity-80" style={{ animationDuration: '3.8s' }} />

          {/* Top-right stars near ringed planet */}
          <div className="absolute top-[16%] left-[82%] h-3 w-3 rounded-full bg-purple-200 animate-ping opacity-70" style={{ animationDuration: '3.3s' }} />
          <div className="absolute top-[28%] left-[89%] h-2 w-2 rounded-full bg-cyan-200 animate-pulse" style={{ animationDuration: '2.1s' }} />
          <div className="absolute top-[36%] left-[94%] h-2.5 w-2.5 rounded-full bg-white animate-pulse" style={{ animationDuration: '2.9s' }} />
          <div className="absolute top-[24%] left-[73%] h-1.5 w-1.5 rounded-full bg-amber-100 animate-ping opacity-75" style={{ animationDuration: '4.5s' }} />

          {/* Center-left space rocks glow */}
          <div className="absolute top-[41%] left-[8%] h-2 w-2 rounded-full bg-sky-300 animate-pulse" style={{ animationDuration: '3.0s' }} />
          <div className="absolute top-[48%] left-[12%] h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDuration: '2.4s' }} />
        </div>

        {/* 4. ANIMATED LAYER: Moon Atmosphere Pulse */}
        <div
          className="pointer-events-none absolute top-[52%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[38%] w-[42%] rounded-full bg-cyan-400/20 blur-2xl animate-pulse z-10"
          style={{ animationDuration: '4.8s' }}
          aria-hidden="true"
        />

        {/* 5. ANIMATED LAYER: Winged Skull Crest Aura & Wing Movement */}
        <div
          className="pointer-events-none absolute top-[33.2%] left-[50.2%] -translate-x-1/2 -translate-y-1/2 z-15"
          aria-hidden="true"
        >
          {/* Radiant Golden Glow */}
          <div className="absolute -inset-8 rounded-full bg-amber-400/25 blur-xl animate-pulse" style={{ animationDuration: '2.4s' }} />
          {/* Subtle Wing Shimmer Beam */}
          <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shine-sweep opacity-75" />
        </div>

        {/* 6. ANIMATED LAYER: Colt Gun Fire, Muzzle Flashes & Recoil */}
        {/* Colt interactive hotspot container */}
        <div
          onClick={triggerColtBurst}
          className="absolute top-[38%] left-[14%] w-[25%] h-[38%] z-20 cursor-pointer group"
          title="Click Colt to fire weapons!"
          style={{
            transform: coltRecoil ? 'translate3d(0, -5px, 0) scale(1.02)' : 'translate3d(0, 0, 0)',
            transition: 'transform 0.08s cubic-bezier(0.1, 0.9, 0.2, 1)',
          }}
        >
          {/* Gun 1: Upward Gun Barrel Muzzle Flash (at ~left 18%, top 48% of canvas) */}
          <div
            className={`pointer-events-none absolute top-[28%] left-[18%] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ${
              isFiringLeft ? 'opacity-100 scale-125' : 'opacity-0 scale-50'
            }`}
          >
            {/* Multi-point explosive star burst */}
            <div className="relative flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-yellow-300 blur-sm animate-pulse" />
              <div className="absolute h-20 w-8 -rotate-12 bg-gradient-to-t from-orange-500 via-yellow-200 to-white rounded-full shadow-[0_0_25px_8px_#FFB703]" />
              <div className="absolute h-8 w-16 rotate-45 bg-gradient-to-r from-orange-500 via-yellow-100 to-white rounded-full" />
              <div className="absolute h-5 w-5 rounded-full bg-white shadow-[0_0_20px_6px_#FFF]" />
              {/* Bullet spark particles flying up */}
              <div className="absolute -top-6 left-2 h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_8px_#FFF]" />
              <div className="absolute -top-10 -left-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_#FFB703]" />
            </div>
          </div>

          {/* Gun 2: Forward Pointing Gun Barrel Muzzle Flash (at ~left 38%, top 55% of canvas) */}
          <div
            className={`pointer-events-none absolute top-[43%] left-[96%] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ${
              isFiringRight ? 'opacity-100 scale-125' : 'opacity-0 scale-50'
            }`}
          >
            {/* Horizontal Forward Blast Cone */}
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-cyan-300 blur-sm" />
              <div className="absolute h-8 w-24 bg-gradient-to-r from-cyan-400 via-yellow-200 to-white rounded-full shadow-[0_0_30px_10px_#00E5FF]" />
              <div className="absolute h-18 w-10 rotate-12 bg-gradient-to-b from-orange-400 via-yellow-200 to-white rounded-full" />
              <div className="absolute h-6 w-6 rounded-full bg-white shadow-[0_0_20px_6px_#FFF]" />
              {/* Laser projectile blast beam */}
              <div className="absolute left-16 h-2 w-28 bg-gradient-to-r from-yellow-300 via-cyan-200 to-transparent rounded-full shadow-[0_0_15px_#00E5FF]" />
            </div>
          </div>

          {/* Colt Hover Cue Pill */}
          <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/90 text-white font-heading text-[11px] px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-lg tracking-wider">
            TAP TO FIRE 💥
          </div>
        </div>

        {/* 7. ANIMATED LAYER: Leon Ninja Shuriken Star & Hands Movement */}
        <div
          onClick={handleLeonClick}
          className="absolute top-[42%] left-[63%] w-[25%] h-[38%] z-20 cursor-pointer group"
          title="Click Leon to throw ninja star!"
        >
          {/* Shuriken Star placed over Leon's hand */}
          <div
            className={`absolute top-[48%] left-[7%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
              isLeonActive ? 'scale-150' : 'scale-100'
            }`}
            style={{
              animation: 'spin 1.4s linear infinite',
            }}
          >
            {/* Shuriken Ninja Star SVG Overlay with Purple Glow */}
            <svg width="42" height="42" viewBox="0 0 42 42" className="drop-shadow-[0_0_12px_rgba(168,85,247,0.9)]">
              <path
                d="M21 0 L25 15 L40 18 L27 26 L30 42 L18 31 L6 38 L13 24 L0 18 L16 14 Z"
                fill="#C084FC"
                stroke="#6B21A8"
                strokeWidth="1.5"
              />
              <circle cx="21" cy="21" r="3.5" fill="#581C87" stroke="#E9D5FF" strokeWidth="1" />
            </svg>
          </div>

          {/* Flying projectile when clicked */}
          {isLeonActive && (
            <div className="pointer-events-none absolute top-[48%] -left-12 h-2 w-32 bg-gradient-to-l from-purple-400 via-pink-300 to-transparent rounded-full animate-ping shadow-[0_0_20px_#A855F7]" />
          )}

          {/* Leon Hover Cue */}
          <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600/90 text-white font-heading text-[11px] px-2.5 py-0.5 rounded-full border border-yellow-300 shadow-lg tracking-wider">
            THROW STAR ⭐
          </div>
        </div>

        {/* 8. ANIMATED LAYER: Floating Balloon Character with Speech Bubble */}
        <div
          onClick={handleBalloonClick}
          className={`absolute top-[70%] left-[84%] w-[15%] h-[28%] z-20 cursor-pointer group transition-transform ${
            isBalloonBounced ? 'scale-110 -translate-y-2' : ''
          }`}
          style={{
            animation: 'gentle-float 3s ease-in-out infinite',
          }}
          title="Click balloon to bounce!"
        >
          {/* Glowing Aura on Balloon Head */}
          <div className="absolute top-[28%] left-[64%] -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-cyan-300/20 blur-md group-hover:bg-cyan-300/40 transition-colors" />

          {/* Balloon Click Ripple Effect */}
          {isBalloonBounced && (
            <div className="pointer-events-none absolute top-[28%] left-[64%] -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border-2 border-cyan-400 animate-ping" />
          )}
        </div>

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

        {/* 10. FUNCTIONAL INTERACTIVE HOTSPOTS: Top Navigation Items */}
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

        {/* Top Nav: BROCHURE */}
        <button
          onClick={() => setShowBrochureModal(true)}
          className="group absolute top-[4.2%] left-[18.2%] w-[19%] h-[6.2%] z-30 rounded-xl transition-all hover:scale-105 active:scale-95 outline-none"
          aria-label="Open Event Brochure and Rulebook"
        >
          <div className="absolute inset-0 rounded-xl border border-cyan-400/0 group-hover:border-cyan-400 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all" />
        </button>

        {/* Top Nav: PRIZE */}
        <a
          href="#prizes"
          className="group absolute top-[4.2%] left-[40.2%] w-[16%] h-[6.2%] z-30 rounded-xl transition-all hover:scale-105 active:scale-95 outline-none"
          aria-label="View ₹60,000 Prize Pool"
        >
          <div className="absolute inset-0 rounded-xl border border-yellow-400/0 group-hover:border-yellow-400 group-hover:bg-yellow-500/10 group-hover:shadow-[0_0_15px_rgba(255,183,3,0.4)] transition-all" />
        </a>

        {/* Top Nav: SPONSORS */}
        <a
          href="#sponsors"
          className="group absolute top-[4.2%] left-[62.8%] w-[19%] h-[6.2%] z-30 rounded-xl transition-all hover:scale-105 active:scale-95 outline-none"
          aria-label="View Event Sponsors"
        >
          <div className="absolute inset-0 rounded-xl border border-green-400/0 group-hover:border-green-400 group-hover:bg-green-500/10 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all" />
        </a>

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
