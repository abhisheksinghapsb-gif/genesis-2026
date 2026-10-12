'use client';

import React from 'react';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Cosmic Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,220,0.25),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(40,80,200,0.15),rgba(255,255,255,0))]" />

      {/* 2. Floating Cosmic Star Particles */}
      <div className="absolute inset-0">
        {[
          { top: '8%', left: '12%', size: 3, delay: '0s', dur: '4s' },
          { top: '15%', left: '85%', size: 4, delay: '1.2s', dur: '5s' },
          { top: '28%', left: '22%', size: 2, delay: '2.5s', dur: '3.5s' },
          { top: '42%', left: '78%', size: 5, delay: '0.8s', dur: '6s' },
          { top: '55%', left: '15%', size: 3, delay: '3.1s', dur: '4.5s' },
          { top: '68%', left: '90%', size: 4, delay: '1.7s', dur: '5.5s' },
          { top: '78%', left: '32%', size: 2, delay: '2.2s', dur: '4s' },
          { top: '88%', left: '68%', size: 3, delay: '0.5s', dur: '5s' },
          { top: '94%', left: '10%', size: 4, delay: '1.9s', dur: '6s' },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,0.8)`,
              animationDelay: star.delay,
              animationDuration: star.dur,
            }}
          />
        ))}
      </div>

      {/* 3. Floating Ringed Planet (Left margin) */}
      <div
        className="absolute top-[25%] -left-12 sm:left-4 w-28 h-28 md:w-36 md:h-36 opacity-35 animate-float pointer-events-none"
        style={{ animationDuration: '8s' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(140,70,250,0.4)]">
          <circle cx="50" cy="50" r="28" fill="url(#planetGrad1)" />
          {/* Planet Ring */}
          <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#FFD747" strokeWidth="3" transform="rotate(-25 50 50)" />
          <defs>
            <linearGradient id="planetGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#41006F" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 4. Floating Mini-Satellite / Orb (Right margin) */}
      <div
        className="absolute top-[60%] -right-8 sm:right-6 w-20 h-20 md:w-28 md:h-28 opacity-40 animate-float-slow pointer-events-none"
        style={{ animationDuration: '10s' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_24px_rgba(0,180,255,0.5)]">
          <circle cx="50" cy="50" r="20" fill="url(#orbGrad1)" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="6 4" />
          <defs>
            <linearGradient id="orbGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0051A8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Shooting Star Animation Loop */}
      <div className="absolute top-[18%] left-[20%] w-[120px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent -rotate-45 opacity-60 animate-shooting-star" />
    </div>
  );
};
