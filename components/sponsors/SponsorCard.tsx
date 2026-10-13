'use client';

import React from 'react';
import Image from 'next/image';
import { useTilt3D } from '@/animations/useTilt3D';

export interface SponsorItem {
  id: string;
  name: string;
  shortName: string;
  role: string;
  logo: string;
  website: string;
}

export const SponsorCard: React.FC<{ sponsor: SponsorItem }> = ({ sponsor }) => {
  const { ref, transformStyle, glareStyle, onPointerMove, onPointerLeave, onPointerDown, onPointerUp } =
    useTilt3D<HTMLAnchorElement>({ maxTilt: 8, scale: 1.03 });

  return (
    <a
      ref={ref}
      style={transformStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      href={sponsor.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col sm:flex-row items-center justify-between rounded-xl border-2 border-[#1E3B75] bg-gradient-to-r from-[#07132B] via-[#0A1A3A] to-[#07132B] p-5 shadow-[0_6px_0_#040814] hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,168,255,0.4)] select-none"
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full bg-gradient-to-r from-white/20 to-transparent blur-md transition-opacity duration-150"
        style={glareStyle}
      />

      {/* Logo Pedestal */}
      <div className="relative flex h-24 w-full sm:w-64 items-center justify-center rounded-lg border border-cyan-500/20 bg-slate-950/60 p-3">
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={260}
          height={75}
          className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
        />
        {/* Periodic Metallic Shine Sweep */}
        <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine-sweep opacity-60" />
      </div>

      {/* Sponsor Credentials */}
      <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-1 flex-col items-center sm:items-start text-center sm:text-left">
        <h4 className="font-heading text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors">
          {sponsor.shortName}
        </h4>
        <p className="mt-1 font-body text-xs sm:text-sm font-bold text-sky-200">
          {sponsor.role}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 font-heading text-xs text-cyan-400 group-hover:underline">
          VISIT OFFICIAL SITE ↗
        </span>
      </div>
    </a>
  );
};
