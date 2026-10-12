import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-center': 'var(--blue-center)',
        'blue-edge': 'var(--blue-edge)',
        'panel-header': 'var(--panel-header)',
        'panel-header-bevel-light': 'var(--panel-header-bevel-light)',
        'panel-header-bevel-dark': 'var(--panel-header-bevel-dark)',
        'panel-body': 'var(--panel-body)',
        'panel-inset': 'var(--panel-inset)',
        ink: 'var(--ink)',
        'banner-orange': 'var(--banner-orange)',
        slate: {
          DEFAULT: 'var(--slate)',
          lip: 'var(--slate-lip)',
        },
        'cta-yellow': {
          DEFAULT: 'var(--cta-yellow)',
          hi: 'var(--cta-yellow-hi)',
          lip: 'var(--cta-yellow-lip)',
        },
        'node-gold': 'var(--node-gold)',
        'node-ring': 'var(--node-ring)',
        'info-blue': 'var(--info-blue)',
        'close-red': {
          DEFAULT: 'var(--close-red)',
          lip: 'var(--close-red-lip)',
        },
        'placeholder-grey': 'var(--placeholder-grey)',
        'about-bg': 'var(--about-bg)',
        cream: 'var(--cream)',
        'title-red': 'var(--title-red)',
        'wordmark-grey': 'var(--wordmark-grey)',
        bronze: 'var(--bronze)',
        'gold-face': 'var(--gold-face)',
        'gold-top': 'var(--gold-top)',
        'orange-face': 'var(--orange-face)',
        'orange-top': 'var(--orange-top)',
        'silver-face': 'var(--silver-face)',
        'silver-top': 'var(--silver-top)',
        plaque: 'var(--plaque)',
        'sky-top': 'var(--sky-top)',
        'sky-mid': 'var(--sky-mid)',
        'sky-horizon': 'var(--sky-horizon)',
        moon: 'var(--moon)',
        'moon-crater': 'var(--moon-crater)',
        'moon-glow': 'var(--moon-glow)',
        'platform-edge': 'var(--platform-edge)',
        'planet-blue': 'var(--planet-blue)',
        'badge-gold': 'var(--badge-gold)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'cursive', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
