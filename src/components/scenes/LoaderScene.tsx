'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const TIPS = [
  'Tip: Tap the skull badge 5 times on the home screen to unlock Star Power! ⭐',
  'Tip: You can use keys 1 to 8 on your keyboard to instantly warp between stages.',
  'Tip: Tilt your phone or move your mouse to explore hidden 3D holographic layers.',
  'Tip: Click on any timeline node to view full stage guidelines and requirements.',
  'Tip: Check out the VR Track for special hardware showcases and prizes.',
];

interface LoaderSceneProps {
  onComplete: () => void;
}

export const LoaderScene: React.FC<LoaderSceneProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [doorsOpening, setDoorsOpening] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if previously loaded in this session or reduced motion
    if (typeof window !== 'undefined') {
      const alreadyLoaded = sessionStorage.getItem('genesis_loaded');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (alreadyLoaded || prefersReduced) {
        setShouldRender(false);
        onComplete();
        return;
      }
    }

    setTipIndex(Math.floor(Math.random() * TIPS.length));

    // Fill progress bar smoothly up to 100% over ~1.1s
    const startTime = performance.now();
    const duration = 1100;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDoorsOpening(true);
          setTimeout(() => {
            sessionStorage.setItem('genesis_loaded', 'true');
            setShouldRender(false);
            onComplete();
          }, 600);
        }, 150);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[999] pointer-events-auto flex items-center justify-center overflow-hidden"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Left Stone Door */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#291588] border-r-4 border-black transition-transform duration-600 ease-in-out ${
          doorsOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Right Stone Door */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#291588] border-l-4 border-black transition-transform duration-600 ease-in-out ${
          doorsOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      {/* Central Content */}
      <div
        className={`relative z-10 flex flex-col items-center max-w-sm px-6 text-center transition-opacity duration-300 ${
          doorsOpening ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {/* Spinning 3D Coin Badge */}
        <div className="w-24 h-24 mb-6 animate-coin-spin preserve-3d">
          <Image
            src="/art/badge.png"
            alt="Genesis Badge"
            width={96}
            height={96}
            className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            priority
          />
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl text-white text-outline-sm tracking-wider mb-4">
          ENTERING THE ARENA...
        </h2>

        {/* Chunky Progress Bar */}
        <div className="w-full h-6 bg-black/80 p-1 rounded-full border-2 border-black shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-4">
          <div
            className="h-full bg-gradient-to-r from-cta-yellow to-cta-yellow-hi rounded-full -skew-x-12 transition-all duration-75 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Tip */}
        <p className="text-xs text-cream/90 font-sans tracking-wide min-h-[36px] drop-shadow">
          {TIPS[tipIndex]}
        </p>
      </div>
    </div>
  );
};
