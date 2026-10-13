import React from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'yellow' | 'orange' | 'blue' | 'red' | 'cream' | 'green';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  href,
  target,
  rel,
  fullWidth = false,
  className,
  children,
  icon,
  disabled,
  ...props
}) => {
  const variantStyles = {
    yellow:
      'bg-gradient-to-b from-[#FFF248] via-[#FFD000] to-[#F59E0B] text-[#1E1200] border-[#3D2500] hover:brightness-105',
    orange:
      'bg-gradient-to-b from-[#FFA834] via-[#FF7700] to-[#D95500] text-white border-[#3F1600] hover:brightness-105',
    blue:
      'bg-gradient-to-b from-[#4ED8FF] via-[#00A3FF] to-[#0066CC] text-white border-[#06244F] hover:brightness-105',
    red:
      'bg-gradient-to-b from-[#FF5E7E] via-[#F52F57] to-[#B81335] text-white border-[#3B0712] hover:brightness-105',
    cream:
      'bg-gradient-to-b from-[#FFFFFF] via-[#FFF3D1] to-[#E9CE8A] text-[#291B07] border-[#4A320F] hover:brightness-105',
    green:
      'bg-gradient-to-b from-[#6EE7B7] via-[#10B981] to-[#047857] text-white border-[#064E3B] hover:brightness-105',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 shadow-[0_4px_0_#080A10] active:translate-y-[2px] active:shadow-[0_2px_0_#080A10] border-2 rounded-lg',
    md: 'text-sm md:text-base px-5 py-2.5 shadow-[0_6px_0_#080A10] active:translate-y-[4px] active:shadow-[0_2px_0_#080A10] border-[3px] rounded-xl',
    lg: 'text-base md:text-lg px-7 py-3.5 shadow-[0_7px_0_#080A10] active:translate-y-[5px] active:shadow-[0_2px_0_#080A10] border-[3px] rounded-2xl',
    xl: 'text-lg md:text-xl px-9 py-4.5 shadow-[0_9px_0_#080A10] active:translate-y-[6px] active:shadow-[0_3px_0_#080A10] border-4 rounded-2xl',
  };

  const baseClasses = twMerge(
    clsx(
      'relative inline-flex items-center justify-center font-heading tracking-wide uppercase select-none transition-transform duration-75',
      'overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-yellow-300',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      disabled && 'opacity-60 cursor-not-allowed pointer-events-none filter grayscale-[40%]',
      className,
    ),
  );

  const innerContent = (
    <>
      {/* Top inner glossy highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={baseClasses} role="button">
        {innerContent}
      </Link>
    );
  }

  return (
    <button className={baseClasses} disabled={disabled} {...props}>
      {innerContent}
    </button>
  );
};
