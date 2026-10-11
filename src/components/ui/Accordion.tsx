'use client';

import React, { useState } from 'react';
import type { FaqItem } from '@/lib/schema';

interface AccordionProps {
  items: FaqItem[];
  defaultOpenIndex?: number;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
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
        return (
          <div
            key={idx}
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

              {/* Rotating Chevron */}
              <div
                className={`ml-3 transform transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-white stroke-[3.5] drop-shadow-[0_2px_0_#000]"
                >
                  <path d="M 6 9 L 12 15 L 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {/* Accordion Content Panel */}
            <div
              id={`faq-panel-${idx}`}
              role="region"
              aria-labelledby={`faq-btn-${idx}`}
              className={`transition-[max-height,opacity] duration-200 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 pt-3 bg-panel-inset text-white/95 font-body text-sm sm:text-base leading-relaxed border-t border-[#07368E]/60">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
