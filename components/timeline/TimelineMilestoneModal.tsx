'use client';

import React, { useEffect, useRef } from 'react';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';

export interface MilestoneItem {
  id: string;
  num: string;
  title: string;
  date: string;
  shortDesc: string;
  venue: string;
  details: string;
  rulesLink: string;
}

export interface TimelineMilestoneModalProps {
  milestone: MilestoneItem | null;
  onClose: () => void;
}

export const TimelineMilestoneModal: React.FC<TimelineMilestoneModalProps> = ({
  milestone,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!milestone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }

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
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => closeBtnRef.current?.focus(), 50);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-2xl border-4 border-[#3F1600] bg-gradient-to-b from-[#2B1704] via-[#1A0E02] to-[#0A0501] p-6 text-white shadow-2xl select-none"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-amber-600/30 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500 font-heading text-lg text-black">
              {milestone.num}
            </span>
            <div>
              <span className="font-heading text-xs text-amber-400 uppercase tracking-widest">
                STAGE {milestone.num} • {milestone.date}
              </span>
              <h3 id="milestone-title" className="font-heading text-2xl text-white">
                {milestone.title}
              </h3>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close milestone details"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#000] active:translate-y-0.5"
          >
            <CloseXIcon size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-5 flex flex-col gap-3 font-body">
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
            <span className="font-heading text-xs text-amber-300 uppercase tracking-wide">
              VENUE / LOCATION:
            </span>
            <p className="font-bold text-sky-200 text-sm mt-0.5">{milestone.venue}</p>
          </div>

          <p className="text-sm sm:text-base font-bold text-amber-100/90 leading-relaxed">
            {milestone.details}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <GameButton variant="yellow" size="md" onClick={onClose}>
            GOT IT, BRAWLER!
          </GameButton>
        </div>
      </div>
    </div>
  );
};
