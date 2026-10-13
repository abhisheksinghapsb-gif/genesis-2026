'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SECTIONS } from './tokens';

export function useScrollSection() {
  const [activeSectionId, setActiveSectionId] = useState<string>('home');
  const [isHeroPassed, setIsHeroPassed] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  // Section history stack for the game HUD Back button
  const sectionHistoryRef = useRef<string[]>(['home']);
  const activeSectionIdRef = useRef<string>('home');
  const isNavigatingRef = useRef<boolean>(false);

  // Scroll to section by ID
  const scrollToSection = useCallback((sectionId: string) => {
    isNavigatingRef.current = true;
    activeSectionIdRef.current = sectionId;
    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 70; // offset for HUD
      window.scrollTo({ top, behavior: 'smooth' });

      // Update history stack
      const currentStack = sectionHistoryRef.current;
      if (currentStack[currentStack.length - 1] !== sectionId) {
        sectionHistoryRef.current.push(sectionId);
        setCanGoBack(sectionHistoryRef.current.length > 1);
      }

      // Silent URL update
      if (typeof window !== 'undefined') {
        const hash = sectionId === 'home' ? '' : `#${sectionId}`;
        window.history.replaceState(
          null,
          '',
          hash || window.location.pathname + window.location.search,
        );
      }

      setActiveSectionId(sectionId);

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 700);
    }
  }, []);

  // Back button functionality
  const goBackSection = useCallback(() => {
    if (sectionHistoryRef.current.length > 1) {
      // Pop the current section
      sectionHistoryRef.current.pop();
      // Get the previous section
      const previousSection = sectionHistoryRef.current[sectionHistoryRef.current.length - 1];
      if (previousSection) {
        setCanGoBack(sectionHistoryRef.current.length > 1);
        const targetEl = document.getElementById(previousSection);
        if (targetEl) {
          isNavigatingRef.current = true;
          activeSectionIdRef.current = previousSection;
          const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });

          const hash = previousSection === 'home' ? '' : `#${previousSection}`;
          window.history.replaceState(
            null,
            '',
            hash || window.location.pathname + window.location.search,
          );
          setActiveSectionId(previousSection);

          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 700);
        }
      }
    }
  }, []);

  // Handle deep links and initial hash on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const targetSection = SECTIONS.find((s) => s.id === hash);
        if (targetSection) {
          setTimeout(() => {
            scrollToSection(targetSection.id);
          }, 200);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [scrollToSection]);

  // Track active section and scroll progress via scroll listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Check if hero is passed by ~60%
      const heroEl = document.getElementById('home');
      if (heroEl) {
        const heroHeight = heroEl.offsetHeight || window.innerHeight;
        const heroThreshold = heroHeight * 0.6;
        setIsHeroPassed(scrollY > heroThreshold);
      }

      if (isNavigatingRef.current) return;

      // Determine active section based on viewport position
      const viewportMid = scrollY + window.innerHeight * 0.35;
      let currentVisible = 'home';

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (viewportMid >= top && viewportMid < top + height) {
            currentVisible = section.id;
            break;
          }
        }
      }

      if (activeSectionIdRef.current !== currentVisible) {
        activeSectionIdRef.current = currentVisible;
        const currentStack = sectionHistoryRef.current;
        if (currentStack[currentStack.length - 1] !== currentVisible) {
          sectionHistoryRef.current.push(currentVisible);
          setCanGoBack(sectionHistoryRef.current.length > 1);
        }

        const hash = currentVisible === 'home' ? '' : `#${currentVisible}`;
        window.history.replaceState(
          null,
          '',
          hash || window.location.pathname + window.location.search,
        );
        setActiveSectionId(currentVisible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeSection = SECTIONS.find((s) => s.id === activeSectionId) || SECTIONS[0];

  return {
    activeSectionId,
    activeSection: activeSection!,
    isHeroPassed,
    scrollProgress,
    canGoBack,
    scrollToSection,
    goBackSection,
  };
}
