'use client';

import React, { useEffect, useRef } from 'react';
import { Button3D } from './Button3D';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-[640px]',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Esc key and scroll lock
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#01072B]/80 backdrop-blur-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-panel-body rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-2 border-black transform animate-popIn`}
      >
        {/* Modal Window Header */}
        <div className="h-[54px] bg-panel-header px-4 flex items-center justify-between select-none">
          <div className="w-[44px]" />
          <h2
            id="modal-title"
            className="font-display text-white text-xl sm:text-2xl tracking-wider text-outline uppercase m-0 text-center"
          >
            {title}
          </h2>
          <div className="w-[44px] flex justify-end">
            <Button3D variant="red-close" onClick={onClose} ariaLabel="Close dialog" />
          </div>
        </div>

        {/* 5px Bevel Strip */}
        <div className="h-[3px] bg-panel-header-bevel-light w-full" />
        <div className="h-[2px] bg-panel-header-bevel-dark w-full" />

        {/* Body content with custom scrollbar */}
        <div className="p-6 max-h-[70vh] overflow-y-auto game-scrollbar text-white">
          {children}
        </div>

        {/* 8px Footer Strip */}
        <div className="h-[8px] bg-panel-header w-full" />
      </div>
    </div>
  );
};
