'use client';

import React from 'react';

export type ButtonVariant = 'yellow' | 'slate' | 'orange' | 'red-close' | 'blue-mini';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}

export const Button3D: React.FC<Button3DProps> = ({
  variant = 'yellow',
  children,
  className = '',
  onClick,
  ariaLabel,
  ...props
}) => {
  if (variant === 'red-close') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || 'Close'}
        className={`btn-close-red w-[44px] h-[36px] rounded-sm flex items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-node-gold active:translate-y-1 ${className}`}
        {...props}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          className="stroke-white stroke-[3.5] drop-shadow-[0_2px_0_#000]"
        >
          <path d="M 3 3 L 13 13 M 13 3 L 3 13" strokeLinecap="round" />
        </svg>
      </button>
    );
  }

  if (variant === 'blue-mini') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        className={`w-[44px] h-[36px] rounded bg-info-blue border-[1.5px] border-black shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_3px_0_#000] flex items-center justify-center cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-node-gold active:translate-y-1 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const variantClass =
    variant === 'yellow'
      ? 'btn-3d-yellow'
      : variant === 'slate'
      ? 'btn-3d-slate'
      : 'btn-3d-orange';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${variantClass} relative inline-flex items-center justify-center font-display uppercase tracking-wider select-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-node-gold focus:ring-offset-2 focus:ring-offset-black ${className}`}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2 transform skew-x-[8deg] drop-shadow-[0_2px_0_#000]">
        {children}
      </span>
    </button>
  );
};
