'use client';

import React, { useEffect, useState } from 'react';
import { Button3D } from '../ui/Button3D';
import { siteConfig } from '@/content/site';
import { trackEvent } from '@/lib/analytics';
import { sound } from '@/lib/audio';
import { detectTier, setTier, type QualityTier } from '@/lib/tier';
import { STATIONS } from './TrophyRoad';

interface MenuDrawerV2Props {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onJump: (sectionId: string) => void;
  onOpenBrawlerCard?: () => void;
  onToast: (msg: string) => void;
}

export const MenuDrawerV2: React.FC<MenuDrawerV2Props> = ({
  isOpen,
  onClose,
  currentSection,
  onJump,
  onOpenBrawlerCard,
  onToast,
}) => {
  const [tier, setTierState] = useState<QualityTier>('high');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTierState(detectTier());
      setIsMuted(sound.getMuted());
    }
  }, [isOpen]);

  // Trap focus and handle Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTierToggle = () => {
    sound.playTap();
    const nextTier = tier === 'lite' ? 'high' : 'lite';
    setTier(nextTier);
    setTierState(nextTier);
    onToast(`Effects: ${nextTier.toUpperCase()}`);
  };

  const handleSoundToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(!muted);
    onToast(!muted ? 'Sound: OFF 🔇' : 'Sound: ON 🔊');
  };

  const handleShare = async () => {
    sound.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GENESIS 2026 — GDXR Club, AIT Pune',
          text: 'Join the fifth edition of GENESIS, the flagship AR/VR and game hackathon!',
          url: window.location.origin,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.origin);
      onToast('Link copied to clipboard! 📋');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-full bg-[#105DE5] border-l-4 border-black flex flex-col justify-between p-5 z-10 shadow-[-16px_0_40px_rgba(0,0,0,0.8)] overflow-y-auto game-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/40">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-white tracking-wide text-outline-sm">
              GAME MENU
            </span>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-10 h-10 bg-close-red border-2 border-black rounded-lg text-white font-display text-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-[0_3px_0_#000]"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex flex-col gap-2.5 my-4">
          {STATIONS.map((station) => {
            const isCurrent = station.id === currentSection;
            return (
              <button
                key={station.id}
                onClick={() => {
                  sound.playTap();
                  onClose();
                  onJump(station.id);
                }}
                className={`w-full py-2.5 px-4 rounded-xl border-2 border-black font-display text-base tracking-wider transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-cta-yellow text-black -skew-x-4 shadow-[inset_0_2px_0_#fff,0_4px_0_#000]'
                    : 'bg-[#353C52] hover:bg-[#434c68] text-white -skew-x-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_3px_0_#000]'
                }`}
              >
                <span className="skew-x-2">{station.label}</span>
                {isCurrent && (
                  <span className="text-xs bg-black text-cta-yellow px-2 py-0.5 rounded font-sans font-bold">
                    YOU ARE HERE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tools & Toggles */}
        <div className="space-y-3 pt-3 border-t-2 border-black/40">
          {/* Brawler Card Generator Trigger */}
          {onOpenBrawlerCard && (
            <button
              onClick={() => {
                sound.playTap();
                onClose();
                onOpenBrawlerCard();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 border-2 border-black rounded-xl font-display text-sm text-white tracking-wider flex items-center justify-center gap-2 shadow-[0_3px_0_#000] hover:brightness-110"
            >
              <span>⭐</span> MAKE BRAWLER CARD
            </button>
          )}

          {/* Quick Settings: Effects & Sound */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleTierToggle}
              className="py-2 px-3 bg-slate border-2 border-black rounded-lg font-display text-xs text-white hover:brightness-110 flex items-center justify-center gap-1.5"
            >
              <span>⚡</span> FX: {tier === 'lite' ? 'LITE' : 'FULL'}
            </button>

            <button
              onClick={handleSoundToggle}
              className="py-2 px-3 bg-slate border-2 border-black rounded-lg font-display text-xs text-white hover:brightness-110 flex items-center justify-center gap-1.5"
            >
              <span>{isMuted ? '🔊' : '🔇'}</span> {isMuted ? 'SOUND ON' : 'MUTED'}
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full py-2 bg-slate border-2 border-black rounded-lg font-display text-xs text-white hover:brightness-110 flex items-center justify-center gap-2"
          >
            <span>🔗</span> SHARE GENESIS 2026
          </button>
        </div>

        {/* Primary Register CTA */}
        <div className="pt-4 mt-2">
          <Button3D
            variant="yellow"
            className="w-full py-3 text-lg"
            onClick={() => {
              sound.playTap();
              trackEvent('register_click', { placement: 'menu_drawer' });
              if (siteConfig.registrationUrl) {
                window.open(siteConfig.registrationUrl, '_blank', 'noopener,noreferrer');
              } else {
                onToast('Registrations opening soon! Stay tuned, Brawler.');
              }
              onClose();
            }}
          >
            REGISTER NOW
          </Button3D>
        </div>
      </div>
    </div>
  );
};
