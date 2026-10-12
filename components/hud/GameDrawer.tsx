'use client';

import React, { useEffect, useRef } from 'react';
import { SECTIONS, SectionMeta } from '@/animations/tokens';
import { CloseXIcon, SoundOnIcon, SoundOffIcon, MotionToggleIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';

export interface GameDrawerProps {
  isOpen: boolean;
  activeSectionId: string;
  isAudioEnabled: boolean;
  isReducedMotion: boolean;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onToggleAudio: () => void;
  onToggleMotion: () => void;
}

export const GameDrawer: React.FC<GameDrawerProps> = ({
  isOpen,
  activeSectionId,
  isAudioEnabled,
  isReducedMotion,
  onClose,
  onSelectSection,
  onToggleAudio,
  onToggleMotion,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Esc key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus first focusable
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 50);

    // Prevent body scrolling while drawer is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop click area */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative z-10 flex h-full w-full max-w-sm flex-col border-l-4 border-[#071733] bg-gradient-to-b from-[#0D1D3D] via-[#09152E] to-[#050C1C] p-6 shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-cyan-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl tracking-wider text-amber-400 drop-shadow-[0_2px_0_#000]">
              GENESIS MENU
            </span>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] via-[#F52F57] to-[#B81335] text-white shadow-[0_3px_0_#080A10] active:translate-y-1 active:shadow-none"
          >
            <CloseXIcon size={20} />
          </button>
        </div>

        {/* Section Navigation List */}
        <nav className="mt-6 flex flex-1 flex-col gap-2.5">
          {SECTIONS.map((sec: SectionMeta) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec.id);
                  onClose();
                }}
                className={`relative flex items-center justify-between rounded-xl border-[3px] px-4 py-3 font-heading text-lg tracking-wide uppercase transition-all select-none ${
                  isActive
                    ? 'border-[#3D2500] bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-[#1E1200] shadow-[0_4px_0_#080A10] translate-x-1'
                    : 'border-[#132A5C] bg-[#0E2044] text-white hover:border-[#00A8FF] hover:bg-[#152B58] active:translate-y-0.5'
                }`}
              >
                <span>{sec.shortLabel}</span>
                {isActive && (
                  <span className="rounded-md bg-[#1E1200] px-2 py-0.5 text-xs font-black text-amber-300">
                    CURRENT
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Controls: Audio & Motion Toggles */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t-2 border-cyan-800/40 pt-4">
          <button
            onClick={onToggleAudio}
            aria-label={isAudioEnabled ? 'Disable ambient sound' : 'Enable ambient sound'}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#132A5C] bg-[#0E2044] p-2.5 font-heading text-xs text-white uppercase shadow-[0_3px_0_#080A10] active:translate-y-0.5"
          >
            {isAudioEnabled ? (
              <>
                <SoundOnIcon size={18} className="text-emerald-400" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <SoundOffIcon size={18} className="text-slate-400" />
                <span>SOUND OFF</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleMotion}
            aria-label={isReducedMotion ? 'Enable full motion' : 'Reduce motion'}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#132A5C] bg-[#0E2044] p-2.5 font-heading text-xs text-white uppercase shadow-[0_3px_0_#080A10] active:translate-y-0.5"
          >
            <MotionToggleIcon
              size={18}
              className={isReducedMotion ? 'text-amber-400' : 'text-cyan-400'}
            />
            <span>{isReducedMotion ? 'REDUCED' : 'MOTION ON'}</span>
          </button>
        </div>

        {/* Big Register CTA in drawer */}
        <div className="mt-6">
          <GameButton
            variant="yellow"
            size="lg"
            fullWidth
            onClick={() => {
              onSelectSection('register');
              onClose();
            }}
          >
            REGISTER NOW
          </GameButton>
        </div>
      </div>
    </div>
  );
};
