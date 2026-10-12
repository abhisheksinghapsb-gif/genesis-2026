'use client';

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { initTier } from '@/lib/tier';
import { sound } from '@/lib/audio';
import { Toast } from '@/components/ui/Toast';
import { HUDLayer } from '@/components/hud/HUDLayer';
import { STATIONS } from '@/components/hud/TrophyRoad';

import { LoaderScene } from '@/components/scenes/LoaderScene';
import { HeroScene } from '@/components/scenes/HeroScene';
import { AboutScene } from '@/components/scenes/AboutScene';
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

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
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

    // Scroll listener for progress & active section
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll position
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      for (let i = STATIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(STATIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setCurrentSection(STATIONS[i].id);
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

    // Keyboard Shortcuts: 1-8 jump, M menu, Esc close overlay
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= STATIONS.length) {
        jumpToSection(STATIONS[num - 1].id);
      } else if (e.key === 'Home') {
        jumpToSection('hero');
      } else if (e.key === 'End') {
        jumpToSection('register');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#01072B] text-white overflow-x-hidden">
      {/* 1. Lobby First-Visit Loader */}
      <LoaderScene onComplete={() => ScrollTrigger.refresh()} />

      {/* 2. Master Fixed HUD Layer */}
      <HUDLayer
        currentSection={currentSection}
        scrollProgress={scrollProgress}
        onJump={jumpToSection}
        activeOverlay={activeOverlay}
        onCloseOverlay={() => setActiveOverlay(null)}
        onOpenBrawlerCard={() => setBrawlerCardOpen(true)}
        onToast={showToast}
      />

      {/* 3. Main Continuous Single-Page Stages */}
      <main className="relative w-full">
        {/* Stage 1: Hero */}
        <section id="hero" data-scene="hero">
          <HeroScene onToast={showToast} scrollProgress={currentSection === 'hero' ? scrollProgress * 5 : 0} />
        </section>

        {/* Stage 2: About */}
        <section id="about" data-scene="about">
          <AboutScene />
        </section>

        {/* Stage 3: Timeline */}
        <section id="timeline" data-scene="timeline">
          <TimelineScene
            onOpenOverlay={(id) => setActiveOverlay(id)}
            onCloseOverlay={() => setActiveOverlay(null)}
          />
        </section>

        {/* Stage 4: Prize Pool */}
        <section id="prize-pool" data-scene="prize-pool">
          <PrizeScene />
        </section>

        {/* Stage 5: Memories */}
        <section id="memories" data-scene="memories">
          <MemoriesScene
            onOpenOverlay={(id) => setActiveOverlay(id)}
            onCloseOverlay={() => setActiveOverlay(null)}
          />
        </section>

        {/* Stage 6: Sponsors */}
        <section id="sponsors" data-scene="sponsors">
          <SponsorsScene />
        </section>

        {/* Stage 7: FAQs */}
        <section id="faqs" data-scene="faqs">
          <FaqScene onToast={showToast} />
        </section>

        {/* Stage 8: Register Final Scene */}
        <section id="register" data-scene="register">
          <RegisterScene
            onToast={showToast}
            onBackToTop={() => jumpToSection('hero')}
          />
        </section>
      </main>

      {/* 4. Global Toast Notification */}
      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* 5. Brawler Card Generator Modal */}
      <BrawlerCardModal
        isOpen={brawlerCardOpen}
        onClose={() => setBrawlerCardOpen(false)}
        onToast={showToast}
      />
    </div>
  );
}
