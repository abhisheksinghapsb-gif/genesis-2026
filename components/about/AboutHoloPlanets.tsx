'use client';

import React, { useState } from 'react';

export interface AboutHoloPlanetsProps {
  speedBoost?: boolean;
}

interface PlanetState {
  id: number;
  color: string;
  glow: string;
  label: string;
  isPopped: boolean;
}

export const AboutHoloPlanets: React.FC<AboutHoloPlanetsProps> = ({ speedBoost = false }) => {
  const [planets, setPlanets] = useState<PlanetState[]>([
    { id: 1, color: 'from-[#00E5FF] to-[#0077FF]', glow: '#00E5FF', label: 'VR CORE', isPopped: false },
    { id: 2, color: 'from-[#FFB703] to-[#FF5400]', glow: '#FFB703', label: 'ARENA', isPopped: false },
    { id: 3, color: 'from-[#E040FB] to-[#7C4DFF]', glow: '#E040FB', label: 'NEXUS', isPopped: false },
  ]);

  const popPlanet = (id: number) => {
    setPlanets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPopped: true } : p)),
    );
    setTimeout(() => {
      setPlanets((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPopped: false } : p)),
      );
    }, 1500);
  };

  const orbitDurations = speedBoost ? ['4s', '5s', '6s'] : ['9s', '11s', '13s'];

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden" aria-hidden="true">
      {/* Holo Planet 1 */}
      {!planets[0]?.isPopped && (
        <button
          type="button"
          onClick={() => popPlanet(1)}
          aria-label="Hologram Planet VR Core"
          className="pointer-events-auto absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
          style={{
            animation: `gentle-float ${orbitDurations[0]} ease-in-out infinite`,
            transform: 'translate3d(-140px, -90px, 0)',
          }}
        >
          <div className="relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#0077FF] shadow-[0_0_20px_#00E5FF] border border-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          </div>
        </button>
      )}

      {/* Holo Planet 2 */}
      {!planets[1]?.isPopped && (
        <button
          type="button"
          onClick={() => popPlanet(2)}
          aria-label="Hologram Planet Arena"
          className="pointer-events-auto absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
          style={{
            animation: `gentle-float ${orbitDurations[1]} ease-in-out infinite`,
            animationDelay: '-3s',
            transform: 'translate3d(150px, -60px, 0)',
          }}
        >
          <div className="relative flex h-9 w-9 md:h-12 md:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#FFB703] to-[#FF5400] shadow-[0_0_20px_#FFB703] border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          </div>
        </button>
      )}

      {/* Holo Planet 3 */}
      {!planets[2]?.isPopped && (
        <button
          type="button"
          onClick={() => popPlanet(3)}
          aria-label="Hologram Planet Nexus"
          className="pointer-events-auto absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
          style={{
            animation: `gentle-float ${orbitDurations[2]} ease-in-out infinite`,
            animationDelay: '-6s',
            transform: 'translate3d(110px, 120px, 0)',
          }}
        >
          <div className="relative flex h-8 w-8 md:h-11 md:w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#E040FB] to-[#7C4DFF] shadow-[0_0_20px_#E040FB] border border-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          </div>
        </button>
      )}
    </div>
  );
};
