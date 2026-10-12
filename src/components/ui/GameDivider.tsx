'use client';

import React from 'react';

interface GameDividerProps {
  className?: string;
}

export const GameDivider: React.FC<GameDividerProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center w-full my-6 md:my-10 z-20 pointer-events-none select-none ${className}`}>
      {/* Central Emblem Coin / Shield */}
      <div className="absolute z-10 -top-5 flex items-center justify-center">
        <div className="relative w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-b from-[#FFE885] via-[#E5A824] to-[#8C5808] p-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.6)] border-2 border-[#543305] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2E1854] to-[#120824] border border-[#FFE885]/40 flex items-center justify-center">
            {/* Winged Skull-Star mini icon */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 text-[#FFD43F] fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <path d="M12 2l2.6 5.8 6.4.6-4.8 4.3 1.4 6.3L12 15.7 6.4 19l1.4-6.3-4.8-4.3 6.4-.6L12 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Golden Metallic Gradient Horizontal Rule */}
      <div
        className="w-full h-2 md:h-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)] border-t border-b border-[#523308]"
        style={{
          background: 'linear-gradient(180deg, #FFD27F 0%, #FFDC9B 17%, #FBEAD1 33%, #E9D3B8 50%, #C7944E 67%, #BE7A00 83%, #C47F00 100%)',
        }}
      />
    </div>
  );
};
