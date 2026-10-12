'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Button3D } from '../ui/Button3D';
import { ScreenShake } from '../motion/ScreenShake';
import { FloatLoop } from '../motion/FloatLoop';
import { siteConfig } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { sound } from '@/lib/audio';

interface RegisterSceneProps {
  onToast: (msg: string) => void;
  onBackToTop: () => void;
  scrollProgress?: number;
}

export const RegisterScene: React.FC<RegisterSceneProps> = ({
  onToast,
  onBackToTop,
  scrollProgress = 0,
}) => {
  const [shaking, setShaking] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    // Fire confetti once per session when this section renders
    if (!confettiFired && typeof window !== 'undefined') {
      const fired = sessionStorage.getItem('genesis_confetti_fired');
      if (!fired) {
        sessionStorage.setItem('genesis_confetti_fired', 'true');
        setConfettiFired(true);
        setTimeout(() => {
          sound.playUnlock();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#EFC609', '#EE7123', '#248EF6', '#FFFFFF'],
          });
        }, 300);
      }
    }
  }, [confettiFired]);

  const handleRegister = () => {
    sound.playTap();
    trackEvent('register_click', { placement: 'final' });
    if (siteConfig.registrationUrl && siteConfig.registrationUrl.startsWith('https://')) {
      window.open(siteConfig.registrationUrl, '_blank', 'noopener,noreferrer');
    } else {
      onToast('Registrations opening soon! Stay tuned, Brawler.');
    }
  };

  const handleCalendar = () => {
    sound.playTap();
    // Generate .ics file client-side
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GDXR Club//GENESIS 2026//EN
BEGIN:VEVENT
SUMMARY:GENESIS 2026 Hackathon (GDXR Club AIT Pune)
DESCRIPTION:Fifth Edition of GENESIS Hackathon organized by GDXR Club, AIT Pune.
LOCATION:AIT Pune
DTSTART:20260315T090000Z
DTEND:20260316T180000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'genesis-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast('Calendar invite downloaded! 📅');
  };

  const handleShare = async () => {
    sound.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GENESIS 2026 — GDXR Club, AIT Pune',
          text: 'Lock and load! Join GENESIS 2026, the premier game dev & AR/VR hackathon.',
          url: window.location.origin,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.origin);
      onToast('Link copied to clipboard! 📋');
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#180B52] via-[#2A117C] to-[#01072B] flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Background Starry Sky */}
      <div className="absolute inset-0 bg-violet-tile pointer-events-none opacity-30 z-0" />

      {/* Rising Moon */}
      <div
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, #B2F0FF 0%, #70C5FD 55%, #3B82F6 100%)',
          boxShadow: '0 0 80px 20px rgba(162, 235, 255, 0.35)',
        }}
      />

      {/* Main Closing Content */}
      <div className="relative max-w-[800px] mx-auto w-full z-10 flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
        <ScreenShake active={shaking}>
          {/* Header */}
          <div className="space-y-3">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
              READY TO ENTER THE ARENA?
            </h2>
            <p className="font-body text-base sm:text-lg text-cream/90 max-w-lg mx-auto font-medium">
              Gather your squad, prepare your prototypes, and fight for glory at GENESIS 2026.
            </p>
          </div>

          {/* Giant Dropping REGISTER Button */}
          <div className="pt-4">
            <FloatLoop duration={4} distance={6} rotate={0}>
              <Button3D
                variant="yellow"
                className="px-12 sm:px-20 py-4 sm:py-5 text-2xl sm:text-3xl md:text-4xl font-display uppercase tracking-wider animate-register-pulse shadow-[0_12px_32px_rgba(0,0,0,0.8)]"
                onClick={handleRegister}
              >
                CLAIM YOUR SPOT
              </Button3D>
            </FloatLoop>
          </div>

          {/* Action Row: Calendar & Share */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            <button
              onClick={handleCalendar}
              className="px-5 py-2.5 bg-slate hover:bg-slate/90 text-white font-display text-xs sm:text-sm tracking-wider border-2 border-black rounded-xl shadow-[0_3px_0_#000] -skew-x-6 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>📅</span> ADD TO CALENDAR
            </button>
            <button
              onClick={handleShare}
              className="px-5 py-2.5 bg-slate hover:bg-slate/90 text-white font-display text-xs sm:text-sm tracking-wider border-2 border-black rounded-xl shadow-[0_3px_0_#000] -skew-x-6 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>🔗</span> SHARE EVENT
            </button>
          </div>
        </ScreenShake>
      </div>

      {/* Footer Bar */}
      <footer className="relative z-10 pt-8 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 font-body">
        <p>© 2026 GDXR Club • Army Institute of Technology, Pune</p>
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cta-yellow transition-colors font-display"
          >
            INSTAGRAM
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cta-yellow transition-colors font-display"
          >
            LINKEDIN
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cta-yellow transition-colors font-display"
          >
            DISCORD
          </a>
        </div>
      </footer>
    </div>
  );
};
