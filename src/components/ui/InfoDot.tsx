import React from 'react';

interface InfoDotProps {
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export const InfoDot: React.FC<InfoDotProps> = ({
  onClick,
  ariaLabel = 'More info',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-[34px] h-[34px] rounded-full bg-info-blue border-[3px] border-white shadow-[0_3px_6px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer select-none hover:scale-110 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-node-gold ${className}`}
    >
      <span className="font-display text-white text-lg font-bold lowercase leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
        i
      </span>
    </button>
  );
};
