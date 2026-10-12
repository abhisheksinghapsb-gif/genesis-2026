import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ChamferCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cream' | 'dark-blue' | 'glass';
  elevation?: 'sm' | 'md' | 'lg';
  cornerSize?: number;
  children: React.ReactNode;
}

export const ChamferCard: React.FC<ChamferCardProps> = ({
  variant = 'cream',
  elevation = 'md',
  cornerSize = 16,
  className,
  children,
  ...props
}) => {
  const clipPathStyle = {
    clipPath: `polygon(${cornerSize}px 0, calc(100% - ${cornerSize}px) 0, 100% ${cornerSize}px, 100% calc(100% - ${cornerSize}px), calc(100% - ${cornerSize}px) 100%, ${cornerSize}px 100%, 0 calc(100% - ${cornerSize}px), 0 ${cornerSize}px)`,
  };

  const elevationOffsets = {
    sm: 'translate-y-1.5',
    md: 'translate-y-2.5',
    lg: 'translate-y-4',
  };

  const themeVariants = {
    cream: {
      outer: 'bg-[#4B3012]',
      inner: 'bg-gradient-to-b from-[#FFF9E6] via-[#FFF3CC] to-[#F7E0A3] text-[#241708] border-[#704B18]',
    },
    'dark-blue': {
      outer: 'bg-[#060D1E]',
      inner: 'bg-gradient-to-b from-[#132A5C] via-[#0E1E42] to-[#0A1633] text-white border-[#24458A]',
    },
    glass: {
      outer: 'bg-black/60',
      inner: 'bg-slate-900/85 backdrop-blur-md text-white border-white/20',
    },
  };

  const selected = themeVariants[variant];

  return (
    <div className={twMerge(clsx('relative inline-block w-full', className))} {...props}>
      {/* 3D Black Drop-Base */}
      <div
        className={twMerge(
          clsx('absolute inset-0 bg-[#080A10] rounded-sm', elevationOffsets[elevation]),
        )}
        style={clipPathStyle}
      />

      {/* Outer Border Shell */}
      <div
        className={twMerge(clsx('relative p-1 md:p-1.5', selected.outer))}
        style={clipPathStyle}
      >
        {/* Inner Chamfer Surface */}
        <div
          className={twMerge(
            clsx('relative h-full w-full border-[2px] p-5 md:p-7 shadow-inner', selected.inner),
          )}
          style={clipPathStyle}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
