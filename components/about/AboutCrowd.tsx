'use client';

import React from 'react';

export interface AboutCrowdProps {
  shouldAnimate: boolean;
}

export const AboutCrowd: React.FC<AboutCrowdProps> = ({ shouldAnimate }) => {
  return (
    <div className="pointer-events-none absolute bottom-0 inset-x-0 z-10 overflow-hidden select-none" aria-hidden="true">
      {/* Crowd Silhouettes with Staggered Cheering Bob */}
      <svg
        viewBox="0 0 1440 180"
        fill="#040714"
        className={`w-full h-20 sm:h-28 md:h-36 object-cover ${
          shouldAnimate ? 'animate-gentle-float' : ''
        }`}
        style={{ animationDuration: '2.8s' }}
        preserveAspectRatio="none"
      >
        <path d="M0,180 L1440,180 L1440,80 Q1400,60 1360,95 Q1320,65 1280,90 Q1240,55 1200,85 Q1160,60 1120,90 Q1080,70 1040,95 Q1000,50 960,85 Q920,65 880,90 Q840,55 800,85 Q760,70 720,95 Q680,60 640,90 Q600,50 560,85 Q520,65 480,90 Q440,55 400,85 Q360,65 320,95 Q280,50 240,85 Q200,65 160,90 Q120,55 80,85 Q40,65 0,90 Z" />
        {/* Layer 2 cheering heads */}
        <path
          d="M0,180 L1440,180 L1440,110 Q1410,90 1380,120 Q1340,95 1300,115 Q1260,85 1220,110 Q1170,90 1130,115 Q1090,100 1050,120 Q1010,85 970,115 Q930,95 890,115 Q850,85 810,110 Q770,100 730,120 Q690,90 650,115 Q610,85 570,110 Q530,95 490,115 Q450,85 410,110 Q370,95 330,120 Q290,85 250,110 Q210,95 170,115 Q130,85 90,110 Q50,95 0,115 Z"
          fill="#02040B"
        />
      </svg>
    </div>
  );
};
