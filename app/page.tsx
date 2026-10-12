'use client';

import React from 'react';
import { useLenis } from '@/animations/useLenis';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { TimelineSection } from '@/components/timeline/TimelineSection';
import { PrizesSection } from '@/components/prizes/PrizesSection';
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
      <HeroSection />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 2. About Section */}
      <AboutSection />

      {/* Themed Divider */}
      <ThemedDivider variant="cyan" />

      {/* 3. Timeline Section */}
      <TimelineSection />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 4. Prize Pool Section */}
      <PrizesSection />

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
