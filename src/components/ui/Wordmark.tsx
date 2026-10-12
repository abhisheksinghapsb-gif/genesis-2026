'use client';

import React from 'react';

interface WordmarkProps {
  className?: string;
  size?: 'normal' | 'large';
  text?: string;
}

const letterTransforms = [
  { dy: '-4px', rot: '-3deg' }, // G
  { dy: '2px', rot: '2deg' },   // E
  { dy: '-6px', rot: '-2deg' }, // N
  { dy: '3px', rot: '3deg' },   // E
  { dy: '-3px', rot: '-4deg' }, // S
  { dy: '1px', rot: '2deg' },   // I
  { dy: '-5px', rot: '3deg' },  // S
];

export const Wordmark: React.FC<WordmarkProps> = ({
  className = '',
  size = 'large',
  text = 'GENESIS',
}) => {
  const letters = (text || 'GENESIS').split('');

  const fontSizeClass =
    size === 'large'
      ? 'text-[64px] sm:text-[96px] md:text-[130px] lg:text-[144px]'
      : 'text-[44px] sm:text-[60px] md:text-[80px]';

  return (
    <div
      className={`relative inline-flex items-center justify-center font-display uppercase tracking-wider text-outline-xl select-none ${className}`}
      aria-label={text}
    >
      {letters.map((char, idx) => {
        const transform = letterTransforms[idx % letterTransforms.length];
        return (
          <span
            key={idx}
            className={`inline-block font-display ${fontSizeClass} transition-transform duration-200 hover:-translate-y-2 hover:scale-105 cursor-pointer`}
            style={{
              transform: `translateY(${transform?.dy ?? '0px'}) rotate(${transform?.rot ?? '0deg'})`,
              textShadow: '0 10px 0 #000000',
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
