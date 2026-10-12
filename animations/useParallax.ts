'use client';

import { useState, useEffect, useRef } from 'react';

export interface ParallaxOffsets {
  farX: number;
  farY: number;
  midX: number;
  midY: number;
  nearX: number;
  nearY: number;
}

export function useParallax() {
  const [offsets, setOffsets] = useState<ParallaxOffsets>({
    farX: 0,
    farY: 0,
    midX: 0,
    midY: 0,
    nearX: 0,
    nearY: 0,
  });

  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    // Desktop mousemove tracking
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetRef.current = {
        x: (e.clientX - centerX) / centerX, // -1 to 1
        y: (e.clientY - centerY) / centerY, // -1 to 1
      };
    };

    // Mobile gyroscope tracking
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right (-90 to 90), beta: front-to-back (-180 to 180)
        targetRef.current = {
          x: Math.max(-1, Math.min(1, e.gamma / 30)),
          y: Math.max(-1, Math.min(1, (e.beta - 45) / 30)),
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    if (typeof window.DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    // Smooth lerp frame loop
    const animate = () => {
      const ease = 0.08;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease;

      const normX = currentRef.current.x;
      const normY = currentRef.current.y;

      setOffsets({
        farX: normX * 8,
        farY: normY * 8,
        midX: normX * 18,
        midY: normY * 18,
        nearX: normX * 32,
        nearY: normY * 32,
      });

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return offsets;
}
