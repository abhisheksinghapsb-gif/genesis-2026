import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CloseXIcon } from './GameIcons';

export interface PanelWindowProps {
  title?: string;
  tabLabel?: string;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const PanelWindow: React.FC<PanelWindowProps> = ({
  title,
  tabLabel,
  onClose,
  className,
  children,
}) => {
  return (
    <div className={twMerge(clsx('relative w-full max-w-4xl select-none', className))}>
      {/* 3D Black Drop-Base */}
      <div className="absolute inset-0 translate-y-3 rounded-2xl bg-[#080A10]" />

      {/* Main Panel Outer Border Container */}
      <div className="relative rounded-2xl border-[3px] md:border-4 border-[#071733] bg-[#0E2042] p-2 md:p-3 shadow-2xl">
        {/* Top Header / Tab Bar */}
        <div className="relative flex items-center justify-between pb-2 md:pb-3">
          {/* Blue Tab Accent */}
          {tabLabel ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-[#092B60] bg-gradient-to-r from-[#00A8FF] to-[#0066CC] px-3 py-1 font-heading text-xs md:text-sm tracking-wider text-white uppercase shadow-[0_2px_0_#061A3A]">
              <span className="h-2 w-2 rounded-full bg-cyan-200 animate-ping" />
              {tabLabel}
            </div>
          ) : (
            <div />
          )}

          {/* Title Header */}
          {title && (
            <h3 className="font-heading text-lg md:text-2xl tracking-wide text-white drop-shadow-[0_2px_0_#000]">
              {title}
            </h3>
          )}

          {/* Red X Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              type="button"
              aria-label="Close panel"
              className="group relative flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 md:border-[3px] border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] via-[#F52F57] to-[#B81335] text-white shadow-[0_4px_0_#080A10] transition-transform active:translate-y-[2px] active:shadow-[0_1px_0_#080A10]"
            >
              <CloseXIcon size={18} className="transition-transform group-hover:scale-110" />
            </button>
          )}
        </div>

        {/* Inner Content Vessel */}
        <div className="relative rounded-xl border-2 border-[#1E3B75] bg-gradient-to-b from-[#0F2247] via-[#0B1A38] to-[#081226] p-4 md:p-6 shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};
