'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { sound } from '@/lib/audio';
import { siteConfig } from '@/content/site';

interface GameNavbarProps {
  onRegisterClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export const GameNavbar: React.FC<GameNavbarProps> = ({ onRegisterClick, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'ABOUT', target: 'about' },
    { label: 'TRACKS', target: 'tracks' },
    { label: 'TIMELINE', target: 'timeline' },
    { label: 'PRIZES', target: 'prize-pool' },
    { label: 'MEMORIES', target: 'memories' },
    { label: 'SPONSORS', target: 'sponsors' },
    { label: 'FAQS', target: 'faqs' },
  ];

  const handleLinkClick = (target: string) => {
    sound.playTap();
    onNavigate(target);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070318]/70 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Left: Brand Emblem & Name */}
        <button
          type="button"
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-b from-[#FFE885] via-[#E5A824] to-[#8C5808] p-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-[10px] bg-[#1A0B33] flex items-center justify-center">
              <span className="font-display font-black text-lg md:text-xl text-[#FFD747] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                G
              </span>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-black text-lg md:text-xl tracking-wider text-white group-hover:text-[#FFD747] transition-colors leading-none drop-shadow-[0_2px_0_#000]">
              GENESIS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#B3A4DE] uppercase leading-tight">
              GDXR CLUB • AIT
            </span>
          </div>
        </button>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => handleLinkClick(item.target)}
              className="font-display font-bold text-sm xl:text-base tracking-wider text-white hover:text-[#FFD747] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: 3D Register Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onRegisterClick();
            }}
            className="relative px-5 py-2 md:px-7 md:py-2.5 rounded-xl font-display font-black text-sm md:text-base tracking-wider text-[#382305] uppercase bg-gradient-to-b from-[#FFF28F] via-[#FFD747] to-[#E59F13] border-2 border-[#FFE885] border-b-[5px] border-b-[#996507] active:border-b-2 active:translate-y-[3px] shadow-[0_6px_16px_rgba(0,0,0,0.5)] cursor-pointer transition-all hover:brightness-105"
          >
            REGISTER
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#FFD747] focus:outline-none text-2xl font-bold cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0420]/95 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-xl animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => handleLinkClick(item.target)}
              className="block w-full text-left font-display font-bold text-lg text-white hover:text-[#FFD747] py-2 border-b border-white/5 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
