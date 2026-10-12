import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { StarIcon } from './GameIcons';

export interface ThemedDividerProps {
  className?: string;
  variant?: 'gold' | 'cyan' | 'purple';
}

export const ThemedDivider: React.FC<ThemedDividerProps> = ({
  className,
  variant = 'gold',
}) => {
  const variantStyles = {
    gold: {
      bar: 'bg-gradient-to-r from-transparent via-[#FFB703] to-transparent',
      starBg: 'bg-gradient-to-b from-[#FFF275] via-[#FFB703] to-[#D47000] border-[#3B2200]',
      starColor: 'text-[#2B1400]',
      glow: 'shadow-[0_0_15px_rgba(255,183,3,0.5)]',
    },
    cyan: {
      bar: 'bg-gradient-to-r from-transparent via-[#00C0FF] to-transparent',
      starBg: 'bg-gradient-to-b from-[#A5F3FC] via-[#00C0FF] to-[#0077C8] border-[#083344]',
      starColor: 'text-cyan-950',
      glow: 'shadow-[0_0_15px_rgba(0,192,255,0.5)]',
    },
    purple: {
      bar: 'bg-gradient-to-r from-transparent via-[#A855F7] to-transparent',
      starBg: 'bg-gradient-to-b from-[#E9D5FF] via-[#A855F7] to-[#6B21A8] border-[#2E1065]',
      starColor: 'text-purple-950',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    },
  };

  const selected = variantStyles[variant];

  return (
    <div
      className={twMerge(
        clsx(
          'relative flex w-full items-center justify-center py-6 md:py-10 select-none overflow-hidden',
          className,
        ),
      )}
      aria-hidden="true"
    >
      {/* Horizontal Divider Line */}
      <div className={twMerge(clsx('h-[3px] w-full max-w-5xl opacity-80', selected.bar))} />

      {/* Central Star Crest Button */}
      <div className="absolute flex items-center justify-center">
        {/* Shine Sweep Effect */}
        <div
          className={twMerge(
            clsx(
              'relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl border-[3px]',
              'animate-gentle-pulse transition-transform hover:scale-110 shadow-[0_4px_0_#080A10]',
              selected.starBg,
              selected.glow,
            ),
          )}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-lg bg-gradient-to-b from-white/40 to-transparent" />
          <StarIcon size={20} className={selected.starColor} />
        </div>
      </div>
    </div>
  );
};
