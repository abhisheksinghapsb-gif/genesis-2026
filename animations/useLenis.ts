'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only enable Lenis smooth scroll on desktop devices with fine pointer (mouse/trackpad)
    const isTouchDevice =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches);

    // Also check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      // Keep native responsive scrolling on touch & reduced motion devices
      return;
    }

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, offset: number = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return { scrollTo, lenis: lenisRef };
}
