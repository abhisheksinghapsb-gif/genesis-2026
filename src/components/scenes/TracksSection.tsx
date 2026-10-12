'use client';

import React from 'react';
import { Tilt3D } from '../motion/Tilt3D';
import { NpcDialogBubble } from '../ui/NpcDialogBubble';

interface TrackItem {
  id: string;
  arena: string;
  title: string;
  badge: string;
  colorFrom: string;
  colorTo: string;
  borderColor: string;
  accent: string;
  description: string;
  tags: string[];
}

const TRACKS: TrackItem[] = [
  {
    id: 'ar-vr',
    arena: 'ARENA 01 • GDXR FLAGSHIP',
    title: 'AR/VR & SPATIAL COMPUTING',
    badge: '🥽',
    colorFrom: '#150A33',
    colorTo: '#2E126E',
    borderColor: '#9D4EDD',
    accent: '#E0AAFF',
    description:
      'Pioneer next-generation spatial computing experiences for Meta Quest, Apple Vision Pro, WebXR, and 3D spatial interfaces.',
    tags: ['WebXR', 'Unity', 'Unreal 5', 'Three.js', 'VisionOS'],
  },
  {
    id: 'ai-agents',
    arena: 'ARENA 02 • INTELLIGENCE',
    title: 'AI & AUTONOMOUS AGENTS',
    badge: '⚡',
    colorFrom: '#0A2533',
    colorTo: '#0F4D63',
    borderColor: '#00B4D8',
    accent: '#90E0EF',
    description:
      'Harness multimodal generative models, real-time agentic workflows, computer vision, and autonomous agent coordination.',
    tags: ['Gemini', 'LangChain', 'FastAPI', 'PyTorch', 'Agents'],
  },
  {
    id: 'web3',
    arena: 'ARENA 03 • PROTOCOLS',
    title: 'WEB3 & CYBER DEFENSE',
    badge: '🛡️',
    colorFrom: '#2E1906',
    colorTo: '#5C3408',
    borderColor: '#F39C12',
    accent: '#F9E79F',
    description:
      'Build resilient decentralized applications, cryptographic consensus tools, zero-knowledge proofs, and secure digital assets.',
    tags: ['Solidity', 'Rust', 'ZK-Proofs', 'EVM', 'IPFS'],
  },
  {
    id: 'open-gaming',
    arena: 'ARENA 04 • UNRESTRICTED',
    title: 'OPEN INNOVATION & GAMING',
    badge: '🎮',
    colorFrom: '#2A0824',
    colorTo: '#590D4D',
    borderColor: '#FF007F',
    accent: '#FFB3D9',
    description:
      'Build boundary-pushing indie game mechanics, creative developer utilities, or high-impact social solutions that defy categories.',
    tags: ['Godot', 'Next.js', 'Mobile', 'Creative Tech', 'Multiplayer'],
  },
];

export const TracksSection: React.FC = () => {
  return (
    <div className="relative w-full py-16 md:py-24 px-4 sm:px-6 md:px-12 select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header Banner */}
        <div className="relative mb-12 flex flex-col items-center text-center">
          <div className="px-6 py-1.5 rounded-full bg-[#FFE79A]/10 border border-[#FFE79A]/30 text-[#FFD747] font-mono text-xs md:text-sm font-bold tracking-widest uppercase mb-3">
            CHOOSE YOUR SPECIALIZATION
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-wider uppercase drop-shadow-[0_4px_0_#000]">
            HACKATHON ARENAS
          </h2>
          <div className="w-24 h-1.5 bg-[#FFD747] rounded-full mt-3 shadow-[0_0_12px_#FFD747]" />
        </div>

        {/* 4 Supercell-Style Store Arena Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 w-full">
          {TRACKS.map((track) => (
            <Tilt3D key={track.id} className="w-full h-full">
              <div
                className="relative h-full rounded-3xl p-6 md:p-8 border-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${track.colorFrom} 0%, ${track.colorTo} 100%)`,
                  borderColor: track.borderColor,
                }}
              >
                {/* Store Bonus Ribbon Flag */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] md:text-xs font-mono font-black uppercase tracking-wider shadow"
                  style={{
                    backgroundColor: track.accent,
                    color: '#000',
                  }}
                >
                  SPECIAL PRIZES
                </div>

                <div>
                  {/* Arena Badge & Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl md:text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {track.badge}
                    </span>
                    <span
                      className="font-mono text-xs md:text-sm font-bold tracking-widest uppercase"
                      style={{ color: track.accent }}
                    >
                      {track.arena}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-wide uppercase leading-tight mb-3 drop-shadow-[0_2px_0_#000]">
                    {track.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-sm md:text-base text-white/80 leading-relaxed mb-6">
                    {track.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {track.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/20 text-xs font-mono font-medium text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>

        {/* NPC Dialogue Quote */}
        <div className="mt-12 self-end">
          <NpcDialogBubble
            avatar="robot"
            characterName="BOT ARCHIVIST"
            dialogue="PICK YOUR ARENA: VR, AI, WEB3, OR OPEN COMBAT!"
            position="right"
          />
        </div>
      </div>
    </div>
  );
};
