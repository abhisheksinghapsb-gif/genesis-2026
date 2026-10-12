'use client';

import React from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { NavigationRail } from '../ui/NavigationRail';
import { Window } from '../ui/Window';
import { Button3D } from '../ui/Button3D';
import { ScrollAffordance } from '../ui/ScrollAffordance';
import { sponsorTiers } from '@/content/sponsors';
import { site } from '@/content/site';

export const SponsorsScreen: React.FC = () => {
  const titleTier = sponsorTiers.find((t) => t.id === 'title');
  const platformTier = sponsorTiers.find((t) => t.id === 'platform');
  const showSponsorCta = Boolean(site.contactEmail && !site.contactEmail.startsWith('TODO:'));

  const renderTierHeaderAction = (url: string | undefined, tierTitle: string) => {
    if (!url || url.includes('TODO')) return null;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={`Visit ${tierTitle} sponsor website`}
        className="block"
      >
        <Button3D variant="blue-mini" ariaLabel={`Visit ${tierTitle} sponsor`}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-white stroke-[3] drop-shadow-[0_1px_0_#000]"
          >
            <path d="M 10 13 L 13 16 L 20 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 4 4 L 14 4 L 20 10 L 10 20 L 4 14 Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button3D>
      </a>
    );
  };

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-clip select-none">
      {/* Top Bar with SPONSORS Banner */}
      <TopBar title="SPONSORS" />

      {/* Main Content Area: Diagonal Staggered Layout matching sponsor.png / Side-by-side on short laptops */}
      <main className="relative flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 pt-[84px] sm:pt-[96px] pb-6 z-10 flex flex-col justify-center">
        <div className="relative w-full min-h-[580px] short:min-h-0 short:grid short:grid-cols-2 short:gap-6 flex flex-col lg:block gap-8">
          {/* 1. TITLE SPONSORS Window (Desktop Top-Left: x 69-665, y 225-598) */}
          {titleTier && (
            <div className="w-full lg:w-[580px] xl:w-[610px] lg:absolute lg:top-2 lg:left-8 short:relative short:top-auto short:left-auto short:w-full animate-popIn">
              <Window
                title={titleTier.title}
                headerLeftAction={renderTierHeaderAction(
                  titleTier.sponsors[0]?.url,
                  titleTier.title
                )}
              >
                {/* Dark Inset Box (--panel-inset) */}
                <div className="bg-panel-inset p-6 sm:p-10 short:p-6 rounded-lg shadow-inner flex items-center justify-center">
                  {titleTier.sponsors.map((sponsor, idx) => (
                    /* Grey Rounded Plaque (--placeholder-grey) */
                    <div
                      key={idx}
                      className="bg-placeholder-grey w-full max-w-[440px] h-[110px] sm:h-[130px] short:h-[100px] rounded-[14px] p-4 flex items-center justify-center shadow-md border-2 border-black/10"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Window>
            </div>
          )}

          {/* 2. PLATFORM SPONSORS Window (Desktop Bottom-Right: x 782-1383, y 574-949) */}
          {platformTier && (
            <div className="w-full lg:w-[580px] xl:w-[610px] lg:absolute lg:bottom-2 lg:right-8 short:relative short:bottom-auto short:right-auto short:w-full animate-popIn">
              <Window
                title={platformTier.title}
                headerLeftAction={renderTierHeaderAction(
                  platformTier.sponsors[0]?.url,
                  platformTier.title
                )}
              >
                {/* Dark Inset Box */}
                <div className="bg-panel-inset p-6 sm:p-10 short:p-6 rounded-lg shadow-inner flex items-center justify-center">
                  {platformTier.sponsors.map((sponsor, idx) => (
                    /* Grey Rounded Plaque */
                    <div
                      key={idx}
                      className="bg-placeholder-grey w-full max-w-[440px] h-[110px] sm:h-[130px] short:h-[100px] rounded-[14px] p-4 flex items-center justify-center shadow-md border-2 border-black/10"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Window>
            </div>
          )}
        </div>

        {/* Optional Sponsor CTA (Feature F-09) */}
        {showSponsorCta && (
          <div className="mt-6 flex justify-center">
            <a
              href={`mailto:${site.contactEmail}`}
              className="btn-3d-yellow px-8 py-3 rounded text-black font-display text-lg tracking-wider"
            >
              <span className="transform skew-x-[8deg]">BECOME A SPONSOR</span>
            </a>
          </div>
        )}
      </main>

      {/* Scroll Affordance (Section 4.4) */}
      <ScrollAffordance />

      {/* Navigation Sequence Rail (Section 3.6) */}
      <NavigationRail />

      {/* Footer */}
      <Footer />
    </div>
  );
};
