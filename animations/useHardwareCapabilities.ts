'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HardwareCapabilities {
  shouldUseWebGL: boolean;
  isLowPower: boolean;
  hasReducedMotion: boolean;
  isTouchDevice: boolean;
  downgradeToFallback: (reason?: string) => void;
}

export function useHardwareCapabilities(): HardwareCapabilities {
  const [capabilities, setCapabilities] = useState<HardwareCapabilities>({
    shouldUseWebGL: false, // Default false for SSR and initial paint
    isLowPower: false,
    hasReducedMotion: false,
    isTouchDevice: false,
    downgradeToFallback: () => {},
  });

  const downgradeToFallback = useCallback((reason?: string) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('genesis_3d_disabled', 'true');
        if (reason) {
          console.warn(`[Genesis 3D] Downgraded to CSS fallback: ${reason}`);
        }
      } catch {
        // Ignore sessionStorage restrictions in private browsing
      }
    }
    setCapabilities((prev) => ({
      ...prev,
      shouldUseWebGL: false,
    }));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check URL override (?3d=off or ?3d=on)
    const urlParams = new URLSearchParams(window.location.search);
    const force3DOff = urlParams.get('3d') === 'off';
    const force3DOn = urlParams.get('3d') === 'on';

    // 2. Check Reduced Motion preference
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      !!window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;

    // 3. Check Touch Capability
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (typeof window.matchMedia === 'function' &&
        !!window.matchMedia('(pointer: coarse)')?.matches);

    // 4. Check Low Power Hardware Signals
    // Device Memory: undefined on Firefox/Safari -> treat as not low
    const nav = navigator as unknown as {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const hasLowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const hasLowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const hasSlowConnection =
      nav.connection?.saveData === true ||
      nav.connection?.effectiveType === '2g' ||
      nav.connection?.effectiveType === '3g';

    const isLowPowerDevice = hasLowMemory || hasLowCores || hasSlowConnection;

    // 5. Test real WebGL context availability in try/catch
    let hasWebGLSupport = false;
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      hasWebGLSupport = !!gl;
      // Clean up
      if (gl) {
        const webgl = gl as WebGLRenderingContext;
        if (typeof webgl.getExtension === 'function') {
          const ext = webgl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        }
      }
    } catch {
      hasWebGLSupport = false;
    }

    // 6. Check sessionStorage watchdog flag
    let sessionDisabled = false;
    try {
      sessionDisabled = sessionStorage.getItem('genesis_3d_disabled') === 'true';
    } catch {
      sessionDisabled = false;
    }

    // Determine final WebGL decision
    let shouldUseWebGL = false;
    if (force3DOff || prefersReducedMotion || sessionDisabled) {
      shouldUseWebGL = false;
    } else if (force3DOn) {
      shouldUseWebGL = hasWebGLSupport;
    } else {
      shouldUseWebGL = hasWebGLSupport && !isLowPowerDevice;
    }

    setCapabilities({
      shouldUseWebGL,
      isLowPower: isLowPowerDevice,
      hasReducedMotion: prefersReducedMotion,
      isTouchDevice: isTouch,
      downgradeToFallback,
    });
  }, [downgradeToFallback]);

  return capabilities;
}
