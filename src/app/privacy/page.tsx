'use client';

import React from 'react';
import { TopBar } from '@/components/ui/TopBar';
import { Footer } from '@/components/layout/Footer';
import { Window } from '@/components/ui/Window';
import { NavigationRail } from '@/components/ui/NavigationRail';
import { privacyPolicy } from '@/content/privacy';

export default function PrivacyPage() {
  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-clip select-none">
      <TopBar title="PRIVACY POLICY" />

      <main className="relative flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6 pt-[84px] sm:pt-[96px] pb-8 z-10 flex flex-col justify-center">
        <Window title="PRIVACY & DATA NOTICE" className="w-full">
          <div className="bg-panel-body p-6 sm:p-8 space-y-6 text-white font-body">
            <p className="text-sm sm:text-base font-semibold leading-relaxed bg-panel-inset/60 p-4 rounded-lg border border-black/20">
              {privacyPolicy.summary}
            </p>

            <div className="space-y-6">
              {privacyPolicy.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="font-display text-lg sm:text-xl text-cta-yellow text-outline-sm">
                    {sec.heading}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-white/95">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 text-xs text-white/70">
              Last updated: {privacyPolicy.lastUpdated} • Army Institute of Technology, Pune
            </div>
          </div>
        </Window>
      </main>

      <NavigationRail />
      <Footer />
    </div>
  );
}
