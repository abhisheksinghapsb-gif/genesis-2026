'use client';

import React from 'react';

interface ShineSweepProps {
  className?: string;
}

export const ShineSweep: React.FC<ShineSweepProps> = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}>
      <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shine" />
    </div>
  );
};
