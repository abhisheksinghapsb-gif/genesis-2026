import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface WatermarkPatternProps {
  className?: string;
  opacity?: number;
  animated?: boolean;
}

export const WatermarkPattern: React.FC<WatermarkPatternProps> = ({
  className,
  opacity = 0.08,
  animated = false,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'pointer-events-none absolute inset-0 overflow-hidden select-none',
          animated && 'animate-gentle-float',
          className,
        ),
      )}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="brawl-watermark-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(25)"
          >
            {/* Skull Emblem */}
            <g transform="translate(15, 15) scale(0.8)" fill="#38D4FF">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.7 2 6.9 5 8.6V22h10v-1.4c3-1.7 5-4.9 5-8.6 0-5.5-4.5-10-10-10zm-3 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-5 4v-2h4v2h-4z" />
            </g>

            {/* Star Icon */}
            <g transform="translate(75, 20) scale(0.7)" fill="#38D4FF">
              <path d="M12 2l2.85 6.8 7.15.62-5.4 4.7 1.62 7.08L12 17.5 5.78 21.2l1.62-7.08-5.4-4.7 7.15-.62L12 2z" />
            </g>

            {/* Blaster Gun */}
            <g transform="translate(20, 75) scale(0.7)" fill="#38D4FF">
              <path d="M3 7h11v4H8v6H5v-4H3V7zm13 1h3v2h-3V8zm0 4h5v2h-5v-2zm-3 8v-2h3v2h-3z" />
            </g>

            {/* Potion Flask */}
            <g transform="translate(75, 75) scale(0.7)" fill="#38D4FF">
              <path d="M10 2h4v2h-1v3.2l5.5 8.8c.9 1.4-.1 3.3-1.8 3.3H7.3c-1.7 0-2.7-1.9-1.8-3.3L11 7.2V4h-1V2zm.5 10l-3 4.8h9l-3-4.8h-3z" />
            </g>

            {/* Micro Dot Accents */}
            <circle cx="60" cy="60" r="3" fill="#38D4FF" />
            <circle cx="10" cy="110" r="2.5" fill="#38D4FF" />
            <circle cx="110" cy="10" r="2.5" fill="#38D4FF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brawl-watermark-grid)" />
      </svg>
    </div>
  );
};
