'use client';

import React, { useState } from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { PanelWindow } from '@/components/ui/PanelWindow';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'Who can participate in GENESIS 2026?',
    a: 'Any college or university student with a valid student ID is eligible to register and compete.',
  },
  {
    id: 'faq-2',
    q: 'How big can a team be?',
    a: 'Squad sizes can range from 1 to 4 members depending on your chosen track category.',
  },
  {
    id: 'faq-3',
    q: 'Is there any registration fee?',
    a: 'No! Registration is completely free (₹0) for all qualifying university participants.',
  },
  {
    id: 'faq-4',
    q: 'What is the VR Track?',
    a: 'The VR Track features specialized competitive games and experiences on standalone Meta Quest and PC VR headsets.',
  },
  {
    id: 'faq-5',
    q: 'Where and when will the finals take place?',
    a: 'The LAN semi-finals and grand finale will take place on 12-13 December 2026 at the Army Institute of Technology (AIT) Pune campus.',
  },
];

export const FaqSkeleton: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(FAQ_LIST[0]?.id ?? null);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0E1F4B] to-[#0A1638] px-4 py-16"
      aria-label="Frequently Asked Questions"
    >
      <WatermarkPattern opacity={0.08} />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
        <SlantedBanner title="FAQS" subtitle="FREQUENTLY ASKED QUESTIONS" color="orange" />

        <div className="mt-8 w-full">
          <PanelWindow tabLabel="KNOWLEDGE BASE" title="HAVE QUESTIONS?">
            <div className="flex flex-col gap-3">
              {FAQ_LIST.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-xl border-2 border-[#152B58] bg-[#07132B] shadow-[0_3px_0_#040917]"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="flex w-full items-center justify-between p-4 text-left font-heading text-sm md:text-base text-white transition-colors hover:text-amber-300"
                    >
                      <span>{faq.q}</span>
                      <span className="ml-3 font-heading text-lg text-amber-400">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-answer-${faq.id}`}
                        className="border-t border-cyan-800/40 bg-[#091836] p-4 font-body text-xs md:text-sm font-bold text-sky-200"
                      >
                        <span className="inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-300 uppercase mr-2">
                          DEMO
                        </span>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </PanelWindow>
        </div>
      </div>
    </section>
  );
};
