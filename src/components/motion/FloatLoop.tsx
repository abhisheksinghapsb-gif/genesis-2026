'use client';

import React from 'react';

interface FloatLoopProps {
  children: React.ReactNode;
  duration?: number; // seconds (default 5s)
  distance?: number; // pixels up/down (default 8px)
  rotate?: number; // degrees sway (default 2deg)
  delay?: number; // seconds
  className?: string;
}

export const FloatLoop: React.FC<FloatLoopProps> = ({
  children,
  duration = 5,
  distance = 8,
  rotate = 2,
  delay = 0,
  className = '',
}) => {
  return (
    <div
      className={`transform-gpu ${className}`}
      style={{
        animation: `genesisFloat ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        // Custom CSS variables for dynamic keyframe bounds
        ['--float-dist' as string]: `${distance}px`,
        ['--float-rot' as string]: `${rotate}deg`,
      }}
    >
      {children}
    </div>
  );
};
