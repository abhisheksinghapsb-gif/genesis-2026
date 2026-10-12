'use client';

import React, { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number; // seconds (default 1.2s)
  prefix?: string;
  suffix?: string;
  formatThousands?: boolean;
  active?: boolean;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 1.2,
  prefix = '',
  suffix = '',
  formatThousands = true,
  active = true,
  className = '',
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * end);
      setVal(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setVal(end);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, active]);

  const formatted = formatThousands ? val.toLocaleString('en-IN') : val.toString();

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
