'use client';

export type QualityTier = 'ultra' | 'high' | 'lite' | 'reduced';

export function detectTier(): QualityTier {
  if (typeof window === 'undefined') return 'high';

  // 1. URL override (?tier=ultra | high | lite | reduced)
  const params = new URLSearchParams(window.location.search);
  const paramTier = params.get('tier') as QualityTier | null;
  if (paramTier && ['ultra', 'high', 'lite', 'reduced'].includes(paramTier)) {
    return paramTier;
  }

  // 2. User preference in localStorage
  const savedTier = localStorage.getItem('genesis_tier') as QualityTier | null;
  if (savedTier && ['ultra', 'high', 'lite', 'reduced'].includes(savedTier)) {
    return savedTier;
  }

  // 3. System reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'reduced';
  }

  // 4. Low-end device heuristics
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;

  if (cores <= 4 || memory <= 2) {
    return 'lite';
  }

  // 5. Ultra tier for powerful desktops
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile && cores >= 8 && memory >= 8) {
    return 'ultra';
  }

  return 'high';
}

export function setTier(tier: QualityTier) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('genesis_tier', tier);
  document.documentElement.setAttribute('data-tier', tier);
}

export function initTier() {
  if (typeof window === 'undefined') return 'high';
  const tier = detectTier();
  document.documentElement.setAttribute('data-tier', tier);

  // Monitor FPS in production for auto-downgrade
  if (tier === 'high' || tier === 'ultra') {
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;

    const checkFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const fps = (frameCount * 1000) / (now - lastTime);
        if (fps < 40) {
          lowFpsCount++;
          if (lowFpsCount >= 2) {
            // Drop to lite
            setTier('lite');
            return;
          }
        } else {
          lowFpsCount = 0;
        }
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(checkFps);
    };

    requestAnimationFrame(checkFps);
  }

  return tier;
}
