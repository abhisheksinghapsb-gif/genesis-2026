'use client';

import React from 'react';

interface InfoDotProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
}

export const InfoDot: React.FC<InfoDotProps> = ({
  onClick,
  title = 'View details',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1853db] hover:bg-[#2563eb] text-white font-mono text-xs font-bold border border-white/60 shadow-[0_2px_4px_rgba(0,0,0,0.4)] cursor-pointer transition-transform hover:scale-110 active:scale-95 ${className}`}
    >
      i
    </button>
  );
};
