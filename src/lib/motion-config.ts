/**
 * Centralized motion configuration for GENESIS 2026 V2
 * Tune scroll ranges, durations, and spring constants here.
 */

export const MOTION_CONFIG = {
  // Scroll budgets (in vh units) on desktop
  scrollBudgets: {
    hero: 150,
    about: 180,
    timeline: 350,
    prizePool: 220,
    memories: 300,
    sponsors: 200,
    faqs: 120,
    register: 100,
  },

  // Mobile scroll multiplier (0.6x)
  mobileMultiplier: 0.6,

  // Scrub smoothing parameter for GSAP ScrollTrigger
  scrubSmooth: 0.6,

  // Springs and easing
  easing: {
    pop: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.5)',
    impact: 'power3.out',
    smooth: 'power2.inOut',
  },

  // Impact shake parameters
  shake: {
    intensity: 6, // px
    duration: 0.22, // seconds
  },

  // Memory ring 3D radius
  ring: {
    radiusDesktop: 520,
    radiusMobile: 340,
    tiltX: -8, // degrees
  },

  // Sound FX config
  audio: {
    maxDuration: 0.3,
  },
} as const;
