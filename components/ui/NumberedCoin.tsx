import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface NumberedCoinProps {
  number: string | number;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  className?: string;
}

export const NumberedCoin: React.FC<NumberedCoinProps> = ({
  number,
  size = 'md',
  active = false,
  className,
}) => {
  const sizeStyles = {
    sm: 'w-10 h-10 text-sm border-2 shadow-[0_3px_0_#080A10]',
    md: 'w-14 h-14 text-lg border-[3px] shadow-[0_5px_0_#080A10]',
    lg: 'w-20 h-20 text-2xl border-4 shadow-[0_7px_0_#080A10]',
  };

  const formattedNum = String(number).padStart(2, '0');

  return (
    <div
      className={twMerge(
        clsx(
          'relative inline-flex items-center justify-center rounded-full font-heading font-black select-none transition-transform hover:scale-105',
          'border-[#3B2200] bg-gradient-to-b from-[#FFF066] via-[#FFB703] to-[#D47000]',
          active && 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-slate-900',
          sizeStyles[size],
          className,
        ),
      )}
    >
      {/* Top inner coin gloss highlight */}
      <span className="pointer-events-none absolute inset-x-1 top-1 h-1/2 rounded-full bg-gradient-to-b from-white/50 to-transparent" />

      {/* Inner Rim Accent */}
      <div className="absolute inset-1 rounded-full border border-yellow-200/60" />

      {/* Number Text */}
      <span className="relative z-10 text-[#2B1400] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
        {formattedNum}
      </span>
    </div>
  );
};
