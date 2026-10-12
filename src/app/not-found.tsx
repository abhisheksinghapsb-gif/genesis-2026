'use client';

import React from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/ui/TopBar';
import { Button3D } from '@/components/ui/Button3D';
import { Banner } from '@/components/ui/Banner';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blue-screen bg-pattern-tile flex flex-col justify-between select-none">
      <TopBar title="404" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-[96px]">
        <div className="space-y-8 max-w-md mx-auto animate-popIn">
          <Banner title="LOST IN SPACE" />

          <p className="font-display text-white text-xl sm:text-2xl text-outline-sm">
            This planet doesn&apos;t exist, Brawler.
          </p>

          <div>
            <Link href="/">
              <Button3D variant="yellow" className="px-8 py-3.5 text-xl">
                RETURN TO HUB
              </Button3D>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
