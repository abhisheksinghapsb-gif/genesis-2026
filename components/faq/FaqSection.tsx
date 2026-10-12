'use client';

import React, { useState, useMemo } from 'react';
import { useIdleLoop } from '@/animations/useIdleLoop';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';
import { CloseXIcon } from '@/components/ui/GameIcons';
import { GameButton } from '@/components/ui/GameButton';
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
  const { containerRef, shouldAnimate } = useIdleLoop({ threshold: 0.1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id ?? null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
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
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1128] via-[#0E1F4B] to-[#0A1638] px-4 py-20 select-none"
      aria-label="Frequently Asked Questions"
    >
      <WatermarkPattern opacity={0.08} animated={shouldAnimate} />

      {/* Floating Particles in Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute top-1/4 right-[8%] text-3xl opacity-20 animate-gentle-float">
          ❓
        </span>
        <span className="absolute bottom-1/3 left-[7%] text-3xl opacity-20 animate-gentle-float" style={{ animationDelay: '-2.5s' }}>
          💡
        </span>
      </div>

      {/* Slanted Title Banner */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <SlantedBanner
          title="FAQS"
          subtitle="FREQUENTLY ASKED QUESTIONS"
          color="orange"
        />
      </div>

      {/* Main Game Window Container */}
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="relative rounded-3xl border-4 border-[#071733] bg-[#0E2042] p-4 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.85)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#1E3B75] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 font-heading text-xs uppercase text-white shadow-[0_2px_0_#7A2500]">
                KNOWLEDGE BASE
              </span>
              <span className="font-heading text-sm sm:text-base text-sky-200 hidden sm:inline">
                GAME RULES & LOGISTICS
              </span>
            </div>

            {/* Red X Collapse Button */}
            <button
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              type="button"
              aria-label={isPanelCollapsed ? 'Expand FAQ panel' : 'Collapse FAQ panel'}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#3B0712] bg-gradient-to-b from-[#FF5E7E] to-[#B81335] text-white shadow-[0_3px_0_#080A10] transition-transform active:translate-y-0.5"
            >
              {isPanelCollapsed ? (
                <span className="font-heading text-lg leading-none">▼</span>
              ) : (
                <CloseXIcon size={16} />
              )}
            </button>
          </div>

          {/* Panel Body */}
          {!isPanelCollapsed && (
            <div className="mt-6 flex flex-col gap-6">
              {/* Real-time Search Box */}
              <div className="relative flex w-full items-center">
                <span className="pointer-events-none absolute left-4 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g. fees, teams, dates, VR...)"
                  className="w-full rounded-2xl border-2 border-[#1E3B75] bg-[#07132B] py-3.5 pr-10 pl-11 font-body text-sm sm:text-base text-white placeholder:text-slate-500 shadow-inner outline-none transition-colors focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    type="button"
                    aria-label="Clear search query"
                    className="absolute right-4 font-heading text-xs text-slate-400 hover:text-white"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Search Result Counter */}
              {searchQuery && (
                <div className="font-heading text-xs text-amber-300">
                  Found {filteredFaqs.length} question{filteredFaqs.length === 1 ? '' : 's'} matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}

              {/* Accordion Questions List */}
              <div className="flex flex-col gap-3">
                {filteredFaqs.length === 0 ? (
                  <div className="my-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1E3B75] p-8 text-center">
                    <span className="text-3xl">🎯</span>
                    <h4 className="mt-2 font-heading text-lg text-white">NO QUESTIONS FOUND</h4>
                    <p className="mt-1 font-body text-xs sm:text-sm text-sky-200">
                      Try searching with different keywords or ask our team directly below.
                    </p>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                          isOpen
                            ? 'border-cyan-400 bg-[#0A1A3E] shadow-[0_4px_0_#050F26]'
                            : 'border-[#152B58] bg-[#07132B] shadow-[0_3px_0_#040917] hover:border-[#1E3B75]'
                        }`}
                      >
                        {/* Question Toggle Header */}
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${faq.id}`}
                          className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-heading text-sm sm:text-base md:text-lg text-white transition-colors hover:text-amber-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-heading text-[10px] text-amber-300 uppercase shrink-0">
                              {faq.category}
                            </span>
                            <span>{faq.q}</span>
                          </div>

                          {/* Plus / Minus with 90deg Spin */}
                          <div
                            className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#1E3B75] bg-[#0E2042] font-heading text-lg text-amber-400 transition-transform duration-300 ${
                              isOpen ? 'rotate-90 bg-amber-400 text-black border-amber-500' : 'rotate-0'
                            }`}
                          >
                            {isOpen ? '✕' : '+'}
                          </div>
                        </button>

                        {/* Unrolling Answer Block */}
                        {isOpen && (
                          <div
                            id={`faq-answer-${faq.id}`}
                            className="border-t border-cyan-800/40 bg-[#091836] p-4 sm:p-5 font-body text-xs sm:text-sm font-bold text-sky-200 leading-relaxed"
                          >
                            <span className="mr-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-300 uppercase">
                              DEMO
                            </span>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom "Still Stuck?" Callout */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between rounded-2xl border-2 border-[#1E3B75] bg-gradient-to-r from-[#07132B] via-[#0B1E45] to-[#07132B] p-4 sm:p-5">
                <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <h4 className="font-heading text-base sm:text-lg text-white">STILL HAVE QUESTIONS?</h4>
                  <p className="font-body text-xs font-bold text-sky-200">
                    Reach out to the GDXR organizing team directly for custom queries or rule clarifications.
                  </p>
                </div>

                <GameButton
                  variant="yellow"
                  size="sm"
                  onClick={() => setIsContactModalOpen(true)}
                  aria-label="Open contact inquiry modal"
                >
                  STILL STUCK?
                </GameButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Still Stuck Inquiry Modal */}
      <FaqContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};
