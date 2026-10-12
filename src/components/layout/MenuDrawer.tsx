'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button3D } from '../ui/Button3D';
import { site } from '@/content/site';
import { trackEvent } from '@/lib/analytics';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: (navigating?: boolean) => void;
  onRegisterClick?: () => void;
}

const navLinks = [
  {
    name: 'ABOUT',
    href: '/about',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 12 16 L 12 12 M 12 8 L 12 8.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'TIMELINE',
    href: '/timeline',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M 12 7 L 12 12 L 15 15" />
      </svg>
    ),
  },
  {
    name: 'PRIZE POOL',
    href: '/prize-pool',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M 5 4 L 19 4 L 18 11 C 18 15 15 18 12 19 C 9 18 6 15 6 11 Z M 10 19 L 10 22 L 14 22 L 14 19" />
      </svg>
    ),
  },
  {
    name: 'MEMORIES',
    href: '/memories',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M 21 15 L 16 10 L 5 21" />
      </svg>
    ),
  },
  {
    name: 'SPONSORS',
    href: '/sponsors',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M 12 2 L 15 8 L 22 9 L 17 14 L 18 21 L 12 18 L 6 21 L 7 14 L 2 9 L 9 8 Z" />
      </svg>
    ),
  },
  {
    name: 'FAQs',
    href: '/faqs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M 9.09 9 C 9.32 8.33 9.9 7.8 10.6 7.5 C 11.3 7.2 12.1 7.3 12.8 7.7 C 13.5 8.1 13.9 8.8 13.9 9.5 C 13.9 11 11.9 11.5 11.9 13 M 12 17 L 12.01 17" />
      </svg>
    ),
  },
];

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onRegisterClick,
}) => {
  const pathname = usePathname()?.replace(/\/$/, '') || '';
  const drawerRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('__sound_pref');
      setSoundEnabled(saved === 'on');
    } catch {
      // ignore
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem('__sound_pref', next ? 'on' : 'off');
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GENESIS 2026 — 5th Edition | GDXR Club AIT Pune',
          text: 'Join the ultimate game dev & XR hackathon at AIT Pune!',
          url: shareUrl,
        });
        return;
      } catch {
        // fall back to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleWhatsAppInvite = () => {
    const text = encodeURIComponent(
      `Gear up for GENESIS 2026, the 5th edition of AIT Pune's flagship hackathon! Check it out: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!isOpen) return;
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
    };
  }, [isOpen, onClose]);

  const handleRegister = () => {
    trackEvent({ name: 'register_click', placement: 'menu' });
    onClose();
    if (onRegisterClick) {
      onRegisterClick();
    } else if (site.registrationUrl && site.registrationUrl.startsWith('https://')) {
      window.open(site.registrationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 flex justify-end bg-[#01072B]/60 select-none animate-fadeIn"
      onClick={() => onClose()}
    >
      {/* Sliding Window Drawer */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] h-full bg-panel-body shadow-[-10px_0_40px_rgba(0,0,0,0.8)] border-l-2 border-black flex flex-col transform transition-transform duration-300 ease-out animate-slideLeft"
      >
        {/* Drawer Header */}
        <div className="h-[58px] bg-panel-header px-5 flex items-center justify-between">
          <h2 className="font-display text-white text-2xl tracking-wider text-outline uppercase m-0">
            MENU
          </h2>
          <Button3D variant="red-close" onClick={() => onClose()} ariaLabel="Close menu" />
        </div>

        {/* Bevel Strip */}
        <div className="h-[3px] bg-panel-header-bevel-light w-full" />
        <div className="h-[2px] bg-panel-header-bevel-dark w-full" />

        {/* Drawer Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto game-scrollbar flex flex-col justify-between gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const isCurrent = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={(e) => {
                    if (isCurrent) {
                      e.preventDefault();
                      onClose(false);
                    } else {
                      trackEvent({ name: 'nav_click', destination: item.href });
                      if (typeof window !== 'undefined' && window.location.hash === '#menu') {
                        window.history.replaceState(null, '', window.location.pathname);
                      }
                      onClose(true);
                    }
                  }}
                  className={`w-full h-[58px] sm:h-[62px] ${
                    isCurrent ? 'btn-3d-yellow' : 'btn-3d-orange'
                  } flex items-center justify-between px-5 sm:px-6 rounded cursor-pointer transition-all`}
                >
                  <span className="transform skew-x-[8deg] flex items-center gap-3 font-display text-white text-lg sm:text-xl tracking-wider text-outline">
                    <span className="text-white drop-shadow-[0_2px_0_#000]">
                      {item.icon}
                    </span>
                    {item.name}
                  </span>

                  {isCurrent && (
                    <span className="transform skew-x-[8deg] px-2 py-0.5 rounded bg-black text-cta-yellow font-display text-[10px] tracking-wider border border-cta-yellow">
                      YOU ARE HERE
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Controls: Sound & Share (F-03, F-05) */}
          <div className="flex items-center justify-between gap-3 p-3 bg-panel-inset rounded-lg border border-black/40">
            <button
              type="button"
              onClick={toggleSound}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded bg-slate text-xs font-display tracking-wider hover:brightness-110 active:translate-y-0.5"
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
              <span>{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded bg-slate text-xs font-display tracking-wider hover:brightness-110 active:translate-y-0.5"
            >
              <span>🔗</span>
              <span>{copiedShare ? 'COPIED!' : 'SHARE'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInvite}
              title="Invite squad on WhatsApp"
              className="py-2 px-3 rounded bg-[#25D366] text-black text-xs font-display tracking-wider hover:brightness-110 active:translate-y-0.5"
            >
              <span>💬</span>
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-4 pt-3 border-t border-white/20">
            {/* REGISTER CTA Button */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full h-[62px] btn-3d-yellow flex items-center justify-center rounded cursor-pointer"
            >
              <span className="transform skew-x-[8deg] font-display text-white text-2xl tracking-wider text-outline">
                REGISTER
              </span>
            </button>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 py-1 text-white/80">
              {site.socials
                .filter((s) => !s.url.includes('TODO'))
                .map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cta-yellow transition-colors font-body text-xs font-semibold"
                  >
                    {s.label}
                  </a>
                ))}
            </div>
          </div>
        </div>

        {/* Footer Strip */}
        <div className="h-[10px] bg-panel-header w-full" />
      </div>
    </div>
  );
};
