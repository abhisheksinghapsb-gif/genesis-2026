'use client';

import React from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/ui/TopBar';
import { Button3D } from '@/components/ui/Button3D';
import { Banner } from '@/components/ui/Banner';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-blue-screen bg-pattern-tile flex flex-col justify-between select-none">
      <TopBar title="ERROR" />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-[96px]">
        <div className="space-y-6 max-w-md mx-auto animate-popIn">
          <Banner title="SYSTEM GLITCH" />

          <p className="font-display text-white text-xl sm:text-2xl text-outline-sm">
            Something went wrong in the arena.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button3D variant="yellow" onClick={reset} className="px-6 py-3 text-lg">
              TRY AGAIN
            </Button3D>

            <Link href="/">
              <Button3D variant="slate" className="px-6 py-3 text-lg">
                HOME
              </Button3D>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
