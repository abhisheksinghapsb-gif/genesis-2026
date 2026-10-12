import React from 'react';
import { SlantedBanner } from '@/components/ui/SlantedBanner';
import { ChamferCard } from '@/components/ui/ChamferCard';
import { GameButton } from '@/components/ui/GameButton';
import { WatermarkPattern } from '@/components/ui/WatermarkPattern';

export const RegisterSkeleton: React.FC = () => {
  return (
    <section
      id="register"
      className="relative flex min-h-[95svh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1638] via-[#0E2054] to-[#060D24] px-4 py-20"
      aria-label="Team Registration"
    >
      <WatermarkPattern opacity={0.1} />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <SlantedBanner title="REGISTER SQUAD" subtitle="REGISTRATION OPENS 20 OCT 2026" color="orange" />

        <div className="mt-8 w-full">
          <ChamferCard variant="cream" elevation="lg">
            <div className="flex flex-col items-center text-center">
              <span className="rounded-full bg-amber-500/20 px-3 py-1 font-heading text-xs text-amber-900 uppercase">
                DEMO PREVIEW • REGISTRATION PORTAL
              </span>

              <h3 className="mt-3 font-heading text-2xl md:text-3xl text-[#2B1400]">
                ASSEMBLE YOUR TEAM
              </h3>

              <p className="mt-2 max-w-md font-body text-xs md:text-sm font-bold text-[#573507]">
                Teams of 1 to 4 players can enter the arena. Registration is free. Form backend with Supabase Postgres + Cloudflare Turnstile bot check will activate in Phase 6.
              </p>

              {/* Form placeholder fields */}
              <div className="mt-6 flex w-full flex-col gap-3">
                <input
                  type="text"
                  placeholder="Team / Squad Name"
                  disabled
                  className="w-full rounded-xl border-2 border-[#8C6026] bg-amber-50/80 px-4 py-2.5 font-heading text-sm text-[#2B1400] placeholder:text-amber-900/50 outline-none"
                />
                <input
                  type="email"
                  placeholder="Team Leader Email"
                  disabled
                  className="w-full rounded-xl border-2 border-[#8C6026] bg-amber-50/80 px-4 py-2.5 font-heading text-sm text-[#2B1400] placeholder:text-amber-900/50 outline-none"
                />
              </div>

              <div className="mt-6 w-full">
                <GameButton variant="yellow" size="lg" fullWidth disabled>
                  REGISTRATIONS OPENING SOON
                </GameButton>
              </div>
            </div>
          </ChamferCard>
        </div>
      </div>
    </section>
  );
};
