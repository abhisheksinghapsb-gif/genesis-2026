'use client';

import React from 'react';
import { useLenis } from '@/animations/useLenis';
import { HeroSkeleton } from '@/components/hero/HeroSkeleton';
import { AboutSkeleton } from '@/components/about/AboutSkeleton';
import { TimelineSkeleton } from '@/components/timeline/TimelineSkeleton';
import { PrizesSkeleton } from '@/components/prizes/PrizesSkeleton';
import { SponsorsSkeleton } from '@/components/sponsors/SponsorsSkeleton';
import { MemoriesSkeleton } from '@/components/memories/MemoriesSkeleton';
import { FaqSkeleton } from '@/components/faq/FaqSkeleton';
import { RegisterSkeleton } from '@/components/register/RegisterSkeleton';
import { FooterSkeleton } from '@/components/footer/FooterSkeleton';
import { ThemedDivider } from '@/components/ui/ThemedDivider';

export default function HomePage() {
  // Desktop-only Lenis smooth scroll engine
  useLenis();

  return (
    <div className="relative min-h-screen w-full bg-[#060D24] text-white">
      {/* 1. Hero Section */}
      <HeroSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 2. About Section */}
      <AboutSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="cyan" />

      {/* 3. Timeline Section */}
      <TimelineSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 4. Prize Pool Section */}
      <PrizesSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="purple" />

      {/* 5. Sponsors Section */}
      <SponsorsSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="cyan" />

      {/* 6. Memories Section */}
      <MemoriesSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 7. FAQs Section */}
      <FaqSkeleton />

      {/* Themed Divider */}
      <ThemedDivider variant="purple" />

      {/* 8. Register Section */}
      <RegisterSkeleton />

      {/* Footer */}
      <FooterSkeleton />
    </div>
  );
}
