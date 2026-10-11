'use client';

import React, { useState } from 'react';
import { Button3D } from './Button3D';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerLeftAction?: React.ReactNode;
  collapsible?: boolean;
  initialOpen?: boolean;
  onClose?: () => void;
  headerHeight?: string;
}

export const Window: React.FC<WindowProps> = ({
  title,
  children,
  className = '',
  headerLeftAction,
  collapsible = true,
  initialOpen = true,
  onClose,
  headerHeight = 'h-[54px]',
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const handleToggle = () => {
    if (onClose) {
      onClose();
    } else if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-all duration-300 ${className}`}
    >
      {/* Window Header */}
      <div
        className={`relative ${headerHeight} bg-panel-header px-4 flex items-center justify-between select-none`}
      >
        {/* Left Action (if any, e.g. blue info button in sponsor window) */}
        <div className="w-[44px] flex items-center justify-start">
          {headerLeftAction}
        </div>

        {/* Centered White Outlined Title */}
        <div className="flex-1 text-center px-2">
          <h2 className="font-display text-white text-lg sm:text-xl md:text-2xl tracking-wider text-outline uppercase m-0 leading-none">
            {title}
          </h2>
        </div>

        {/* Right Red Close / Collapse Button */}
        <div className="w-[44px] flex items-center justify-end">
          <Button3D
            variant="red-close"
            onClick={handleToggle}
            ariaLabel={isOpen ? `Collapse ${title}` : `Expand ${title}`}
            aria-expanded={isOpen}
          />
        </div>
      </div>

      {/* 5px Bevel Strip beneath header */}
      <div className="h-[3px] bg-panel-header-bevel-light w-full" />
      <div className="h-[2px] bg-panel-header-bevel-dark w-full" />

      {/* Collapsible Window Body */}
      <div
        className={`bg-panel-body transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 sm:p-6 md:p-8">{children}</div>

        {/* 8px Footer Strip */}
        <div className="h-[8px] bg-panel-header w-full" />
      </div>
    </div>
  );
};
