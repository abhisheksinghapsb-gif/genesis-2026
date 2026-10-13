'use client';

import React, { useState, useMemo } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { FaqContactModal } from './FaqContactModal';
import faqData from '@/content/faqs.json';

interface FaqItem {
  id: string;
  q: string;
  a: string;
  category: string;
}

const FAQS = faqData as FaqItem[];

export const FaqSection: React.FC = () => {
  const { containerRef } = useIdleLoop({ threshold: 0.1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id ?? null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return FAQS;
    return FAQS.filter(
      (item) =>
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      ref={containerRef}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0E1F4B] to-[#0A1638] select-none scroll-mt-16 pt-12 md:pt-14"
      aria-label="Frequently Asked Questions"
    >
      {/* Accessible Title */}
      <h2 className="sr-only">FAQS</h2>

      {/* Edge-to-Edge Video Animation Stage (like innerve.tech) */}
      <div className="relative w-full aspect-[16/9] min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#0E1F4B]">
        {/* MAIN WEBSITE ANIMATION: High-Fidelity Endless Looping FAQs Animation */}
        <video
          src="/videos/faqs-loop.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover z-0"
        />

          {/* Interactive Portal Container inside the Video Window */}
          <div className="absolute top-[16%] left-[18%] w-[64%] h-[78%] z-20 flex flex-col p-2 sm:p-4 overflow-y-auto">
            {/* Search Input Box */}
            <div className="relative mb-3 flex w-full items-center">
              <span className="pointer-events-none absolute left-3 text-sm text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. fees, teams, dates, VR...)"
                className="w-full rounded-xl border border-cyan-500/40 bg-[#07132B]/85 py-2 pl-9 pr-8 font-body text-xs sm:text-sm text-white placeholder:text-slate-400 shadow-inner outline-none transition-colors focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  type="button"
                  aria-label="Clear search query"
                  className="absolute right-3 font-heading text-[10px] text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Accordion Questions List */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-xl border border-cyan-500/30 bg-[#091A3E]/90 backdrop-blur-sm transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-center justify-between gap-2 p-2 sm:p-3 text-left outline-none transition-colors hover:bg-cyan-950/40"
                    >
                      <span className="font-heading text-xs sm:text-sm text-white drop-shadow-sm">
                        {faq.q}
                      </span>
                      <span className="font-heading text-xs text-amber-300">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="border-t border-cyan-500/20 bg-[#06122C]/90 p-2 sm:p-3 text-left">
                        <p className="font-body text-[11px] sm:text-xs text-sky-100 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      {/* Still Stuck? Ask Organizers Button */}
      <button
        type="button"
        onClick={() => setIsContactModalOpen(true)}
        aria-label="Open contact inquiry modal"
        className="mt-6 flex items-center gap-2 rounded-xl border-2 border-yellow-400 bg-gradient-to-b from-amber-400 to-amber-600 px-5 py-2 font-heading text-xs uppercase text-black shadow-[0_3px_0_#4D2600] transition-transform hover:scale-105 active:scale-95"
      >
        <span>STILL STUCK? ASK ORGANIZERS</span>
      </button>

      {/* Support / Contact Modal */}
      <FaqContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};
