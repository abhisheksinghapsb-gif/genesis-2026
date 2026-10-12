'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavigationProvider, useNavigation } from '@/context/NavigationContext';
import { MenuDrawer } from './MenuDrawer';
import { Toast } from '../ui/Toast';
import { AnnouncementBar } from '../ui/AnnouncementBar';
import { site } from '@/content/site';

interface AppShellInnerProps {
  children: React.ReactNode;
}

const AppShellInner: React.FC<AppShellInnerProps> = ({ children }) => {
  const pathname = usePathname();
  const { isMenuOpen, closeMenu } = useNavigation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');

  // Scroll to top and announce route change (Section 3.6)
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const titleEl = document.querySelector('h1, h2');
    if (titleEl instanceof HTMLElement) {
      titleEl.tabIndex = -1;
      titleEl.focus({ preventScroll: true });
      setPageTitle(titleEl.textContent || '');
    }
  }, [pathname]);

  const handleRegisterClick = () => {
    if (site.registrationUrl && site.registrationUrl.startsWith('https://')) {
      window.open(site.registrationUrl, '_blank', 'noopener,noreferrer');
    } else {
      setToastMessage('Registrations opening soon! Stay tuned, Brawler.');
    }
  };

  return (
    <>
      {/* Screen Reader Announcement Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {pageTitle && `Navigated to ${pageTitle}`}
      </div>

      {/* Global Announcement Strip (Section 6, F-07) */}
      <AnnouncementBar />

      {/* Main App Content */}
      <div className="flex-1 flex flex-col w-full relative">
        {children}
      </div>

      {/* Global Menu Drawer Mounted Once */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onRegisterClick={handleRegisterClick}
      />

      {/* Global Toast Notification */}
      <Toast
        message={toastMessage || ''}
        isVisible={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
      />
    </>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NavigationProvider>
      <AppShellInner>{children}</AppShellInner>
    </NavigationProvider>
  );
};
