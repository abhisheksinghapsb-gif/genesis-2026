import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SlantedBannerProps {
  title: string;
  subtitle?: string;
  color?: 'orange' | 'blue' | 'purple' | 'red';
  className?: string;
  badge?: React.ReactNode;
}

export const SlantedBanner: React.FC<SlantedBannerProps> = ({
  title,
  subtitle,
  color = 'orange',
  className,
  badge,
}) => {
  const gradientStyles = {
    orange: 'from-[#FFB340] via-[#FF7700] to-[#C94700] border-[#3D1400]',
    blue: 'from-[#42D3FF] via-[#0091FF] to-[#0055B3] border-[#072552]',
    purple: 'from-[#C060FF] via-[#8525D9] to-[#510E94] border-[#290452]',
    red: 'from-[#FF5C7A] via-[#E81E4B] to-[#990D2E] border-[#420411]',
  };

  return (
    <div className={twMerge(clsx('relative inline-block select-none my-4', className))}>
      {/* Black Drop-Base 3D shadow container */}
      <div className="absolute inset-0 translate-y-2 rounded-md bg-[#080A10] [clip-path:polygon(3%_0%,_97%_0%,_100%_100%,_0%_100%)] md:[clip-path:polygon(2%_0%,_98%_0%,_100%_100%,_0%_100%)]" />

      {/* Main Slanted Plaque */}
      <div
        className={twMerge(
          clsx(
            'relative px-8 py-3.5 md:px-14 md:py-4.5',
            'bg-gradient-to-b border-[3px] md:border-4 rounded-md',
            'shadow-[inset_0_2px_0_rgba(255,255,255,0.4)]',
            '[clip-path:polygon(3%_0%,_97%_0%,_100%_100%,_0%_100%)] md:[clip-path:polygon(2%_0%,_98%_0%,_100%_100%,_0%_100%)]',
            gradientStyles[color],
          ),
        )}
      >
        {/* Shiny sweep stripe */}
        <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine-sweep opacity-75" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {badge && <div className="mb-1">{badge}</div>}
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl tracking-wider text-white uppercase drop-shadow-[0_4px_0_#080A10] stroke-black">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 font-body text-xs md:text-sm font-black uppercase tracking-widest text-amber-200 drop-shadow-[0_1px_0_#080A10]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
