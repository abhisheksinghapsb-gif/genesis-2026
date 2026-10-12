import React from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const AboutSkeleton: React.FC = () => {
  return (
    <section
      id="about"
      className="relative flex min-h-[90svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0D1F52] via-[#210D40] to-[#14082B] px-4 py-16 text-center"
      aria-label="About Genesis"
    >
      <WatermarkPattern opacity={0.06} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <SlantedBanner title="ABOUT GENESIS" subtitle="5TH EDITION AR/VR FLAGSHIP" color="orange" />

        <div className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1 */}
          <ChamferCard variant="cream" elevation="md">
            <h3 className="font-heading text-2xl text-[#2B1400]">THE ODYSSEY</h3>
            <p className="mt-2 font-body text-sm md:text-base font-bold text-[#4A2E07] leading-relaxed">
              Organized by the GDXR (Game Development & XR) Club at Army Institute of Technology, Pune. GENESIS brings together visionary creators, esports champions, and VR pioneers for 48 hours of intense competition.
            </p>
          </ChamferCard>

          {/* Card 2 */}
          <ChamferCard variant="cream" elevation="md">
            <h3 className="font-heading text-2xl text-[#2B1400]">DUAL TRACKS</h3>
            <p className="mt-2 font-body text-sm md:text-base font-bold text-[#4A2E07] leading-relaxed">
              Featuring specialized battlegrounds in competitive Gaming (PC/Mobile) and immersive Virtual Reality (Meta Quest / PC VR). Battle for glory and substantial cash prizes.
            </p>
          </ChamferCard>
        </div>
      </div>
    </section>
  );
};
