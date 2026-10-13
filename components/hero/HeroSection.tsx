'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { useHardwareCapabilities } from '@/animations/useHardwareCapabilities';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { Hero3DCanvas } from './Hero3DCanvas';
import { GenesisBrawlHero } from './GenesisBrawlHero';

export const HeroSection: React.FC = () => {
  const { containerRef, shouldAnimate, isIntersecting } = useIdleLoop({ threshold: 0.1 });
  const { shouldUseWebGL, isLowPower, downgradeToFallback } = useHardwareCapabilities();

  const [is3DReady, setIs3DReady] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Single shared smoothed pointer listener on section
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nx = Math.max(-1, Math.min(1, (e.clientX / width - 0.5) * 2));
    const ny = Math.max(-1, Math.min(1, (e.clientY / height - 0.5) * 2));
    pointerRef.current = { x: nx, y: ny };
  }, []);

  // Compute 3D state for automated verification and test assertions
  const data3dState = !shouldUseWebGL
    ? 'fallback'
    : shouldAnimate && isIntersecting
      ? 'running'
      : 'paused';

  // Handle scene ready signal
  const handleSceneReady = useCallback(() => {
    setIs3DReady(true);
  }, []);

  // When WebGL is disabled or downgraded, ensure fallback is displayed immediately
  useEffect(() => {
    if (!shouldUseWebGL) {
      setIs3DReady(false);
    }
  }, [shouldUseWebGL]);

  return (
    <section
      id="home"
      ref={containerRef}
      data-3d-state={data3dState}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#030716] via-[#071330] to-[#0A1A44] text-center select-none"
      aria-label="Genesis 2026 Hero"
    >
      {/* 1. Seamless Diagonal Tiling Watermark Pattern */}
      <WatermarkPattern opacity={0.08} animated={shouldAnimate} />

      {/* 2. Three.js Ambient Celestial Depth Layer (active when WebGL is supported) */}
      {shouldUseWebGL && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${
            is3DReady ? 'opacity-35' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <Hero3DCanvas
            shouldAnimate={shouldAnimate}
            isIntersecting={isIntersecting}
            pointerRef={pointerRef}
            isLowPower={isLowPower}
            onSceneReady={handleSceneReady}
            onDowngrade={downgradeToFallback}
          />
        </div>
      )}

      {/* 3. Official Genesis Brawl Arena Artwork with Living Animations */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <GenesisBrawlHero />
      </div>

      {/* 4. Ambient Base Floor Transition to Next Section */}
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#060D24] to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
};
