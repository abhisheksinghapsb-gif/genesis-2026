'use client';

import { useEffect } from 'react';

export default function AboutRedirect() {
  useEffect(() => {
    window.location.replace('/#about');
  }, []);

  return (
    <div className="min-h-screen bg-[#01072B] flex items-center justify-center text-center p-4">
      <link rel="canonical" href="/" />
      <div className="space-y-4">
        <p className="font-display text-2xl text-cta-yellow animate-pulse">WARPING TO ABOUT...</p>
        <p className="text-sm text-gray-400">
          If you are not redirected automatically,{' '}
          <a href="/#about" className="underline text-white font-bold">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
