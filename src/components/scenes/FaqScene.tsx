'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Window } from '../ui/Window';
import { Accordion } from '../ui/Accordion';
import { faqs } from '@/content/faqs';
import { sound } from '@/lib/audio';
import { siteConfig } from '@/content/site';

interface FaqSceneProps {
  onToast: (msg: string) => void;
  scrollProgress?: number;
}

export const FaqScene: React.FC<FaqSceneProps> = ({ onToast, scrollProgress = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [badgeBounced, setBadgeBounced] = useState(false);

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactClick = () => {
    sound.playTap();
    if (siteConfig.contactEmail && !siteConfig.contactEmail.startsWith('TODO:')) {
      window.location.href = `mailto:${siteConfig.contactEmail}?subject=GENESIS%202026%20Query`;
    } else {
      onToast('Have a query? Drop by the GDXR Club Discord or contact team!');
    }
  };

  const handleBadgeClick = () => {
    sound.playPop();
    setBadgeBounced(true);
    setTimeout(() => setBadgeBounced(false), 600);
    const searchInput = document.getElementById('faq-search-input');
    searchInput?.focus();
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Title Header */}
      <div className="relative z-20 text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
          FAQS
        </h2>
      </div>

      {/* Main FAQ Window */}
      <div className="relative max-w-[1000px] mx-auto w-full z-10 flex-1 flex flex-col justify-center">
        {/* Peeking Badge on Top-Right Corner */}
        <div
          onClick={handleBadgeClick}
          className={`absolute -top-10 sm:-top-12 right-2 sm:right-6 z-30 cursor-pointer transition-transform ${
            badgeBounced ? '-translate-y-4 scale-125' : 'hover:-translate-y-2'
          }`}
          title="Ask us! Click to search"
        >
          <Image
            src="/art/badge.png"
            alt="Peeking Star Badge"
            width={72}
            height={64}
            className="w-14 sm:w-18 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] animate-float-fast"
          />
        </div>

        <Window
          title="GOT QUESTIONS?"
          isCollapsed={isCollapsed}
          onToggleCollapse={() => {
            sound.playTap();
            setIsCollapsed(!isCollapsed);
          }}
        >
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* Live Search Input Box */}
            <div className="relative w-full">
              <input
                id="faq-search-input"
                type="text"
                placeholder="Search questions (e.g. fees, teams, VR track)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 bg-black/40 border-2 border-black rounded-xl text-white placeholder-white/60 font-body text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cta-yellow shadow-inner"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70 text-sm">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Accordion Questions */}
            {filteredFaqs.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto game-scrollbar pr-2">
                <Accordion items={filteredFaqs} />
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <p className="font-display text-xl text-cta-yellow tracking-wide">
                  NO MATCH FOUND, BRAWLER!
                </p>
                <p className="text-sm text-white/80">
                  Can't find what you are looking for? Reach out to us below.
                </p>
              </div>
            )}

            {/* "Still Stuck?" Contact Footer */}
            <div className="pt-4 border-t-2 border-black/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs sm:text-sm text-white/90 font-body">
                Still have questions about GENESIS 2026?
              </span>
              <button
                onClick={handleContactClick}
                className="px-5 py-2 bg-cta-yellow hover:bg-cta-yellow-hi text-black font-display text-xs sm:text-sm tracking-wider border-2 border-black rounded-lg shadow-[0_3px_0_#000] -skew-x-4 active:scale-95 transition-all"
              >
                ASK THE CREW ✉️
              </button>
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
};
