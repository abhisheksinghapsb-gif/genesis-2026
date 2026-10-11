'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  onDismiss,
  durationMs = 3000,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isVisible, onDismiss, durationMs]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300"
    >
      <div className="btn-3d-slate px-8 py-3.5 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.7)] border-2 border-black">
        <span className="transform skew-x-[8deg] font-display text-white text-base sm:text-lg tracking-wider text-outline-sm whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  );
};
