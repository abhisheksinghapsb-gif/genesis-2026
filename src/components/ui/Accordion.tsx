'use client';

import React, { useState, useEffect } from 'react';
import type { FaqItem } from '@/lib/schema';

interface AccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number;
}

const getSlug = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  // Sync open item with URL hash #q=slug (Section 3.5)
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#q=')) {
        const slug = hash.replace('#q=', '');
        const foundIdx = items.findIndex((item) => getSlug(item.q) === slug);
        if (foundIdx !== -1) {
          setOpenIndex(foundIdx);
          setTimeout(() => {
            document.getElementById(`faq-btn-${foundIdx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [items]);

  const toggle = (idx: number) => {
    if (openIndex === idx) {
      setOpenIndex(null);
      if (window.location.hash.startsWith('#q=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      setOpenIndex(idx);
      window.location.hash = `q=${getSlug(items[idx].q)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % items.length;
      document.getElementById(`faq-btn-${next}`)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + items.length) % items.length;
      document.getElementById(`faq-btn-${prev}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      document.getElementById('faq-btn-0')?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      document.getElementById(`faq-btn-${items.length - 1}`)?.focus();
    }
  };

  return (
    <div className="space-y-3 select-none">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const slug = getSlug(item.q);

        return (
          <div
            key={slug}
            id={`faq-${slug}`}
            className="rounded-[10px] overflow-hidden border-2 border-[#07368E] shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-panel-inset transition-colors duration-200"
          >
            {/* Accordion Trigger Header */}
            <button
              id={`faq-btn-${idx}`}
              type="button"
              onClick={() => toggle(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${idx}`}
              className={`w-full px-5 py-4 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-node-gold ${
                isOpen ? 'bg-panel-header' : 'bg-panel-inset hover:bg-[#0E55D6]'
              }`}
            >
              <span className="font-display text-white text-base sm:text-lg md:text-xl tracking-wide text-outline-sm drop-shadow-[0_2px_0_#000]">
                {item.q}
              </span>
              <span className="ml-4 transform transition-transform duration-200 flex-shrink-0 text-white">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`stroke-white stroke-[3.5] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  <path d="M 6 9 L 12 15 L 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {/* Collapsible Answer Panel */}
            <div
              id={`faq-panel-${idx}`}
              role="region"
              aria-labelledby={`faq-btn-${idx}`}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[500px] opacity-100 p-5' : 'max-h-0 opacity-0 px-5 py-0 overflow-hidden'
              } bg-[#0A47B2] border-t border-[#07368E]`}
            >
              <p className="font-body text-white/95 text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
