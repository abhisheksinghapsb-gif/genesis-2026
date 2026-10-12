'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { Accordion } from '../ui/Accordion';
import { Button3D } from '../ui/Button3D';
import { faqs } from '@/content/faqs';

export const FaqScreen: React.FC = () => {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar with FAQs Banner */}
      <TopBar title="FAQs" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1020px] mx-auto px-4 sm:px-6 py-6 md:py-8 z-10">
        {/* Large Window Matching Mockup x 239-1187, y 186-844 */}
        <div className="w-full rounded-lg overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-popIn">
          {/* Taller Header (~76px) */}
          <div className="h-[70px] sm:h-[80px] bg-panel-header px-4 sm:px-6 flex items-center justify-between select-none">
            <div className="w-[44px]" />
            <h2 className="font-display text-white text-xl sm:text-2xl md:text-3xl tracking-wider text-outline uppercase m-0 text-center">
              GOT QUESTIONS?
            </h2>
            <div className="w-[44px] flex justify-end">
              <Button3D
                variant="red-close"
                onClick={handleClose}
                ariaLabel="Close FAQs and return"
              />
            </div>
          </div>

          {/* 5px Bevel Strip */}
          <div className="h-[3px] bg-panel-header-bevel-light w-full" />
          <div className="h-[2px] bg-panel-header-bevel-dark w-full" />

          {/* Body with Internal Scrollbar */}
          <div className="bg-panel-body p-4 sm:p-6 md:p-8 max-h-[calc(100dvh-280px)] overflow-y-auto game-scrollbar">
            <Accordion items={faqs} defaultOpenIndex={0} />
          </div>

          {/* 8px Footer Strip */}
          <div className="h-[8px] bg-panel-header w-full" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
