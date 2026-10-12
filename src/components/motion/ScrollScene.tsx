'use client';

import React from 'react';

interface ScrollSceneProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export const ScrollScene: React.FC<ScrollSceneProps> = ({
  id,
  children,
  className = '',
  minHeight = 'min-h-[100dvh]',
}) => {
  return (
    <section
      id={id}
      data-scene={id}
      className={`relative w-full overflow-hidden perspective-1200 preserve-3d select-none ${minHeight} ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </section>
  );
};
