export interface SectionMeta {
  id: string;
  label: string;
  shortLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'home', label: 'GENESIS 2026', shortLabel: 'HOME' },
  { id: 'about', label: 'ABOUT GENESIS', shortLabel: 'ABOUT' },
  { id: 'timeline', label: 'TIMELINE', shortLabel: 'TIMELINE' },
  { id: 'prizes', label: 'PRIZE POOL', shortLabel: 'PRIZES' },
  { id: 'sponsors', label: 'SPONSORS', shortLabel: 'SPONSORS' },
  { id: 'memories', label: 'MEMORIES', shortLabel: 'MEMORIES' },
  { id: 'faq', label: 'FAQS', shortLabel: 'FAQS' },
  { id: 'register', label: 'REGISTER NOW', shortLabel: 'REGISTER' },
];

export const Z_INDEX = {
  watermark: 0,
  threeCanvas: 1,
  sectionContent: 10,
  divider: 15,
  mobileStickyPill: 40,
  hud: 50,
  drawerBackdrop: 90,
  drawerPanel: 100,
  loader: 110,
} as const;

export const BREAKPOINTS = {
  mobileSm: 360,
  mobile: 390,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  wide: 1920,
} as const;

export const STORAGE_KEYS = {
  soundEnabled: 'genesis_sound_enabled',
  reducedMotion: 'genesis_reduced_motion',
} as const;
