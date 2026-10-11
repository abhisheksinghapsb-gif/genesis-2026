'use client';

import React from 'react';

interface WordmarkProps {
  className?: string;
  size?: 'normal' | 'large';
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
}) => {
  const letters = 'GENESIS'.split('');

  const fontSizeClass =
    size === 'large'
      ? 'text-[64px] sm:text-[96px] md:text-[130px] lg:text-[144px]'
      : 'text-[44px] sm:text-[60px] md:text-[80px]';

  return (
    <h1
      className={`font-display font-black tracking-wider select-none inline-flex items-center justify-center m-0 leading-none ${fontSizeClass} ${className}`}
      aria-label="GENESIS"
    >
      {letters.map((char, index) => {
        const trans = letterTransforms[index % letterTransforms.length];
        return (
          <span
            key={index}
            className="inline-block transition-transform duration-200 hover:-translate-y-3 cursor-default"
            style={{
              transform: `translateY(${trans.dy}) rotate(${trans.rot})`,
              color: 'var(--wordmark-grey)',
              WebkitTextStroke: '9px #000000',
              paintOrder: 'stroke fill',
              textShadow: '0 10px 0 #000000',
            }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};
