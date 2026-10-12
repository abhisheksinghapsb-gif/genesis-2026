'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Wordmark } from '../ui/Wordmark';
import { Button3D } from '../ui/Button3D';
import { Toast } from '../ui/Toast';
import { site } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { useNavigation } from '@/context/NavigationContext';

export const LandingScene: React.FC = () => {
  const { openMenu } = useNavigation();
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tapCount, setTapCount] = useState(0);
  const [showStarRain, setShowStarRain] = useState(false);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parallax on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    if (window.innerWidth >= 1024) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Easter egg: Tap badge 5 times for skull-star rain (Section 5)
  const handleBadgeTap = () => {
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    const next = tapCount + 1;
    if (next >= 5) {
      setShowStarRain(true);
      setTapCount(0);
      setTimeout(() => setShowStarRain(false), 2600);
    } else {
      setTapCount(next);
      tapTimeoutRef.current = setTimeout(() => setTapCount(0), 1500);
    }
  };

  const handleRegister = () => {
    trackEvent({ name: 'register_click', placement: 'landing' });
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
    if (site.registrationUrl && site.registrationUrl.startsWith('https://')) {
      const url = new URL(site.registrationUrl);
      if (!url.search) {
        url.searchParams.set('utm_source', 'genesis_site');
        url.searchParams.set('utm_medium', 'landing');
      }
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    } else {
      setIsToastVisible(true);
    }
  };

  // Parallax translation factors
  const px1 = mousePos.x * 4;
  const py1 = mousePos.y * 4;
  const px2 = mousePos.x * 9;
  const py2 = mousePos.y * 9;
  const px3 = mousePos.x * 14;
  const py3 = mousePos.y * 14;

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#291588] via-[#351694] to-[#9146EA] select-none">
      {/* 1. Violet Repeating Sky Pattern (§3.4) */}
      <div
        className="absolute inset-0 bg-violet-tile pointer-events-none opacity-40 z-0"
        aria-hidden="true"
      />

      {/* 2. Dome Arch at top edge */}
      <svg
        className="absolute top-0 left-0 w-full h-[100px] pointer-events-none z-10"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 0 0 L 1440 0 L 1440 25 Q 720 70 0 25 Z"
          fill="#0B093B"
        />
        <path
          d="M 0 25 Q 720 70 1440 25"
          fill="none"
          stroke="#3860F8"
          strokeWidth="4"
        />
        <path
          d="M 0 29 Q 720 74 1440 29"
          fill="none"
          stroke="#101D70"
          strokeWidth="6"
        />
      </svg>

      {/* 3. Twinkling Stars */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ transform: `translate3d(${px1}px, ${py1}px, 0)` }}
        aria-hidden="true"
      >
        {[
          { top: '15%', left: '8%', delay: '0s', size: 3 },
          { top: '22%', left: '18%', delay: '1.2s', size: 4 },
          { top: '12%', left: '28%', delay: '2.5s', size: 3 },
          { top: '35%', left: '12%', delay: '0.8s', size: 4 },
          { top: '28%', left: '38%', delay: '1.8s', size: 3 },
          { top: '16%', left: '68%', delay: '3.1s', size: 4 },
          { top: '25%', left: '85%', delay: '0.4s', size: 3 },
          { top: '38%', left: '92%', delay: '2.2s', size: 4 },
          { top: '48%', left: '82%', delay: '1.5s', size: 3 },
          { top: '55%', left: '22%', delay: '3.6s', size: 3 },
          { top: '42%', left: '6%', delay: '2.8s', size: 4 },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white shadow-[0_0_8px_#fff] animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* 4. Cosmic Floating Planets */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ transform: `translate3d(${px2}px, ${py2}px, 0)` }}
        aria-hidden="true"
      >
        {/* Planet Left (dark blue sphere ~100px at (220, 380)) */}
        <div className="absolute top-[34%] left-[12%] sm:left-[15%] w-[70px] sm:w-[96px] h-[70px] sm:h-[96px] rounded-full bg-gradient-to-tr from-[#0F1466] to-[#282FBE] shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.8),0_0_20px_rgba(40,47,190,0.5)] border border-[#4856E8]/40 animate-float" />

        {/* Planet Far Right (smaller sphere ~80px at (1262, 536)) */}
        <div
          className="hidden sm:block absolute top-[48%] right-[8%] sm:right-[11%] w-[55px] sm:w-[76px] h-[55px] sm:h-[76px] rounded-full bg-gradient-to-tr from-[#0D1259] to-[#262EB8] shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.8),0_0_16px_rgba(38,46,184,0.5)] border border-[#4856E8]/40 animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Ringed Planet Right (~245px wide centred at (1100, 280)) */}
        <div
          className="absolute top-[18%] right-[8%] sm:right-[16%] w-[150px] sm:w-[220px] md:w-[245px] h-[150px] sm:h-[220px] md:h-[245px] animate-float"
          style={{ animationDelay: '3s' }}
        >
          <svg viewBox="0 0 245 245" className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <ellipse
              cx="122"
              cy="122"
              rx="115"
              ry="45"
              fill="none"
              stroke="#2DE4FC"
              strokeWidth="10"
              transform="rotate(-22 122 122)"
              opacity="0.9"
            />
            <circle
              cx="122"
              cy="122"
              r="68"
              fill="url(#ringedPlanetGradLanding)"
            />
            <path
              d="M 20 162 C 60 195 180 195 220 162"
              fill="none"
              stroke="#2DE4FC"
              strokeWidth="10"
              transform="rotate(-22 122 122)"
            />
            <defs>
              <radialGradient id="ringedPlanetGradLanding" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#3F52E3" />
                <stop offset="60%" stopColor="#1E278B" />
                <stop offset="100%" stopColor="#0B0F47" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Shooting Star (Section 5) */}
      <div
        className="absolute top-[8%] left-[12%] w-[160px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10 animate-shooting-star"
        aria-hidden="true"
      />

      {/* 5. Giant Glowing Moon - top edge at y ~ 440 (43%) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[42%] w-[380px] sm:w-[540px] md:w-[640px] h-[380px] sm:h-[540px] md:h-[640px] rounded-full pointer-events-none z-10 animate-moon-breathe"
        style={{
          background: 'radial-gradient(circle at 45% 45%, #ACE7FD 0%, #97DDFD 50%, #79C2F5 100%)',
          boxShadow: '0 0 80px rgba(172, 231, 253, 0.7), 0 0 140px rgba(145, 70, 234, 0.5)',
          transform: `translate3d(calc(-50% + ${px1}px), ${py1}px, 0)`,
        }}
        aria-hidden="true"
      >
        <div className="absolute top-[28%] left-[22%] w-[45px] sm:w-[65px] h-[35px] sm:h-[52px] rounded-full bg-[#83C8FC]/50 transform -rotate-12" />
        <div className="absolute top-[48%] left-[16%] w-[35px] sm:w-[50px] h-[28px] sm:h-[40px] rounded-full bg-[#83C8FC]/45 transform rotate-6" />
        <div className="absolute top-[32%] right-[24%] w-[55px] sm:w-[80px] h-[42px] sm:h-[62px] rounded-full bg-[#83C8FC]/50 transform rotate-18" />
        <div className="absolute top-[58%] right-[18%] w-[40px] sm:w-[58px] h-[32px] sm:h-[46px] rounded-full bg-[#83C8FC]/40 transform -rotate-6" />
        <div className="absolute top-[18%] left-[45%] w-[48px] sm:w-[68px] h-[36px] sm:h-[52px] rounded-full bg-[#83C8FC]/45 transform rotate-4" />
      </div>

      {/* 6. Observatory Platform Floor (Layered SVG from y ~ 780 to bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-[26%] sm:h-[28%] md:h-[30%] pointer-events-none z-20">
        <svg
          viewBox="0 0 1440 300"
          className="w-full h-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="deckGlowRefined" cx="50%" cy="15%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#B3E2FF" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#2F38D9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#141870" stopOpacity="1" />
            </radialGradient>
          </defs>

          <path
            d="M 0 90 Q 720 20 1440 90 L 1440 300 L 0 300 Z"
            fill="url(#deckGlowRefined)"
          />

          <path
            d="M 0 90 Q 720 20 1440 90"
            fill="none"
            stroke="#2DE4FC"
            strokeWidth="8"
          />
          <path
            d="M 0 96 Q 720 26 1440 96"
            fill="none"
            stroke="#2541E7"
            strokeWidth="12"
          />

          <path
            d="M 360 70 L 320 300 M 720 40 L 720 300 M 1080 70 L 1120 300"
            stroke="#161A8A"
            strokeWidth="3"
            opacity="0.6"
          />
          <path
            d="M 0 160 Q 720 110 1440 160 M 0 240 Q 720 190 1440 240"
            fill="none"
            stroke="#161A8A"
            strokeWidth="3"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* 7. Scenery Objects: Left Telescope and Right Stone Blocks */}
      {/* Left Telescope on Tripod (x 0-240, y 570-855) */}
      <div
        className="absolute bottom-[10%] sm:bottom-[12%] md:bottom-[14%] left-0 z-30 pointer-events-none transform origin-bottom-left"
        style={{ transform: `translate3d(${px3}px, ${py3}px, 0)` }}
      >
        <Image
          src="/art/landing/telescope.png"
          alt=""
          width={240}
          height={300}
          className="w-[140px] sm:w-[190px] md:w-[240px] h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] animate-telescope origin-bottom"
          priority
        />
      </div>

      {/* Right Stone Block with Ringed Planet and Cube on top (x 1125-1420, y 660-855) */}
      <div
        className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] right-0 z-30 pointer-events-none transform origin-bottom-right"
        style={{ transform: `translate3d(${-px3}px, ${py3}px, 0)` }}
      >
        <svg
          width="260"
          height="220"
          viewBox="0 0 260 220"
          className="w-[140px] sm:w-[200px] md:w-[260px] h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
        >
          <polygon
            points="30,80 230,80 260,110 260,220 0,220 0,110"
            fill="#121869"
            stroke="#000"
            strokeWidth="3"
          />
          <polygon
            points="30,80 230,80 260,110 60,110"
            fill="#2A35B0"
            stroke="#000"
            strokeWidth="3"
          />
          <polygon
            points="60,110 260,110 260,220 60,220"
            fill="#19227E"
            stroke="#000"
            strokeWidth="3"
          />
          <circle cx="160" cy="165" r="28" fill="none" stroke="#2541E7" strokeWidth="4" />
          <ellipse cx="160" cy="165" rx="42" ry="14" fill="none" stroke="#2541E7" strokeWidth="4" transform="rotate(-15 160 165)" />

          <polygon points="70,25 150,25 170,45 170,95 90,95 70,75" fill="#1A248A" stroke="#000" strokeWidth="3" />
          <polygon points="70,25 150,25 170,45 90,45" fill="#3D4AD6" stroke="#000" strokeWidth="3" />
          <polygon points="90,45 170,45 170,95 90,95" fill="#2530A6" stroke="#000" strokeWidth="3" />
        </svg>
      </div>

      {/* 8. Top Hamburger Menu Button (x 1273-1411, y 80-138) */}
      <header className="absolute top-5 sm:top-8 right-5 sm:right-8 z-40">
        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          className="btn-3d-slate btn-jelly w-[56px] sm:w-[68px] md:w-[78px] h-[48px] sm:h-[54px] md:h-[58px] flex items-center justify-center cursor-pointer select-none rounded-sm"
        >
          <span className="transform skew-x-[8deg] flex flex-col items-center justify-center gap-1.5 drop-shadow-[0_2px_0_#000]">
            <span className="w-6 sm:w-7 h-[3.5px] bg-white rounded-full" />
            <span className="w-6 sm:w-7 h-[3.5px] bg-white rounded-full" />
            <span className="w-6 sm:w-7 h-[3.5px] bg-white rounded-full" />
          </span>
        </button>
      </header>

      {/* 9. Center Stage Content (Exact Positioning Matching Mockup) */}
      {/* Wordmark (GENESIS) at y ~ 115-250 (top: 11%) */}
      <div className="absolute top-[11%] left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <Wordmark size="large" />
      </div>

      {/* Winged Skull-Star Badge at y ~ 228-415 (top: 24%) - Tap 5 times easter egg */}
      <div
        onClick={handleBadgeTap}
        className="absolute top-[23%] sm:top-[24%] left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-popIn cursor-pointer active:scale-95 transition-transform"
        title="Tap 5 times!"
      >
        <Image
          src="/art/badge.png"
          alt="GENESIS skull star trophy badge"
          width={204}
          height={187}
          className="w-[120px] sm:w-[160px] md:w-[195px] h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] hover:rotate-2 transition-transform duration-200"
          priority
        />
      </div>

      {/* 5-Tap Badge Easter Egg: Skull-Star Rain (Section 5) */}
      {showStarRain && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl sm:text-3xl"
              style={{
                left: `${i * 7 + 3}%`,
                top: '-40px',
                animation: `star-fall ${1.6 + (i % 4) * 0.3}s ease-in forwards`,
                animationDelay: `${(i % 5) * 0.12}s`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {/* REGISTER Button at y ~ 598 (top: 58%) */}
      <div className="absolute top-[58%] sm:top-[59%] left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={handleRegister}
          className="btn-3d-yellow btn-jelly w-[220px] sm:w-[250px] md:w-[260px] h-[64px] sm:h-[68px] md:h-[72px] text-xl sm:text-2xl md:text-3xl tracking-wider text-outline uppercase font-display rounded-sm cursor-pointer animate-register-pulse focus:outline-none focus:ring-4 focus:ring-node-gold"
        >
          <span className="transform skew-x-[8deg]">
            REGISTER
          </span>
        </button>
      </div>

      {/* Toast Notification */}
      <Toast
        message="Registrations opening soon!"
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
};
