'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from './tokens';

export function useMotionPreference() {
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChoice = localStorage.getItem(STORAGE_KEYS.reducedMotion);
      const systemPreference = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (savedChoice !== null) {
        setIsReducedMotion(savedChoice === 'true');
      } else {
        setIsReducedMotion(systemPreference);
      }
    }
  }, []);

  const toggleMotion = useCallback(() => {
    setIsReducedMotion((prev) => {
      const nextState = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.reducedMotion, String(nextState));
        if (nextState) {
          document.documentElement.classList.add('reduced-motion');
        } else {
          document.documentElement.classList.remove('reduced-motion');
        }
      }
      return nextState;
    });
  }, []);

  return {
    isReducedMotion,
    toggleMotion,
  };
}
