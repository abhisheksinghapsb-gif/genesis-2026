import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0B0F19',
          'dark-blue': '#0D1B3E',
          'blue-base': '#132857',
          'blue-accent': '#00A8FF',
          'blue-bright': '#38D4FF',
          orange: '#FF8A00',
          'orange-deep': '#D96200',
          'orange-glow': '#FFA834',
          yellow: '#FFDE00',
          cream: '#FFF7E2',
          'cream-card': '#FFF5D6',
          'card-stroke': '#805B28',
          red: '#F52F57',
          'red-dark': '#B81335',
          purple: '#6722A8',
          'purple-deep': '#3D0E6B',
          stroke: '#10141E',
          'drop-base': '#080A10',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Lilita One', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'Nunito', 'ui-rounded', 'sans-serif'],
      },
      boxShadow: {
        'game-btn': '0 6px 0 #0A0D14',
        'game-btn-hover': '0 8px 0 #0A0D14',
        'game-btn-active': '0 2px 0 #0A0D14',
        'game-card': '0 8px 0 rgba(0, 0, 0, 0.45)',
        'game-panel': '0 12px 0 rgba(0, 0, 0, 0.55)',
      },
      dropShadow: {
        'text-game': '0 3px 0 #0B0E16',
        'text-game-lg': '0 5px 0 #080A10',
      },
      keyframes: {
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'gentle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        'gentle-float': 'gentle-float 4s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'shine-sweep': 'shine-sweep 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
