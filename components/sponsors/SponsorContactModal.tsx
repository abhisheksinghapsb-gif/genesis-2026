'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';

export interface SponsorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SponsorContactModal: React.FC<SponsorContactModalProps> = ({ isOpen, onClose }) => {
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Become a Sponsor"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-lg rounded-2xl border-4 border-[#071733] bg-gradient-to-b from-[#0F2247] via-[#0B1A38] to-[#060E21] p-6 text-white shadow-2xl select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-cyan-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-gradient-to-r from-[#00A8FF] to-[#0066CC] px-2.5 py-0.5 font-heading text-xs uppercase">
              PARTNERSHIP
            </span>
            <h3 className="font-heading text-xl sm:text-2xl text-white">BECOME A SPONSOR</h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sponsor inquiry"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#000] active:translate-y-0.5"
          >
            <CloseXIcon size={18} />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="my-8 flex flex-col items-center text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <h4 className="font-heading text-2xl text-amber-300">INQUIRY RECEIVED!</h4>
            <p className="mt-2 font-body text-sm font-bold text-sky-200">
              Our sponsorship committee will contact you within 24 hours with the official Genesis
              2026 partner deck.
            </p>
            <div className="mt-6">
              <GameButton variant="yellow" size="md" onClick={onClose}>
                CLOSE
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
                Company / Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Tech Studio"
                className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-heading text-xs text-amber-300 uppercase tracking-wide">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder="partner@company.com"
                className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="font-heading text-xs text-amber-300 uppercase tracking-wide">
                Interested Tier
              </label>
              <select className="mt-1 w-full rounded-xl border-2 border-[#132A5C] bg-[#07132B] px-4 py-2 font-body text-sm text-white outline-none focus:border-amber-400">
                <option value="title">Title Sponsor</option>
                <option value="platform">Platform Sponsor</option>
                <option value="gold">Gold Tier</option>
                <option value="media">Media & Community Partner</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <GameButton variant="yellow" size="md" type="submit">
                SUBMIT INQUIRY
              </GameButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
