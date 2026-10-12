'use client';

import React, { useEffect, useState } from 'react';

interface ScreenShakeProps {
  active: boolean;
  children: React.ReactNode;
  intensity?: number; // px (default 6)
  durationMs?: number; // default 220
  className?: string;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  active,
  children,
  intensity = 6,
  durationMs = 220,
  className = '',
}) => {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (active) {
      setShaking(true);
      const timer = setTimeout(() => setShaking(false), durationMs);
      return () => clearTimeout(timer);
    }
  }, [active, durationMs]);

  return (
    <div
      className={`transform-gpu ${shaking ? 'animate-screen-shake' : ''} ${className}`}
      style={{
        ['--shake-dist' as string]: `${intensity}px`,
      }}
    >
      {children}
    </div>
  );
};
