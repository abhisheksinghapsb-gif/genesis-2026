'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wordmark } from '../ui/Wordmark';
import { Button3D } from '../ui/Button3D';
import { NpcDialogBubble } from '../ui/NpcDialogBubble';
import { StarBurst } from '../motion/StarBurst';
import { FloatLoop } from '../motion/FloatLoop';
import { siteConfig } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { sound } from '@/lib/audio';

interface HeroSceneProps {
  onToast: (msg: string) => void;
  scrollProgress?: number; // 0 to 1 for hero pinned section
}

export const HeroScene: React.FC<HeroSceneProps> = ({ onToast, scrollProgress = 0 }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [badgeClicks, setBadgeClicks] = useState(0);
  const [starBurstActive, setStarBurstActive] = useState(false);
  const [telescopeAngle, setTelescopeAngle] = useState(0);
  const [spinningPlanet, setSpinningPlanet] = useState<number | null>(null);
  const [cubeSpinning, setCubeSpinning] = useState(false);

  // Parallax on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRegister = () => {
    sound.playTap();
    trackEvent('register_click', { placement: 'landing' });
    const regElem = document.getElementById('register');
    if (regElem) {
      regElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      onToast('Registrations opening soon! Stay tuned, Brawler.');
    }
  };

  const handleBadgeClick = () => {
    sound.playPop();
    const newCount = badgeClicks + 1;
    setBadgeClicks(newCount);
    if (newCount === 5) {
      sound.playUnlock();
      setStarBurstActive(true);
      onToast('Star Power unlocked! ⭐ (Easter Egg 1/2)');
    }
  };

  // Parallax translation factors
  const px1 = mousePos.x * 4;
  const py1 = mousePos.y * 4;
  const px2 = mousePos.x * 10;
  const py2 = mousePos.y * 10;
  const px3 = mousePos.x * 16;
  const py3 = mousePos.y * 16;

  // Moon dive scroll progression: scales from 1 to 9 as visitor scrolls
  const moonScale = 1 + scrollProgress * 7;
  const moonOpacity = Math.max(0, 1 - scrollProgress * 0.9);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#291588] via-[#351694] to-[#9146EA] select-none perspective-1200 preserve-3d">
      {/* 1. Violet Repeating Sky Pattern */}
      <div
        className="absolute inset-0 bg-violet-tile pointer-events-none opacity-40 z-0 transition-opacity"
        style={{ opacity: 0.4 * (1 - scrollProgress * 0.6) }}
        aria-hidden="true"
      />

      {/* 2. Observatory Dome Arch at top edge */}
      <svg
        className="absolute top-0 left-0 w-full h-[100px] pointer-events-none z-10 transition-transform"
        style={{
          transform: `rotateX(${scrollProgress * 12}deg)`,
          transformOrigin: 'top center',
        }}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 0 0 L 1440 0 L 1440 25 Q 720 70 0 25 Z" fill="#0B093B" />
        <path d="M 0 25 Q 720 70 1440 25" fill="none" stroke="#3860F8" strokeWidth="4" />
        <path d="M 0 29 Q 720 74 1440 29" fill="none" stroke="#101D70" strokeWidth="6" />
      </svg>

      {/* 3. Twinkling Stars & Shooting Star */}
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
          { top: '48%', left: '80%', delay: '1.5s', size: 3 },
          { top: '18%', left: '48%', delay: '0.9s', size: 3 },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute bg-white rounded-full animate-twinkle"
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

      {/* 4. Floating Cosmic Planets */}
      {/* 4a. Left Blue Planet */}
      <div
        onClick={() => {
          sound.playPop();
          setSpinningPlanet(1);
          setTimeout(() => setSpinningPlanet(null), 1000);
        }}
        className="absolute top-[28%] sm:top-[30%] left-[8%] sm:left-[12%] w-16 h-16 sm:w-24 sm:h-24 pointer-events-auto cursor-pointer z-10"
        style={{
          transform: `translate3d(${px2}px, ${py2}px, -500px)`,
        }}
      >
        <FloatLoop duration={7} distance={10} rotate={3}>
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br from-[#3D52FF] via-[#1F27A6] to-[#0A0D4A] shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.5)] ${
              spinningPlanet === 1 ? 'animate-spin' : ''
            }`}
          />
        </FloatLoop>
      </div>

      {/* 4b. Right Cyan-Ringed Planet */}
      <div
        onClick={() => {
          sound.playPop();
          setSpinningPlanet(2);
          setTimeout(() => setSpinningPlanet(null), 1000);
        }}
        className="absolute top-[18%] sm:top-[20%] right-[10%] sm:right-[15%] w-28 h-28 sm:w-44 sm:h-44 pointer-events-auto cursor-pointer z-10"
        style={{
          transform: `translate3d(${px3}px, ${py3}px, -500px)`,
        }}
      >
        <FloatLoop duration={8} distance={12} rotate={-3}>
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              spinningPlanet === 2 ? 'animate-spin' : ''
            }`}
          >
            {/* Planet Body */}
            <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#4056F4] via-[#2027A8] to-[#0B0D45] shadow-[inset_0_6px_12px_rgba(255,255,255,0.4),0_12px_28px_rgba(0,0,0,0.6)] z-10" />
            {/* Glowing Ring */}
            <div
              className="absolute w-28 h-8 sm:w-44 sm:h-12 border-[5px] sm:border-[7px] border-[#2CE8F5] rounded-full shadow-[0_0_20px_#2CE8F5] transform -rotate-[22deg] z-20 pointer-events-none"
              style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 65%, 0% 65%)' }}
            />
            <div
              className="absolute w-28 h-8 sm:w-44 sm:h-12 border-[5px] sm:border-[7px] border-[#18A2B8] rounded-full transform -rotate-[22deg] z-0 pointer-events-none"
              style={{ clipPath: 'polygon(0% 65%, 100% 65%, 100% 100%, 0% 100%)' }}
            />
          </div>
        </FloatLoop>
      </div>

      {/* 4c. Small Distant Blue Planet */}
      <div
        className="absolute top-[44%] right-[8%] sm:right-[10%] w-12 h-12 sm:w-16 sm:h-16 pointer-events-none z-10"
        style={{ transform: `translate3d(${px1}px, ${py1}px, -600px)` }}
      >
        <FloatLoop duration={6} distance={8} rotate={2}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#3D52FF] via-[#1E25A0] to-[#0A0D4A] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_6px_16px_rgba(0,0,0,0.5)]" />
        </FloatLoop>
      </div>

      {/* 5. Giant Glowing Moon (Moon Dive Actor) */}
      <div
        className="absolute bottom-[-15%] sm:bottom-[-20%] left-1/2 -translate-x-1/2 w-[460px] h-[460px] sm:w-[680px] sm:h-[680px] md:w-[840px] md:h-[840px] rounded-full pointer-events-none z-10 transform-gpu transition-all duration-100 ease-out"
        style={{
          transform: `translate3d(-50%, ${scrollProgress * 200}px, -300px) scale(${moonScale})`,
          opacity: moonOpacity,
          background: 'radial-gradient(circle at 50% 50%, #B2F0FF 0%, #90D5FD 45%, #62B3FC 75%, #3B82F6 100%)',
          boxShadow: '0 0 100px 30px rgba(162, 235, 255, 0.45)',
        }}
        aria-hidden="true"
      >
        {/* Soft Moon Craters */}
        <div className="absolute top-[28%] left-[22%] w-16 h-12 sm:w-28 sm:h-20 bg-[#7BC5FA]/40 rounded-full blur-[1px] transform -rotate-12" />
        <div className="absolute top-[52%] left-[45%] w-24 h-16 sm:w-36 sm:h-24 bg-[#7BC5FA]/35 rounded-full blur-[1px] transform rotate-6" />
        <div className="absolute top-[36%] right-[24%] w-14 h-10 sm:w-20 sm:h-16 bg-[#7BC5FA]/30 rounded-full blur-[1px]" />
      </div>

      {/* 6. Observatory Stone Deck Platform */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[140px] sm:h-[180px] md:h-[220px] pointer-events-none z-20 overflow-hidden"
        style={{
          transform: `translate3d(0, ${scrollProgress * 40}px, -100px)`,
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="floorGlow" cx="50%" cy="0%" r="60%">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#1E3A8A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0B1336" stopOpacity="1" />
            </radialGradient>
          </defs>
          <path d="M 0 45 Q 720 0 1440 45 L 1440 220 L 0 220 Z" fill="url(#floorGlow)" />
          <path d="M 0 45 Q 720 0 1440 45" fill="none" stroke="#2541E7" strokeWidth="6" />
          <path d="M 0 49 Q 720 4 1440 49" fill="none" stroke="#00FFFF" strokeWidth="2" opacity="0.8" />
          <line x1="720" y1="22" x2="720" y2="220" stroke="#1D4ED8" strokeWidth="2" opacity="0.6" />
          <line x1="360" y1="36" x2="300" y2="220" stroke="#1D4ED8" strokeWidth="1.5" opacity="0.4" />
          <line x1="1080" y1="36" x2="1140" y2="220" stroke="#1D4ED8" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>

      {/* 7. Foreground Left: Scanning Telescope */}
      <div
        onMouseEnter={() => setTelescopeAngle(8)}
        onMouseLeave={() => setTelescopeAngle(0)}
        className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-0 sm:left-4 md:left-8 w-[140px] sm:w-[180px] md:w-[220px] lg:w-[250px] z-30 pointer-events-auto cursor-pointer transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${px3 - scrollProgress * 140}px, ${py3}px, -50px) rotate(${telescopeAngle}deg)`,
          transformOrigin: 'bottom left',
        }}
        title="GDXR Observatory Telescope — hover to tilt"
      >
        <Image
          src="/art/landing/telescope.png"
          alt="Observatory Telescope"
          width={250}
          height={300}
          className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] animate-sway"
          priority
        />
      </div>

      {/* 8. Foreground Right: Interactive Stone Blocks & Hovering Cube */}
      <div
        className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-0 sm:right-4 md:right-8 w-[130px] sm:w-[160px] md:w-[200px] lg:w-[230px] z-30 pointer-events-auto"
        style={{
          transform: `translate3d(${px3 + scrollProgress * 140}px, ${py3}px, -50px)`,
        }}
      >
        <div className="relative w-full aspect-[4/3]">
          {/* Main Block Box */}
          <div className="absolute bottom-0 right-0 w-[88%] h-[68%] bg-[#0A1647] border-[3px] border-black rounded-lg shadow-[inset_0_4px_8px_rgba(59,130,246,0.3),0_8px_20px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <svg viewBox="0 0 60 60" className="w-10 h-10 text-[#2563EB] opacity-60">
              <ellipse cx="30" cy="30" rx="14" ry="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <ellipse cx="30" cy="30" rx="24" ry="7" fill="none" stroke="currentColor" strokeWidth="2.5" transform="rotate(-25 30 30)" />
            </svg>
          </div>
          {/* Upper Stepped Block */}
          <div className="absolute top-[16%] right-[12%] w-[42%] h-[36%] bg-[#0D1E61] border-[3px] border-black rounded-md shadow-[inset_0_3px_6px_rgba(59,130,246,0.4)]" />
          {/* Interactive Floating Cube */}
          <div
            onClick={() => {
              sound.playTap();
              setCubeSpinning(true);
              setTimeout(() => setCubeSpinning(false), 800);
            }}
            className={`absolute -top-[10%] right-[22%] w-[28%] h-[28%] bg-[#1E3A8A] border-2 border-black rounded shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 transition-transform ${
              cubeSpinning ? 'animate-spin' : 'animate-float'
            }`}
            title="Cosmic Stone Cube — click to spin"
          />
        </div>
      </div>

      {/* 9. Central Hero Elements: Wordmark, Winged Badge, REGISTER CTA */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-4 pt-12 sm:pt-6 pointer-events-none">
        {/* Outlined Bouncy Wordmark */}
        <div
          className="transform-gpu transition-all duration-300"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 100}px, 0) scale(${Math.max(0.7, 1 - scrollProgress * 0.3)})`,
          }}
        >
          <Wordmark text="GENESIS" />
        </div>

        {/* Winged Skull-Star Badge with 5x tap easter egg & StarBurst */}
        <div
          onClick={handleBadgeClick}
          className="relative mt-2 sm:mt-3 mb-6 sm:mb-8 pointer-events-auto cursor-pointer transform-gpu hover:scale-110 active:scale-95 transition-all"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 80}px, 40px) rotateY(${scrollProgress * 720}deg)`,
          }}
          title="GENESIS 2026 Champion Badge — tap me!"
        >
          <FloatLoop duration={4} distance={6} rotate={0}>
            <Image
              src="/art/badge.png"
              alt="GENESIS 2026 Champion Badge"
              width={160}
              height={140}
              className="w-24 h-auto sm:w-32 md:w-40 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] animate-pulse-glow"
              priority
            />
          </FloatLoop>
          <StarBurst active={starBurstActive} onComplete={() => setStarBurstActive(false)} />
        </div>

        {/* Primary REGISTER Button */}
        <div
          className="pointer-events-auto transform-gpu transition-all"
          style={{
            transform: `translate3d(0, ${scrollProgress * 40}px, 60px)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.5),
          }}
        >
          <Button3D
            variant="yellow"
            className="px-10 sm:px-14 md:px-16 py-3.5 sm:py-4 text-xl sm:text-2xl md:text-3xl font-display uppercase tracking-wider animate-register-pulse"
            onClick={handleRegister}
          >
            REGISTER
          </Button3D>
        </div>

        {/* NPC Welcome Dialogue Bubble */}
        <div
          className="absolute bottom-6 left-4 sm:left-8 pointer-events-auto hidden sm:block transform-gpu"
          style={{
            transform: `translate3d(0, ${scrollProgress * 80}px, 50px)`,
            opacity: Math.max(0, 1 - scrollProgress * 2),
          }}
        >
          <NpcDialogBubble
            avatar="villager"
            characterName="COLT"
            dialogue="WELCOME TO THE BRAWL OBSERVATORY, TECH CHIEFS - DEPLOY BRAINS NOT BARBARIANS!"
            position="left"
          />
        </div>
      </div>
    </div>
  );
};
