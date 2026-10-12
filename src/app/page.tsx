'use client';

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { initTier } from '@/lib/tier';
import { sound } from '@/lib/audio';
import { Toast } from '@/components/ui/Toast';
import { GameNavbar } from '@/components/ui/GameNavbar';
import { GameDivider } from '@/components/ui/GameDivider';
import { FloatingControls } from '@/components/ui/FloatingControls';
import { CosmicBackground } from '@/components/motion/CosmicBackground';

import { LoaderScene } from '@/components/scenes/LoaderScene';
import { HeroScene } from '@/components/scenes/HeroScene';
import { CountdownSection } from '@/components/scenes/CountdownSection';
import { AboutScene } from '@/components/scenes/AboutScene';
import { TracksSection } from '@/components/scenes/TracksSection';
import { TimelineScene } from '@/components/scenes/TimelineScene';
import { PrizeScene } from '@/components/scenes/PrizeScene';
import { MemoriesScene } from '@/components/scenes/MemoriesScene';
import { SponsorsScene } from '@/components/scenes/SponsorsScene';
import { FaqScene } from '@/components/scenes/FaqScene';
import { RegisterScene } from '@/components/scenes/RegisterScene';
import { BrawlerCardModal } from '@/components/modals/BrawlerCardModal';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const SECTIONS = [
  'hero',
  'countdown',
  'about',
  'tracks',
  'timeline',
  'prize-pool',
  'memories',
  'sponsors',
  'faqs',
  'register',
];

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [brawlerCardOpen, setBrawlerCardOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const jumpToSection = (sectionId: string) => {
    sound.playTap();
    const elem = document.getElementById(sectionId);
    if (!elem) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(elem, { duration: 1.2 });
    } else {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    window.history.replaceState(null, '', `/#${sectionId}`);
    setCurrentSection(sectionId);
  };

  useEffect(() => {
    initTier();

    // Setup Lenis smooth scroll for desktop pointers
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // Scroll listener for active section tracking
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSection(SECTIONS[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Deep link hash handling on initial load
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        jumpToSection(targetId);
      }, 400);
    }

    // Keyboard Shortcuts: Esc close overlay, Home/End
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Home') {
        jumpToSection('hero');
      } else if (e.key === 'End') {
        jumpToSection('register');
      } else if (e.key === 'Escape') {
        if (activeOverlay) setActiveOverlay(null);
        if (brawlerCardOpen) setBrawlerCardOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      lenisRef.current?.destroy();
    };
  }, [activeOverlay, brawlerCardOpen]);

  return (
    <div className="relative w-full bg-[#01072B] text-white overflow-x-hidden min-h-screen">
      {/* 1. Lobby First-Visit Loader */}
      <LoaderScene onComplete={() => ScrollTrigger.refresh()} />

      {/* 2. Continuous Ambient Cosmic Motion Background */}
      <CosmicBackground />

      {/* 3. Fixed Top Game Navbar */}
      <GameNavbar
        onNavigate={jumpToSection}
        onRegisterClick={() => jumpToSection('register')}
      />

      {/* 4. Fixed Bottom-Right Controls (Audio + Back-to-Top) */}
      <FloatingControls
        onBackToTop={() => jumpToSection('hero')}
        showBackToTop={currentSection !== 'hero'}
      />

      {/* 5. Main Continuous Single-Page Stages */}
      <main className="relative w-full z-10 pt-16 md:pt-20">
        {/* Stage 1: Hero Observatory Sky */}
        <section id="hero" data-scene="hero">
          <HeroScene onToast={showToast} />
        </section>

        {/* Stage 2: Countdown & Date Board */}
        <section id="countdown" data-scene="countdown">
          <CountdownSection />
        </section>

        <GameDivider />

        {/* Stage 3: About Observatory */}
        <section id="about" data-scene="about">
          <AboutScene />
        </section>

        <GameDivider />

        {/* Stage 4: Hackathon Challenge Arenas */}
        <section id="tracks" data-scene="tracks">
          <TracksSection />
        </section>

        <GameDivider />

        {/* Stage 5: Timeline Quest Road */}
        <section id="timeline" data-scene="timeline">
          <TimelineScene
            onOpenOverlay={(id) => setActiveOverlay(id)}
            onCloseOverlay={() => setActiveOverlay(null)}
          />
        </section>

        <GameDivider />

        {/* Stage 6: Prize Pool Vault */}
        <section id="prize-pool" data-scene="prize-pool">
          <PrizeScene />
        </section>

        <GameDivider />

        {/* Stage 7: Memories & Highlights */}
        <section id="memories" data-scene="memories">
          <MemoriesScene
            onOpenOverlay={(id) => setActiveOverlay(id)}
            onCloseOverlay={() => setActiveOverlay(null)}
          />
        </section>

        <GameDivider />

        {/* Stage 8: Sponsors Showcase */}
        <section id="sponsors" data-scene="sponsors">
          <SponsorsScene />
        </section>

        <GameDivider />

        {/* Stage 9: FAQs Game Accordion */}
        <section id="faqs" data-scene="faqs">
          <FaqScene onToast={showToast} />
        </section>

        <GameDivider />

        {/* Stage 10: Register Final Scene & Footer */}
        <section id="register" data-scene="register">
          <RegisterScene
            onToast={showToast}
            onBackToTop={() => jumpToSection('hero')}
          />
        </section>
      </main>

      {/* 6. Global Toast Notification */}
      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* 7. Brawler Card Generator Modal */}
      <BrawlerCardModal
        isOpen={brawlerCardOpen}
        onClose={() => setBrawlerCardOpen(false)}
        onToast={showToast}
      />
    </div>
  );
}
