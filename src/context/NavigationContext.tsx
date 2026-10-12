'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextValue {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: (navigate?: boolean) => void;
  goBack: () => void;
  canGoBack: boolean;
  navDepth: number;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navDepth, setNavDepth] = useState(0);

  // Helper to detect hard reload
  const checkIsReload = () => {
    if (typeof window === 'undefined') return false;
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
      }
      return (performance as any).navigation?.type === 1;
    } catch {
      return false;
    }
  };

  // Initialize and track navigation depth via session history stack and history.state.gx (Section 3.3)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reloaded = checkIsReload();
    const currentPath = window.location.pathname;

    if (reloaded) {
      // Reloaded on an inner page: per §3.3 & Test 5, pressing Back must navigate to /
      sessionStorage.setItem('gx_history', JSON.stringify([currentPath]));
      setNavDepth(0);
      try {
        window.history.replaceState({ ...window.history.state, gx: 0 }, '');
      } catch {}
      return;
    }

    let historyStack: string[] = [];
    try {
      const raw = sessionStorage.getItem('gx_history');
      if (raw) historyStack = JSON.parse(raw);
    } catch {}

    const internalReferrer = document.referrer && document.referrer.startsWith(window.location.origin);

    if (!internalReferrer && historyStack.length === 0) {
      // Direct deep link from external / new tab (Test 3)
      historyStack = [currentPath];
      sessionStorage.setItem('gx_history', JSON.stringify(historyStack));
      setNavDepth(0);
      try {
        window.history.replaceState({ ...window.history.state, gx: 0 }, '');
      } catch {}
      return;
    }

    // If navigated internally
    const lastItem = historyStack[historyStack.length - 1];
    if (lastItem !== currentPath) {
      const prevIndex = historyStack.lastIndexOf(currentPath);
      if (prevIndex !== -1 && prevIndex === historyStack.length - 2) {
        historyStack.pop();
      } else {
        historyStack.push(currentPath);
      }
      sessionStorage.setItem('gx_history', JSON.stringify(historyStack));
    }

    const depth = Math.max(0, historyStack.length - 1);
    setNavDepth(depth);
    try {
      window.history.replaceState({ ...window.history.state, gx: depth }, '');
    } catch {}
  }, [pathname]);

  // Sync popstate back navigation
  useEffect(() => {
    const handlePopState = () => {
      let historyStack: string[] = [];
      try {
        const raw = sessionStorage.getItem('gx_history');
        if (raw) historyStack = JSON.parse(raw);
      } catch {}
      const depth = Math.max(0, historyStack.length - 1);
      setNavDepth(depth);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync menu state with URL hash #menu (Section 3.4)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#menu') {
        setIsMenuOpen(true);
      } else if (isMenuOpen && window.location.hash !== '#menu') {
        setIsMenuOpen(false);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [isMenuOpen]);

  const openMenu = useCallback(() => {
    if (window.location.hash !== '#menu') {
      window.location.hash = 'menu';
    }
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback((navigate = false) => {
    setIsMenuOpen(false);
    if (!navigate && window.location.hash === '#menu') {
      window.history.back();
    }
  }, []);

  const goBack = useCallback(() => {
    try {
      let historyStack: string[] = [];
      try {
        const raw = sessionStorage.getItem('gx_history');
        if (raw) historyStack = JSON.parse(raw);
      } catch {}

      if (historyStack.length > 1 && !checkIsReload()) {
        historyStack.pop();
        sessionStorage.setItem('gx_history', JSON.stringify(historyStack));
        window.history.back();
      } else {
        sessionStorage.setItem('gx_history', JSON.stringify(['/']));
        window.location.href = '/';
      }
    } catch {
      window.location.href = '/';
    }
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        isMenuOpen,
        openMenu,
        closeMenu,
        goBack,
        canGoBack: navDepth > 0,
        navDepth,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
