import React from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { NumberedCoin } from '@/components/ui/NumberedCoin';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

const TIMELINE_STEPS = [
  { num: '01', title: 'REGISTRATIONS OPEN', date: '20 OCT 2026', desc: 'Squad applications officially launch.' },
  { num: '02', title: 'QUALIFIER ROUND', date: '05 DEC 2026', desc: 'Online preliminary playoffs.' },
  { num: '03', title: 'SEMI-FINALS', date: '12 DEC 2026', desc: 'Main stage LAN brackets at AIT Pune.' },
  { num: '04', title: 'GRAND FINALE', date: '13 DEC 2026', desc: 'Championship finals and awards ceremony.' },
];

export const TimelineSkeleton: React.FC = () => {
  return (
    <section
      id="timeline"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#14082B] via-[#0D1C44] to-[#0A1638] px-4 py-16"
      aria-label="Event Timeline"
    >
      <WatermarkPattern opacity={0.08} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <SlantedBanner title="TIMELINE" subtitle="ROADMAP TO VICTORY" color="orange" />

        <div className="mt-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINE_STEPS.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <NumberedCoin number={step.num} size="lg" className="mb-4" />
              <ChamferCard variant="cream" elevation="sm">
                <span className="font-heading text-xs text-amber-800 uppercase tracking-widest">
                  {step.date}
                </span>
                <h4 className="font-heading text-lg text-[#2B1400] mt-1">{step.title}</h4>
                <p className="mt-2 font-body text-xs font-bold text-[#573507]">{step.desc}</p>
              </ChamferCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
