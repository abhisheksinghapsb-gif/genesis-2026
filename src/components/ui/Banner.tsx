import React from 'react';

interface BannerProps {
  title: string;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ title, className = '' }) => {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none transform -skew-x-[9deg] ${className}`}
    >
      {/* 3D Black Top Plate */}
      <div className="absolute -top-[12px] left-0 right-0 h-[14px] bg-black border-t-2 border-l-2 border-r-2 border-black rounded-t-sm" />

      {/* Main Orange Face */}
      <div className="relative px-8 md:px-14 py-2.5 md:py-3.5 bg-banner-orange border-2 border-black shadow-[inset_0_4px_0_rgba(255,255,255,0.35),inset_0_-6px_0_#C6510D,0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
        {/* Unskewed Title */}
        <h1 className="transform skew-x-[9deg] font-display text-white text-xl sm:text-2xl md:text-3xl tracking-wider text-outline uppercase m-0 leading-none">
          {title}
        </h1>
      </div>
    </div>
  );
};
