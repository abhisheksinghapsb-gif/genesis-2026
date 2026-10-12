'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Modal } from '../ui/Modal';
import { Button3D } from '../ui/Button3D';
import { sound } from '@/lib/audio';

const ROLES = ['CODER', 'DESIGNER', 'GAMER', 'XR DEV', 'CHAMPION'] as const;

interface BrawlerCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const BrawlerCardModal: React.FC<BrawlerCardModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [brawlerName, setBrawlerName] = useState('BRAWLER');
  const [selectedRole, setSelectedRole] = useState<string>('CODER');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    sound.playTap();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw high-resolution card (600x900)
    canvas.width = 600;
    canvas.height = 900;

    // Card background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 900);
    bgGrad.addColorStop(0, '#105DE5');
    bgGrad.addColorStop(1, '#05194D');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 900);

    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 16;
    ctx.strokeRect(8, 8, 584, 884);

    // Inner gold border
    ctx.strokeStyle = '#EFC609';
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, 552, 852);

    // Title banner
    ctx.fillStyle = '#000000';
    ctx.fillRect(40, 50, 520, 90);
    ctx.fillStyle = '#EFC609';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GENESIS 2026', 300, 110);

    // Card frame
    ctx.fillStyle = '#1A1D2B';
    ctx.fillRect(60, 170, 480, 480);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 170, 480, 480);

    // Card graphic: Star icon
    ctx.fillStyle = '#EFC609';
    ctx.beginPath();
    ctx.arc(300, 410, 100, 0, Math.PI * 2);
    ctx.fill();

    // Name Banner
    ctx.fillStyle = '#EFC609';
    ctx.fillRect(50, 680, 500, 80);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText((brawlerName || 'BRAWLER').toUpperCase(), 300, 735);

    // Role Badge
    ctx.fillStyle = '#EE7123';
    ctx.fillRect(150, 780, 300, 60);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(selectedRole, 300, 822);

    // Download PNG
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis-2026-${brawlerName.toLowerCase()}-card.png`;
    a.click();
    onToast('Brawler Card downloaded! 🏆 Share it on socials!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="BRAWLER CARD GENERATOR">
      <div className="space-y-6">
        <p className="text-sm text-white/90 font-body">
          Craft your official custom GENESIS 2026 participant collectible card!
        </p>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-display text-cta-yellow tracking-wider mb-1">
              BRAWLER NAME / GAMERTAG
            </label>
            <input
              type="text"
              maxLength={16}
              value={brawlerName}
              onChange={(e) => setBrawlerName(e.target.value.toUpperCase())}
              className="w-full py-2.5 px-3 bg-black/50 border-2 border-black rounded-lg text-white font-display text-base tracking-wider focus:outline-none focus:ring-2 focus:ring-cta-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-display text-cta-yellow tracking-wider mb-1">
              SELECT YOUR CLASS / ROLE
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    sound.playTap();
                    setSelectedRole(role);
                  }}
                  className={`px-3 py-1.5 rounded-lg border-2 border-black font-display text-xs tracking-wider transition-all ${
                    selectedRole === role
                      ? 'bg-cta-yellow text-black -skew-x-6'
                      : 'bg-slate text-white hover:bg-slate/80'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="flex justify-center py-2">
          <div className="w-[220px] aspect-[2/3] bg-gradient-to-b from-[#105DE5] to-[#05194D] border-4 border-black rounded-2xl p-3 flex flex-col justify-between items-center shadow-xl text-center relative overflow-hidden">
            <div className="w-full py-1 bg-black text-cta-yellow font-display text-xs tracking-wider rounded">
              GENESIS 2026
            </div>

            <div className="w-20 h-20 bg-black/40 rounded-full border-2 border-cta-yellow flex items-center justify-center my-auto">
              <Image src="/art/badge.png" alt="" width={54} height={48} />
            </div>

            <div className="w-full space-y-1">
              <div className="w-full py-1 bg-cta-yellow text-black font-display text-sm tracking-wider rounded truncate px-2 font-bold">
                {brawlerName || 'BRAWLER'}
              </div>
              <div className="w-full py-0.5 bg-banner-orange text-white font-display text-[10px] tracking-wider rounded">
                {selectedRole}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for High-Res Generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Action Button */}
        <Button3D
          variant="yellow"
          className="w-full py-3 text-base"
          onClick={handleDownload}
        >
          DOWNLOAD PNG CARD 📥
        </Button3D>
      </div>
    </Modal>
  );
};
