import React from 'react';

interface NodeProps {
  number?: number | string;
  n?: number;
  isActive?: boolean;
  isLive?: boolean;
  className?: string;
}

export const Node: React.FC<NodeProps> = ({
  number,
  n,
  isActive = false,
  isLive = false,
  className = '',
}) => {
  const val = n !== undefined ? n : number ?? 1;
  const formattedNumber =
    typeof val === 'number' ? String(val).padStart(2, '0') : val;

  const active = isActive || isLive;

  return (
    <div
      className={`w-[54px] h-[54px] rounded-full bg-node-gold border-[4px] border-node-ring shadow-[0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center select-none ${
        active ? 'ring-4 ring-white animate-pulse' : ''
      } ${className}`}
    >
      <span className="font-display text-white text-[26px] font-bold tracking-tight text-outline-sm leading-none">
        {formattedNumber}
      </span>
    </div>
  );
};
