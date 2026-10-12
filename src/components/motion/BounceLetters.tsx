'use client';

import React, { useState } from 'react';

interface BounceLettersProps {
  text: string;
  className?: string;
  letterClassName?: string;
  staggerMs?: number;
  waveIntervalMs?: number;
}

export const BounceLetters: React.FC<BounceLettersProps> = ({
  text,
  className = '',
  letterClassName = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <span className={`inline-flex items-baseline ${className}`}>
      {text.split('').map((char, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`inline-block transform-gpu transition-transform duration-200 cursor-pointer select-none ${
              isHovered ? '-translate-y-3 scale-115 rotate-3' : ''
            } ${letterClassName}`}
            style={{
              animation: `letterWave 8s ease-in-out infinite`,
              animationDelay: `${idx * 0.08}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};
