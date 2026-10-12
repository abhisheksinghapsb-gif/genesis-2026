'use client';

import { useEffect } from 'react';

export default function FaqsRedirect() {
  useEffect(() => {
    window.location.replace('/#faqs');
  }, []);

  return (
    <div className="min-h-screen bg-blue-screen flex items-center justify-center text-center p-4">
      <link rel="canonical" href="/" />
      <div className="space-y-4">
        <p className="font-display text-2xl text-cta-yellow animate-pulse">WARPING TO FAQS...</p>
        <p className="text-sm text-gray-400">
          If you are not redirected automatically,{' '}
          <a href="/#faqs" className="underline text-white font-bold">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
