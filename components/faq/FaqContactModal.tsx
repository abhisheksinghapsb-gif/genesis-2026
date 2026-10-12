'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';

export interface FaqContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqContactModal: React.FC<FaqContactModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
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
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Ask the Organizers"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-3xl border-4 border-[#071733] bg-gradient-to-b from-[#0F2247] via-[#0B1A38] to-[#060E21] p-6 text-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-cyan-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-2.5 py-0.5 font-heading text-xs uppercase text-white shadow-[0_2px_0_#7A2500]">
              HELP DESK
            </span>
            <h3 className="font-heading text-xl sm:text-2xl text-white">STILL STUCK?</h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Help Desk modal"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#000] active:translate-y-0.5"
          >
            <CloseXIcon size={18} />
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="my-8 flex flex-col items-center text-center">
            <div className="mb-3 text-4xl">📨</div>
            <h4 className="font-heading text-2xl text-amber-300">QUESTION DISPATCHED!</h4>
            <p className="mt-2 font-body text-sm font-bold text-sky-200">
              The GDXR operations crew has received your ticket. We will ping you back via Discord / email shortly.
            </p>
            <div className="mt-6">
              <GameButton variant="yellow" size="md" onClick={onClose}>
                GOT IT
              </GameButton>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="my-5 flex flex-col gap-3 font-body"
          >
            <div>
              <label className="font-heading text-xs text-amber-300 uppercase tracking-wide">
                Your Name / Gamer Tag
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PixelKnight"
                className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-heading text-xs text-amber-300 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-heading text-xs text-amber-300 uppercase tracking-wide">
                Your Question
              </label>
              <textarea
                rows={3}
                required
                placeholder="Ask anything about rules, travel, brackets, equipment..."
                className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-body text-xs text-sky-300/80">
                Direct: <strong className="text-white">gdxr@aitpune.edu.in</strong>
              </span>
              <GameButton variant="yellow" size="md" type="submit">
                SEND MESSAGE
              </GameButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
