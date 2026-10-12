'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';

export interface MemoryItem {
  id: string;
  title: string;
  year: string;
  edition: string;
  category: string;
  caption: string;
  colorGradient: string;
}

export interface MemoriesLightboxProps {
  isOpen: boolean;
  item: MemoryItem | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MemoriesLightbox: React.FC<MemoriesLightboxProps> = ({
  isOpen,
  item,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrev,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset zoom on item change
  useEffect(() => {
    setIsZoomed(false);
  }, [item?.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();

      // Focus trapping
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [isOpen, onClose, onNext, onPrev],
  );

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !item) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    setTouchStartX(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const touchEndX = touch.clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onNext();
      } else {
        onPrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Memory: ${item.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Lightbox Frame */}
      <div
        ref={modalRef}
        className="relative z-10 flex w-full max-w-3xl flex-col rounded-3xl border-4 border-[#071733] bg-[#0E1F42] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.9)]"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b-2 border-cyan-800/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 font-heading text-xs uppercase tracking-wider text-white shadow-[0_2px_0_#7A2500]">
              {item.edition}
            </span>
            <span className="font-heading text-xs text-sky-300">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              type="button"
              title="Toggle Zoom"
              aria-label="Toggle Zoom"
              className="hidden sm:flex h-9 items-center justify-center rounded-xl border-2 border-[#152B58] bg-[#07132B] px-3 font-heading text-xs text-cyan-300 hover:text-white"
            >
              {isZoomed ? 'ZOOM OUT' : 'ZOOM IN'}
            </button>

            <button
              onClick={onClose}
              type="button"
              aria-label="Close Lightbox"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#000] active:translate-y-0.5"
            >
              <CloseXIcon size={18} />
            </button>
          </div>
        </div>

        {/* Visual Frame */}
        <div className="relative my-4 flex aspect-[16/10] sm:aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-[#1B366B] bg-gradient-to-b from-slate-950 via-[#0A1633] to-slate-950 p-6 text-center shadow-inner">
          {/* Dynamic Ambient Gradient Backlight */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.colorGradient} opacity-70 transition-opacity duration-500`}
          />

          {/* Holographic Geometric Patterns */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60" />

          {/* Card Content with Zoom Capability */}
          <div
            className={`relative z-10 flex flex-col items-center justify-center transition-transform duration-300 ${
              isZoomed ? 'scale-125' : 'scale-100'
            }`}
          >
            <span className="mb-2 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 font-heading text-xs tracking-widest text-amber-300 uppercase shadow-sm">
              ★ {item.category} • {item.year} ★
            </span>
            <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl tracking-wide text-white drop-shadow-[0_4px_0_#040914]">
              {item.title}
            </h3>
            <p className="mt-3 max-w-lg font-body text-xs sm:text-sm md:text-base font-bold text-sky-200 drop-shadow">
              {item.caption}
            </p>
          </div>

          {/* Bottom Left Watermark */}
          <div className="pointer-events-none absolute bottom-3 left-4 font-heading text-[10px] sm:text-xs text-white/30 tracking-widest">
            GDXR ARCHIVES • AIT PUNE
          </div>
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="flex items-center justify-between pt-2">
          <GameButton
            variant="blue"
            size="sm"
            onClick={onPrev}
            aria-label="Previous memory"
          >
            ◄ PREV
          </GameButton>

          <span className="font-heading text-xs text-slate-400">
            Use ◄ / ► arrow keys or swipe
          </span>

          <GameButton
            variant="blue"
            size="sm"
            onClick={onNext}
            aria-label="Next memory"
          >
            NEXT ►
          </GameButton>
        </div>
      </div>
    </div>
  );
};
