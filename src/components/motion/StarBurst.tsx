'use client';

import React, { useEffect, useState } from 'react';

interface StarBurstProps {
  active: boolean;
  count?: number; // default 8
  className?: string;
  onComplete?: () => void;
}

export const StarBurst: React.FC<StarBurstProps> = ({
  active,
  count = 8,
  className = '',
  onComplete,
}) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (active) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        onComplete?.();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!animating) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center z-40 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => {
        const angle = (idx * 360) / count;
        const rad = (angle * Math.PI) / 180;
        const dist = 55; // px
        const x = Math.cos(rad) * dist;
        const y = Math.sin(rad) * dist;

        return (
          <div
            key={idx}
            className="absolute w-3.5 h-3.5 text-cta-yellow animate-star-pop"
            style={{
              ['--tx' as string]: `${x}px`,
              ['--ty' as string]: `${y}px`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
