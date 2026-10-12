'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { announcements } from '@/content/announcements';

export const AnnouncementBar: React.FC = () => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<typeof announcements[0] | null>(null);

  useEffect(() => {
    const current = announcements.find((a) => a.active);
    if (!current) return;

    try {
      const dismissed = localStorage.getItem(`dismissed_announcement_${current.id}`);
      if (!dismissed) {
        setActiveAnnouncement(current);
      }
    } catch {
      setActiveAnnouncement(current);
    }
  }, []);

  const handleDismiss = () => {
    if (!activeAnnouncement) return;
    try {
      localStorage.setItem(`dismissed_announcement_${activeAnnouncement.id}`, 'true');
    } catch {}
    setActiveAnnouncement(null);
  };

  if (!activeAnnouncement) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="w-full bg-cta-yellow text-black border-b-2 border-black px-4 py-1.5 flex items-center justify-between text-xs sm:text-sm font-display tracking-wide shadow-md z-40 select-none animate-fadeIn"
    >
      <div className="flex-1 text-center flex items-center justify-center gap-2 flex-wrap">
        <span>📢 {activeAnnouncement.message}</span>
        {activeAnnouncement.linkText && activeAnnouncement.linkUrl && (
          <Link
            href={activeAnnouncement.linkUrl}
            className="underline underline-offset-2 font-bold hover:text-blue-900 ml-1"
          >
            {activeAnnouncement.linkText} →
          </Link>
        )}
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="ml-3 px-1.5 py-0.5 rounded hover:bg-black/10 active:scale-95 font-bold text-sm leading-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};
