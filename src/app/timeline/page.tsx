'use client';

import { useEffect } from 'react';

export default function TimelineRedirect() {
  useEffect(() => {
    window.location.replace('/#timeline');
  }, []);

  return (
    <div className="min-h-screen bg-blue-screen flex items-center justify-center text-center p-4">
      <link rel="canonical" href="/" />
      <div className="space-y-4">
        <p className="font-display text-2xl text-cta-yellow animate-pulse">WARPING TO TIMELINE...</p>
        <p className="text-sm text-gray-400">
          If you are not redirected automatically,{' '}
          <a href="/#timeline" className="underline text-white font-bold">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
