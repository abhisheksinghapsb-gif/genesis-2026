import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { StarIcon } from './GameIcons';

export interface ShieldBadgeProps {
  rank: '1ST' | '2ND' | '3RD' | 'VR' | string;
  tier?: 'gold' | 'orange' | 'silver' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShieldBadge: React.FC<ShieldBadgeProps> = ({
  rank,
  tier = 'gold',
  size = 'md',
  className,
}) => {
  const tierConfig = {
    gold: {
      gradient: 'from-[#FFE853] via-[#FFAE00] to-[#D96B00]',
      border: 'border-[#4A2E00]',
      shadow: '#2E1C00',
      text: 'text-amber-950',
      starColor: '#FFF275',
    },
    orange: {
      gradient: 'from-[#FFAE42] via-[#FF6600] to-[#C43800]',
      border: 'border-[#4D1500]',
      shadow: '#330E00',
      text: 'text-orange-950',
      starColor: '#FFE0A3',
    },
    silver: {
      gradient: 'from-[#FFFFFF] via-[#D1D5DB] to-[#9CA3AF]',
      border: 'border-[#1F2937]',
      shadow: '#111827',
      text: 'text-slate-900',
      starColor: '#F3F4F6',
    },
    cyan: {
      gradient: 'from-[#67E8F9] via-[#06B6D4] to-[#0891B2]',
      border: 'border-[#083344]',
      shadow: '#041D27',
      text: 'text-cyan-950',
      starColor: '#A5F3FC',
    },
  };

  const sizeConfig = {
    sm: 'w-14 h-16 text-sm',
    md: 'w-20 h-24 text-lg',
    lg: 'w-28 h-32 text-2xl',
  };

  const selected = tierConfig[tier];

  return (
    <div
      className={twMerge(
        clsx(
          'relative inline-flex flex-col items-center justify-center select-none drop-shadow-[0_6px_0_#080A10]',
          sizeConfig[size],
          className,
        ),
      )}
    >
      {/* Outer SVG Shield Shape */}
      <svg
        viewBox="0 0 100 120"
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id={`shield-grad-${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {tier === 'gold' && (
              <>
                <stop offset="0%" stopColor="#FFF470" />
                <stop offset="50%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#D96600" />
              </>
            )}
            {tier === 'orange' && (
              <>
                <stop offset="0%" stopColor="#FFBF52" />
                <stop offset="50%" stopColor="#FF6200" />
                <stop offset="100%" stopColor="#C23600" />
              </>
            )}
            {tier === 'silver' && (
              <>
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </>
            )}
            {tier === 'cyan' && (
              <>
                <stop offset="0%" stopColor="#7EE7F7" />
                <stop offset="50%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0369A1" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Shield Outer Rim */}
        <path
          d="M50 5 L90 20 L80 85 L50 115 L20 85 L10 20 Z"
          fill={`url(#shield-grad-${tier})`}
          stroke="#0F141F"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner Bevel Border */}
        <path
          d="M50 14 L80 25 L72 78 L50 102 L28 78 L20 25 Z"
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2.5"
        />
      </svg>

      {/* Center Rank Content */}
      <div className="relative z-10 flex flex-col items-center">
        <StarIcon size={size === 'lg' ? 24 : 16} className="text-white drop-shadow-[0_2px_0_#000] mb-0.5" />
        <span
          className={twMerge(
            clsx(
              'font-heading font-black tracking-tighter uppercase drop-shadow-[0_2px_0_#FFF]',
              selected.text,
            ),
          )}
        >
          {rank}
        </span>
      </div>
    </div>
  );
};
