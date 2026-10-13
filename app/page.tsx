'use client';

import React from 'react';
import { useLenis } from '@/animations/useLenis';
import { HeroSection } from '@/components/hero/HeroSection';
import { AboutSection } from '@/components/about/AboutSection';
import { TimelineSection } from '@/components/timeline/TimelineSection';
import { PrizesSection } from '@/components/prizes/PrizesSection';
import { SponsorsSection } from '@/components/sponsors/SponsorsSection';
import { MemoriesSection } from '@/components/memories/MemoriesSection';
import { FaqSection } from '@/components/faq/FaqSection';
import { RegisterSection } from '@/components/register/RegisterSection';
import { FooterSection } from '@/components/footer/FooterSection';
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
      <SponsorsSection />

      {/* Themed Divider */}
      <ThemedDivider variant="cyan" />

      {/* 6. Memories Section */}
      <MemoriesSection />

      {/* Themed Divider */}
      <ThemedDivider variant="gold" />

      {/* 7. FAQs Section */}
      <FaqSection />

      {/* Themed Divider */}
      <ThemedDivider variant="purple" />

      {/* 8. Register Section */}
      <RegisterSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
