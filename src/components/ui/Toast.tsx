'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { config } from '@/lib/config';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  onDismiss?: () => void;
  onActionClick?: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onClose,
  onDismiss,
  onActionClick,
  durationMs = 5000,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const handleDismiss = onClose || onDismiss || (() => {});

  useEffect(() => {
    if (!isVisible || isPaused) return;
    const timer = setTimeout(() => {
      handleDismiss();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isVisible, isPaused, handleDismiss, durationMs]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300 px-4 max-w-[95vw]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="btn-3d-slate px-5 sm:px-8 py-3 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.85)] border-2 border-black flex items-center gap-4">
        <span className="transform skew-x-[8deg] font-display text-white text-sm sm:text-base tracking-wider text-outline-sm whitespace-nowrap">
          {message}
        </span>

        {/* Action Link / Button: NOTIFY ME if backend is on, otherwise SEE FAQs (§3.6 & §7 B1) */}
        {config.isBackendEnabled ? (
          <button
            type="button"
            onClick={onActionClick || onClose}
            className="transform skew-x-[8deg] px-3 py-1 rounded bg-cta-yellow hover:bg-cta-yellow-hi text-black font-display text-xs sm:text-sm tracking-wider uppercase border border-black shadow-[0_2px_0_#000] active:translate-y-0.5 whitespace-nowrap cursor-pointer"
          >
            NOTIFY ME
          </button>
        ) : (
          <Link
            href="/faqs/#q=how-do-i-register"
            onClick={onClose}
            className="transform skew-x-[8deg] px-3 py-1 rounded bg-cta-yellow hover:bg-cta-yellow-hi text-black font-display text-xs sm:text-sm tracking-wider uppercase border border-black shadow-[0_2px_0_#000] active:translate-y-0.5 whitespace-nowrap"
          >
            SEE FAQs
          </Link>
        )}

        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss toast"
          className="transform skew-x-[8deg] text-white/70 hover:text-white font-bold text-sm px-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
