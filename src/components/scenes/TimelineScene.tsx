'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Node } from '../ui/Node';
import { InfoDot } from '../ui/InfoDot';
import { Modal } from '../ui/Modal';
import { Tilt3D } from '../motion/Tilt3D';
import { StarBurst } from '../motion/StarBurst';
import { timeline } from '@/content/timeline';
import { formatDate, getTimelineStatus } from '@/lib/format';
import { sound } from '@/lib/audio';
import type { TimelineStage } from '@/lib/schema';

interface TimelineSceneProps {
  onOpenOverlay?: (id: string) => void;
  onCloseOverlay?: () => void;
  scrollProgress?: number;
}

export const TimelineScene: React.FC<TimelineSceneProps> = ({
  onOpenOverlay,
  onCloseOverlay,
  scrollProgress = 0,
}) => {
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [starBurstActive, setStarBurstActive] = useState<number | null>(null);

  const desktopLeftPositions = ['5%', '30%', '55%', '80%'];

  const handleOpenStage = (stage: TimelineStage) => {
    sound.playPop();
    setSelectedStage(stage);
    onOpenOverlay?.(`stage-${stage.n}`);
  };

  const handleCloseModal = () => {
    setSelectedStage(null);
    onCloseOverlay?.();
  };

  const handleNodeClick = (n: number) => {
    sound.playTap();
    setActiveNode(n);
    setStarBurstActive(n);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between py-12 md:py-16 px-4 sm:px-6 md:px-12 select-none overflow-hidden perspective-1200 preserve-3d">
      {/* Title Header */}
      <div className="relative z-20 text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white text-outline tracking-wider uppercase drop-shadow-[0_6px_0_#000]">
          TIMELINE
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-[1440px] mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-between z-10 gap-6">
        {/* Left Column: Collectible Colt Character Card */}
        <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] flex-shrink-0 flex justify-center items-center z-20">
          <Tilt3D maxTilt={10}>
            <div className="relative transform -rotate-[3deg] hover:rotate-0 transition-transform duration-300 drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)] cursor-pointer animate-float-slow">
              <Image
                src="/art/timeline-card.webp"
                alt="Colt Collectible Character Card"
                width={360}
                height={570}
                className="w-full h-auto"
                priority
              />
              {/* Holographic Sheen Layer */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-purple-500/20 mix-blend-screen rounded-xl" />
            </div>
          </Tilt3D>
        </div>

        {/* Right Section: Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="relative flex-1 w-full overflow-visible">
          {/* DESKTOP VIEW: Alternating Horizontal Timeline (≥ 1024px) */}
          <div className="hidden lg:block relative w-full h-[660px]">
            {/* Horizontal Timeline Bar */}
            <div className="absolute top-[325px] left-0 right-[-40px] h-[14px] bg-node-gold border-b-[4px] border-node-ring shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-10">
              {/* Glowing Runner Dot */}
              <div
                className="absolute -top-2 w-6 h-6 bg-white rounded-full shadow-[0_0_12px_#FFF] animate-ping"
                style={{
                  left: `${Math.min(95, Math.max(5, (activeNode || 1) * 24))}%`,
                }}
              />
            </div>

            {/* Stages Grid (4 stages alternating) */}
            <div className="relative w-full h-full">
              {timeline.map((stage, idx) => {
                const isAbove = idx % 2 === 0;
                const status = getTimelineStatus(stage.startISO, stage.endISO);
                const leftPos = desktopLeftPositions[idx] || `${idx * 25}%`;
                const isCurrentNode = activeNode === stage.n;

                return (
                  <div
                    key={stage.n}
                    className="absolute top-0 bottom-0 w-[210px] xl:w-[230px]"
                    style={{ left: leftPos }}
                  >
                    {/* Node anchored directly on the line */}
                    <div
                      className="absolute top-[305px] left-1/2 -translate-x-1/2 z-20 cursor-pointer"
                      onClick={() => handleNodeClick(stage.n)}
                    >
                      <Node n={stage.n} isLive={status === 'live'} />
                      <StarBurst
                        active={starBurstActive === stage.n}
                        onComplete={() => setStarBurstActive(null)}
                      />
                    </div>

                    {/* Stage Card: Above or Below with hinge drop */}
                    <div
                      className={`absolute w-full z-10 transition-transform duration-300 ${
                        isAbove
                          ? 'top-[20px] origin-top hover:-translate-y-2'
                          : 'top-[385px] origin-bottom hover:translate-y-2'
                      }`}
                    >
                      <Tilt3D maxTilt={6}>
                        <div className="bg-[#FAF2E6] border-[3.5px] border-black rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.5)] overflow-hidden">
                          {/* Card Top Plate */}
                          <div className="bg-black text-white px-3.5 py-2 flex items-center justify-between">
                            <span className="font-display text-sm tracking-wider uppercase">
                              STAGE 0{stage.n}
                            </span>
                            <InfoDot onClick={() => handleOpenStage(stage)} />
                          </div>

                          {/* Card Graphic Plaque */}
                          <div className="p-3">
                            <div className="w-full h-16 bg-gradient-to-b from-[#7B3FE4] to-[#4F1AB5] rounded-xl border-2 border-black/40 flex items-center justify-center relative overflow-hidden shadow-inner">
                              <Image
                                src="/art/badge.png"
                                alt=""
                                width={48}
                                height={42}
                                className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                              />
                            </div>
                          </div>

                          {/* Card Details */}
                          <div className="px-3.5 pb-4 space-y-2">
                            <h3 className="font-body font-black text-black text-base leading-tight">
                              {stage.title}
                            </h3>
                            <div className="inline-block px-2 py-0.5 bg-[#2373FF] text-white font-display text-xs rounded border border-black shadow-[0_1px_0_#000]">
                              {formatDate(stage.startISO)}
                            </div>
                            <p className="font-body text-xs text-black/75 line-clamp-2 leading-relaxed">
                              {stage.summary}
                            </p>
                          </div>
                        </div>
                      </Tilt3D>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE VIEW: Vertical Timeline (< 1024px) */}
          <div className="block lg:hidden relative w-full py-4 pl-14 sm:pl-16">
            {/* Vertical Golden Bar */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-7 w-[10px] bg-node-gold border-r-[3px] border-node-ring shadow-[0_2px_6px_rgba(0,0,0,0.4)]" />

            <div className="space-y-6 sm:space-y-8">
              {timeline.map((stage) => {
                const status = getTimelineStatus(stage.startISO, stage.endISO);

                return (
                  <div key={stage.n} className="relative">
                    {/* Node positioned over vertical bar */}
                    <div
                      className="absolute -left-[54px] sm:-left-[58px] top-6 z-20 cursor-pointer"
                      onClick={() => handleNodeClick(stage.n)}
                    >
                      <Node n={stage.n} isLive={status === 'live'} />
                    </div>

                    {/* Stage Card */}
                    <div className="bg-[#FAF2E6] border-[3.5px] border-black rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)] overflow-hidden max-w-[360px]">
                      <div className="bg-black text-white px-3.5 py-2 flex items-center justify-between">
                        <span className="font-display text-sm tracking-wider uppercase">
                          STAGE 0{stage.n}
                        </span>
                        <InfoDot onClick={() => handleOpenStage(stage)} />
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-body font-black text-black text-base leading-snug">
                          {stage.title}
                        </h3>
                        <div className="inline-block px-2 py-0.5 bg-[#2373FF] text-white font-display text-xs rounded border border-black">
                          {formatDate(stage.startISO)}
                        </div>
                        <p className="font-body text-xs text-black/75 leading-relaxed">
                          {stage.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Detail Pop-in Modal */}
      {selectedStage && (
        <Modal
          isOpen={!!selectedStage}
          onClose={handleCloseModal}
          title={`STAGE 0${selectedStage.n}: ${selectedStage.title.toUpperCase()}`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1 bg-node-gold text-black font-display text-xs rounded border border-black">
                {formatDate(selectedStage.startISO)}
              </span>
              <span className="px-3 py-1 bg-slate text-white font-display text-xs rounded border border-black">
                VENUE: {selectedStage.venue}
              </span>
            </div>
            <p className="font-body text-white/90 text-sm leading-relaxed">
              {selectedStage.details || selectedStage.summary}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
