'use client';

import React from 'react';
import { formatPrize } from '@/lib/format';

interface BadgeProps {
  rank: number;
  amount: number;
  trackName?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  rank,
  amount,
  trackName = 'Main',
  className = '',
}) => {
  // Rank-based styling
  const rankLabel = rank === 1 ? '1ST' : rank === 2 ? '2ND' : '3RD';

  // Colors and bevels
  const colors =
    rank === 1
      ? {
          topBevelLeft: '#FFF580',
          topBevelRight: 'var(--gold-top)',
          face: 'var(--gold-face)',
          faceShade: '#D97510',
          tilt: '-rotate-[3deg]',
        }
      : rank === 2
      ? {
          topBevelLeft: '#FFAE52',
          topBevelRight: 'var(--orange-top)',
          face: 'var(--orange-face)',
          faceShade: '#B84504',
          tilt: 'rotate-[2deg]',
        }
      : {
          topBevelLeft: '#E6EFFF',
          topBevelRight: 'var(--silver-top)',
          face: 'var(--silver-face)',
          faceShade: '#6B72B3',
          tilt: 'rotate-[3deg]',
        };

  const labelText = `${trackName ? trackName + ', ' : ''}${rankLabel} prize, ${formatPrize(amount)}`;

  return (
    <div
      role="img"
      aria-label={labelText}
      className={`relative inline-block select-none cursor-pointer transform ${colors.tilt} transition-transform duration-200 hover:scale-105 active:scale-95 group ${className}`}
    >
      <svg
        width="180"
        height="225"
        viewBox="0 0 180 225"
        className="w-[140px] sm:w-[165px] md:w-[180px] h-auto drop-shadow-[0_10px_16px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Shine gradient for hover effect */}
          <linearGradient id={`shine-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. Black Extruded 3D Base (Shadow / bottom plate) */}
        <polygon
          points="20,185 90,218 160,185 160,205 90,225 20,205"
          fill="#000000"
        />

        {/* 2. Shield Outer Black Stroke / Shell */}
        <polygon
          points="20,40 90,15 160,40 160,185 90,218 20,185"
          fill="#000000"
        />

        {/* 3. Shield Top Bevel (Left facet lighter, Right facet tinted) */}
        {/* Left top facet */}
        <polygon
          points="24,43 90,20 90,48 24,65"
          fill={colors.topBevelLeft}
        />
        {/* Right top facet */}
        <polygon
          points="90,20 156,43 156,65 90,48"
          fill={colors.topBevelRight}
        />

        {/* 4. Shield Main Face */}
        <polygon
          points="24,65 90,48 156,65 156,182 90,214 24,182"
          fill={colors.face}
        />
        {/* Face 3D vertical facet shading on right */}
        <polygon
          points="90,48 156,65 156,182 90,214"
          fill={colors.faceShade}
          opacity="0.35"
        />

        {/* 5. Rank Text (1ST, 2ND, 3RD) */}
        <text
          x="90"
          y="108"
          textAnchor="middle"
          className="font-display text-[34px] font-bold fill-black tracking-wider"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {rankLabel}
        </text>

        {/* 6. Dark Plaque Panel (#660138) */}
        <polygon
          points="24,128 156,128 156,176 90,198 24,176"
          fill="var(--plaque)"
        />
        <line
          x1="24"
          y1="128"
          x2="156"
          y2="128"
          stroke="#000000"
          strokeWidth="4"
        />

        {/* 7. Amount Text (White Outlined with Black Stroke) */}
        <text
          x="90"
          y="166"
          textAnchor="middle"
          className="font-display text-[30px] sm:text-[34px] font-bold fill-white tracking-wide"
          stroke="#000000"
          strokeWidth="6"
          paintOrder="stroke fill"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 3px 0 #000',
          }}
        >
          {formatPrize(amount)}
        </text>

        {/* 8. Shine Overlay */}
        <polygon
          points="24,43 90,20 156,43 156,182 90,214 24,182"
          fill={`url(#shine-${rank})`}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        />
      </svg>
    </div>
  );
};
