'use client';

import React, { useState, useEffect } from 'react';
import { ShieldBadge } from '@/components/ui/ShieldBadge';
import { useTilt3D } from '@/animations/useTilt3D';

export interface RewardItem {
  rank: string;
  title: string;
  amount: number;
  formatted: string;
  tier: 'gold' | 'orange' | 'silver' | 'cyan';
  confetti?: boolean;
}

export interface PrizeShieldCardProps {
  reward: RewardItem;
  shouldAnimate: boolean;
}

export const PrizeShieldCard: React.FC<PrizeShieldCardProps> = ({ reward, shouldAnimate }) => {
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);

  const { ref, transformStyle, glareStyle, onPointerMove, onPointerLeave, onPointerDown, onPointerUp } =
    useTilt3D({ maxTilt: 10, scale: 1.04 });

  // Counter animation from 0 to amount on mount
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    const increment = reward.amount / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= reward.amount) {
        setDisplayAmount(reward.amount);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [reward.amount]);

  const handleShieldClick = () => {
    setIsCelebrated(true);
    setTimeout(() => setIsCelebrated(false), 900);
  };

  return (
    <div
      ref={ref}
      style={transformStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={handleShieldClick}
      className="group relative flex flex-1 flex-col items-center justify-between rounded-2xl border-2 sm:border-[3px] border-[#0A1A3A] bg-gradient-to-b from-[#132A5A] via-[#0E1E42] to-[#07132B] p-4 sm:p-6 shadow-[0_8px_0_#050C1C] cursor-pointer select-none"
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-md transition-opacity duration-150"
        style={glareStyle}
      />

      {/* Mini celebration ring on click */}
      {isCelebrated && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border-4 border-yellow-300 animate-ping" />
        </div>
      )}

      {/* Title tag */}
      <div className="mb-3 inline-flex items-center rounded-lg border border-amber-400/40 bg-black/40 px-2.5 py-0.5 font-heading text-[11px] text-amber-300 tracking-wider uppercase">
        {reward.title}
      </div>

      {/* 3D Shield Emblem with Idle Rocking */}
      <div
        className={`relative my-2 transition-transform ${
          shouldAnimate ? 'animate-gentle-float' : ''
        } group-hover:scale-110`}
        style={{ animationDuration: '4.5s' }}
      >
        <ShieldBadge
          rank={reward.rank}
          tier={reward.tier}
          size={reward.rank === '1ST' ? 'lg' : 'md'}
        />

        {/* 1st Place extra sparkles */}
        {reward.confetti && (
          <div className="pointer-events-none absolute -top-2 -right-2 text-yellow-300 animate-bounce">
            ✨
          </div>
        )}
      </div>

      {/* Pulsing Amount with Soft Glow */}
      <div className="mt-4 flex flex-col items-center">
        <span className="font-heading text-xl sm:text-2xl md:text-3xl text-amber-300 drop-shadow-[0_2px_0_#000] group-hover:text-yellow-200 transition-colors animate-gentle-pulse">
          ₹{displayAmount.toLocaleString('en-IN')}
        </span>
        <span className="font-body text-[10px] font-black uppercase tracking-widest text-sky-300/80 mt-0.5">
          CASH PRIZE
        </span>
      </div>
    </div>
  );
};
