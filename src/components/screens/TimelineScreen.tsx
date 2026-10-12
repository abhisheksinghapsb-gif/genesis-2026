'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TopBar } from '../ui/TopBar';
import { Footer } from '../layout/Footer';
import { Node } from '../ui/Node';
import { InfoDot } from '../ui/InfoDot';
import { Modal } from '../ui/Modal';
import { timeline } from '@/content/timeline';
import { formatDate, getTimelineStatus } from '@/lib/format';
import type { TimelineStage } from '@/lib/schema';

export const TimelineScreen: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<TimelineStage | null>(null);

  // Desktop horizontal positions for the 4 nodes & cards matching timeline.png (x = 573, 791, 1036, 1261)
  const desktopLeftPositions = ['5%', '30%', '55%', '80%'];

  return (
    <div className="relative min-h-[100dvh] bg-blue-screen bg-pattern-tile flex flex-col justify-between overflow-x-hidden select-none">
      {/* Top Bar with TIMELINE Banner */}
      <TopBar title="TIMELINE" />

      {/* Main Content Area */}
      <main className="relative flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-6 flex flex-col lg:flex-row items-center justify-between z-10 gap-4">
        {/* Left Column: Collectible Character Card (Colt, x 17-432, y 215-870) */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] flex-shrink-0 flex justify-center items-center z-20">
          <div className="relative transform -rotate-[3deg] hover:rotate-0 hover:scale-102 transition-transform duration-300 drop-shadow-[0_16px_36px_rgba(0,0,0,0.7)] cursor-pointer">
            <Image
              src="/art/timeline-card.webp"
              alt=""
              width={380}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Right Section: Desktop Horizontal Timeline / Mobile Vertical Timeline */}
        <div className="relative flex-1 w-full overflow-visible">
          {/* DESKTOP VIEW: Alternating Horizontal Timeline (≥ 1024px) */}
          <div className="hidden lg:block relative w-full h-[720px]">
            {/* Horizontal Timeline Bar at y ~ 360 */}
            <div className="absolute top-[355px] left-0 right-[-60px] h-[14px] bg-node-gold border-b-[4px] border-node-ring shadow-[0_4px_8px_rgba(0,0,0,0.5)] z-10" />

            {/* Stages Grid (4 stages alternating, nodes strictly on the line) */}
            <div className="relative w-full h-full">
              {timeline.map((stage, idx) => {
                const isAbove = idx % 2 === 0;
                const status = getTimelineStatus(stage.startISO, stage.endISO);
                const leftPos = desktopLeftPositions[idx] || `${idx * 25}%`;

                return (
                  <div
                    key={stage.n}
                    className="absolute top-0 bottom-0 w-[210px] xl:w-[230px]"
                    style={{ left: leftPos }}
                  >
                    {/* Node on the center bar */}
                    <div className="absolute top-[335px] left-1/2 -translate-x-1/2 z-20">
                      <Node number={stage.n} />
                    </div>

                    {/* Stage Card: Placed Above (top ~ 0px) or Below (top ~ 410px) */}
                    <div
                      className={`absolute left-0 right-0 transform -skew-x-[4deg] transition-all duration-200 hover:-translate-y-2 hover:rotate-1 ${
                        isAbove ? 'top-[10px]' : 'top-[420px]'
                      }`}
                    >
                      <article className="relative bg-cream rounded-md overflow-hidden border-2 border-black shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                        {/* Black Top Plate with Stage Label & Info Dot */}
                        <div className="h-[34px] bg-black px-3 flex items-center justify-between">
                          <span className="font-display text-white text-xs tracking-wider text-outline-sm">
                            STAGE {String(stage.n).padStart(2, '0')}
                          </span>
                          <InfoDot
                            onClick={() => setSelectedStage(stage)}
                            ariaLabel={`More info about Stage ${stage.n}: ${stage.title}`}
                          />
                        </div>

                        {/* Card Body in Cream */}
                        <div className="p-3 space-y-2 text-black">
                          {/* Fallback Graphic */}
                          <div className="w-full h-[68px] rounded bg-gradient-to-br from-[#351694] to-[#9146EA] flex items-center justify-center p-2 shadow-inner">
                            <Image
                              src="/art/badge.png"
                              alt=""
                              width={40}
                              height={36}
                              className="w-auto h-[40px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
                            />
                          </div>

                          {/* Stage Title */}
                          <h3 className="font-display text-base text-black leading-tight line-clamp-1">
                            {stage.title.replace('TODO: ', '')}
                          </h3>

                          {/* Date Chip */}
                          <div className="inline-block px-2 py-0.5 rounded bg-panel-header text-white font-display text-[11px] tracking-wide text-outline-sm">
                            {formatDate(stage.startISO)}
                          </div>

                          {/* Summary text */}
                          <p className="font-body text-[11px] text-neutral-800 line-clamp-2 font-bold leading-snug">
                            {stage.summary.replace('TODO: ', '')}
                          </p>

                          {/* Status Tag */}
                          {status && (
                            <div className="pt-0.5">
                              {status === 'live' && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-close-red text-white text-[9px] font-extrabold uppercase animate-pulse">
                                  LIVE NOW
                                </span>
                              )}
                              {status === 'done' && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-slate text-white text-[9px] font-extrabold uppercase">
                                  DONE
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </article>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE VIEW: Vertical Timeline (< 1024px) */}
          <div className="block lg:hidden relative pl-12 pr-2 py-4 space-y-8">
            <div className="absolute top-0 bottom-0 left-[26px] w-[10px] bg-node-gold border-r-[3px] border-node-ring" />

            {timeline.map((stage) => {
              const status = getTimelineStatus(stage.startISO, stage.endISO);

              return (
                <div key={stage.n} className="relative">
                  <div className="absolute -left-[48px] top-4 z-20">
                    <Node number={stage.n} className="scale-90" />
                  </div>

                  <article className="bg-cream rounded-md overflow-hidden border-2 border-black shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
                    <div className="h-[36px] bg-black px-3 flex items-center justify-between">
                      <span className="font-display text-white text-sm tracking-wider text-outline-sm">
                        STAGE {String(stage.n).padStart(2, '0')}
                      </span>
                      <InfoDot
                        onClick={() => setSelectedStage(stage)}
                        ariaLabel={`More info about Stage ${stage.n}: ${stage.title}`}
                      />
                    </div>

                    <div className="p-4 space-y-2 text-black">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl text-black leading-tight">
                          {stage.title.replace('TODO: ', '')}
                        </h3>
                        <div className="px-2.5 py-1 rounded bg-panel-header text-white font-display text-xs tracking-wide text-outline-sm">
                          {formatDate(stage.startISO)}
                        </div>
                      </div>

                      <p className="font-body text-sm text-neutral-800 font-bold leading-relaxed">
                        {stage.summary.replace('TODO: ', '')}
                      </p>

                      {status && (
                        <div className="pt-1">
                          {status === 'live' && (
                            <span className="inline-block px-2.5 py-0.5 rounded bg-close-red text-white text-xs font-bold uppercase animate-pulse">
                              LIVE NOW
                            </span>
                          )}
                          {status === 'done' && (
                            <span className="inline-block px-2.5 py-0.5 rounded bg-slate text-white text-xs font-bold uppercase">
                              DONE
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Stage Detail Modal */}
      {selectedStage && (
        <Modal
          isOpen={!!selectedStage}
          onClose={() => setSelectedStage(null)}
          title={`STAGE ${String(selectedStage.n).padStart(2, '0')}`}
        >
          <div className="space-y-4">
            <h3 className="font-display text-2xl text-white text-outline-sm">
              {selectedStage.title.replace('TODO: ', '')}
            </h3>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded bg-panel-header font-display text-sm text-white text-outline-sm">
                Date: {formatDate(selectedStage.startISO)}
              </span>
              <span className="px-3 py-1 rounded bg-panel-inset font-display text-sm text-white">
                Venue: {selectedStage.venue.replace('TODO: ', '')}
              </span>
            </div>

            <p className="font-body text-base text-white/95 leading-relaxed">
              {selectedStage.details.replace('TODO: ', '')}
            </p>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStage(null)}
                className="btn-3d-yellow px-6 py-2.5 font-display text-lg text-black rounded-sm cursor-pointer"
              >
                <span className="transform skew-x-[8deg]">GOT IT!</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};
