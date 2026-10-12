'use client';

import React from 'react';

interface ParallaxLayerProps {
  children: React.ReactNode;
  z?: number; // translateZ in px (perspective = 1200)
  className?: string;
  compensateScale?: boolean;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  z = 0,
  className = '',
  compensateScale = true,
}) => {
  // At perspective 1200px:
  // scale = 1 - (z / 1200)
  const scale = compensateScale ? Math.max(0.1, 1 - z / 1200) : 1;

  return (
    <div
      className={`absolute inset-0 pointer-events-none transform-gpu ${className}`}
      style={{
        transform: `translateZ(${z}px) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="pointer-events-auto w-full h-full">
        {children}
      </div>
    </div>
  );
};
