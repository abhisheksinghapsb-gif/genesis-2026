'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { SceneProps } from '@/three/Scene';

// Lazy-load the Three.js scene chunk dynamically with ssr: false
const LazyScene = dynamic<SceneProps>(() => import('@/three/Scene'), {
  ssr: false,
});

export interface Hero3DCanvasProps {
  shouldAnimate: boolean;
  isIntersecting: boolean;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  isLowPower: boolean;
  onSceneReady: () => void;
  onDowngrade: (reason: string) => void;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  shouldAnimate,
  isIntersecting,
  pointerRef,
  isLowPower,
  onSceneReady,
  onDowngrade,
}) => {
  const [shouldMount, setShouldMount] = useState(false);
  const [isCrossfaded, setIsCrossfaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount only after requestIdleCallback AND when hero is intersecting
  useEffect(() => {
    if (!isIntersecting) return;

    let idleId: number | NodeJS.Timeout;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
        () => {
          setShouldMount(true);
        },
      );
    } else {
      idleId = setTimeout(() => {
        setShouldMount(true);
      }, 100);
    }

    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && typeof idleId === 'number') {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as NodeJS.Timeout);
      }
    };
  }, [isIntersecting]);

  // Track scroll progress of hero (0..1)
  useEffect(() => {
    if (!shouldMount) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldMount]);

  const handleReady = () => {
    // 400ms crossfade
    setIsCrossfaded(true);
    setTimeout(() => {
      onSceneReady();
    }, 400);
  };

  if (!shouldMount) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 h-full w-full transition-opacity duration-400 ${
        isCrossfaded ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <LazyScene
        shouldAnimate={shouldAnimate}
        scrollProgress={scrollProgress}
        pointerRef={pointerRef}
        isLowPower={isLowPower}
        onReady={handleReady}
        onDowngrade={onDowngrade}
      />
    </div>
  );
};
