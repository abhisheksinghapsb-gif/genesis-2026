'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tilt3D } from '../motion/Tilt3D';
import { FloatLoop } from '../motion/FloatLoop';
import { NpcDialogBubble } from '../ui/NpcDialogBubble';
import { about } from '@/content/about';
import { sound } from '@/lib/audio';

interface AboutSceneProps {
  scrollProgress?: number;
}

export const AboutScene: React.FC<AboutSceneProps> = ({ scrollProgress = 0 }) => {
  const [robotLooking, setRobotLooking] = useState(false);
  const [orbSpeeds, setOrbSpeeds] = useState(false);

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#01072B] overflow-hidden select-none flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 perspective-1200 preserve-3d">
      {/* Background Starry Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#08164D_0%,#01072B_100%)] z-0 pointer-events-none" />

      {/* Twinkling Space Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[
          { top: '10%', left: '15%', size: 3, delay: '0.2s' },
          { top: '25%', left: '45%', size: 4, delay: '1.4s' },
          { top: '15%', left: '75%', size: 3, delay: '0.8s' },
          { top: '65%', left: '20%', size: 4, delay: '2.1s' },
          { top: '80%', left: '80%', size: 3, delay: '1.7s' },
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Rotating Bronze Dome Ribs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20 z-0 transition-transform duration-300"
        style={{
          transform: `rotate(${scrollProgress * 25}deg)`,
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full text-[#774732]">
          <circle cx="250" cy="250" r="220" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="250" cy="250" r="160" fill="none" stroke="currentColor" strokeWidth="3" />
          <line x1="250" y1="30" x2="250" y2="470" stroke="currentColor" strokeWidth="3" />
          <line x1="30" y1="250" x2="470" y2="250" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Main Content Layout */}
      <div className="relative max-w-[1400px] mx-auto w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 flex-1 pt-8">
        {/* Left Column: Stacked Title & Chamfered Cream Card */}
        <div className="w-full lg:max-w-[680px] xl:max-w-[740px] flex flex-col items-center lg:items-start space-y-6">
          {/* Stacked Bouncy Title */}
          <div className="text-center lg:text-left">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#D80A0B] text-outline tracking-wider uppercase leading-none drop-shadow-[0_6px_0_#000]">
              ABOUT
            </h2>
            <div className="font-display text-4xl sm:text-5xl md:text-6xl text-wordmark-grey text-outline tracking-wider uppercase leading-none -mt-1 sm:-mt-2 drop-shadow-[0_8px_0_#000]">
              GENESIS
            </div>
          </div>

          {/* Chamfered Cream Card (Auto-expanding, Fixes Text Clipping) */}
          <Tilt3D maxTilt={4} className="w-full">
            <div className="chamfer-outer shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <div className="chamfer-inner p-6 sm:p-8 md:p-10 text-black">
                <div className="space-y-4 font-body font-bold text-base sm:text-lg md:text-xl leading-relaxed text-black/90">
                  <p>
                    <span className="text-[#D80A0B] font-display text-lg sm:text-xl md:text-2xl tracking-wide uppercase mr-1 animate-pulse">
                      Brawlers, gear up!
                    </span>{' '}
                    {about.paragraphs[0].replace('Brawlers, gear up! ', '')}
                  </p>
                  <p>{about.paragraphs[1]}</p>
                </div>
              </div>
            </div>
          </Tilt3D>
        </div>

        {/* Right Column: Robot Hero Art with Orbiting Holographic Spheres */}
        <div
          onMouseEnter={() => {
            setRobotLooking(true);
            setOrbSpeeds(true);
          }}
          onMouseLeave={() => {
            setRobotLooking(false);
            setOrbSpeeds(false);
          }}
          className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] flex items-center justify-center pointer-events-auto cursor-pointer"
        >
          {/* Floating Robot Astronomer */}
          <FloatLoop duration={6} distance={8} rotate={robotLooking ? 3 : 0}>
            <div className="relative w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
              <Image
                src="/art/about-hero.webp"
                alt="Robot Astronomer Hero Art"
                width={500}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />

              {/* Orbiting Holographic Spheres */}
              {/* Sphere 1 */}
              <div
                onClick={() => {
                  sound.playPop();
                }}
                className={`absolute top-[25%] left-[10%] w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 shadow-[0_0_20px_#22d3ee] animate-pulse ${
                  orbSpeeds ? 'scale-125' : ''
                }`}
              />
              {/* Sphere 2 */}
              <div
                onClick={() => {
                  sound.playPop();
                }}
                className={`absolute top-[40%] right-[15%] w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 shadow-[0_0_18px_#38bdf8] ${
                  orbSpeeds ? 'scale-125' : ''
                }`}
              />
              {/* Sphere 3 */}
              <div
                onClick={() => {
                  sound.playPop();
                }}
                className={`absolute top-[60%] left-[25%] w-6 h-6 rounded-full bg-gradient-to-r from-sky-300 to-cyan-500 shadow-[0_0_14px_#0ea5e9] ${
                  orbSpeeds ? 'scale-125' : ''
                }`}
              />
            </div>
          </FloatLoop>
        </div>
      </div>

      {/* NPC Dialogue Bubble */}
      <div className="mt-8 self-start max-w-lg z-20">
        <NpcDialogBubble
          avatar="robot"
          characterName="ROBOT OBSERVER"
          dialogue="DISCOVER THE POWER OF SPATIAL COMPUTING & AR/VR WITH GDXR CLUB!"
          position="left"
        />
      </div>
    </div>
  );
};
