'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export interface UseTilt3DOptions {
  maxTilt?: number; // Maximum tilt angle in degrees (default 10)
  perspective?: number; // Perspective distance in px (default 1000)
  scale?: number; // Scale factor on hover (default 1.04)
  speed?: number; // Lerp smoothing factor 0..1 (default 0.15)
  glare?: boolean; // Whether to compute glare highlight (default true)
}

export interface UseTilt3DReturn<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null>;
  transformStyle: React.CSSProperties;
  glareStyle: React.CSSProperties;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
}

export function useTilt3D<T extends HTMLElement = HTMLDivElement>(
  options: UseTilt3DOptions = {},
): UseTilt3DReturn<T> {
  const {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.04,
    speed = 0.15,
    glare = true,
  } = options;

  const cardRef = useRef<T | null>(null);

  // Target and current values for spring damping
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: 'transform 0.2s ease-out',
  });

  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
  });

  const isEnabled = useRef(true);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
    const isTouch =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)')?.matches;
    isEnabled.current = !reducedMotion && !isTouch;
  }, []);

  const updateAnimation = useCallback(() => {
    if (!isEnabled.current) return;

    // Linear interpolation (lerp) toward target
    currentX.current += (targetX.current - currentX.current) * speed;
    currentY.current += (targetY.current - currentY.current) * speed;
    currentScale.current += (targetScale.current - currentScale.current) * speed;

    const rotX = -currentY.current * maxTilt;
    const rotY = currentX.current * maxTilt;

    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${currentScale.current.toFixed(3)}, ${currentScale.current.toFixed(3)}, 1)`,
      transformStyle: 'preserve-3d',
    });

    const isMoving =
      Math.abs(targetX.current - currentX.current) > 0.001 ||
      Math.abs(targetY.current - currentY.current) > 0.001 ||
      Math.abs(targetScale.current - currentScale.current) > 0.001;

    if (isMoving) {
      animFrameId.current = requestAnimationFrame(updateAnimation);
    } else {
      animFrameId.current = null;
    }
  }, [maxTilt, perspective, speed]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!isEnabled.current) return;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1

      // Normalize to -1..1
      targetX.current = Math.max(-1, Math.min(1, (x - 0.5) * 2));
      targetY.current = Math.max(-1, Math.min(1, (y - 0.5) * 2));
      targetScale.current = scale;

      if (glare) {
        setGlareStyle({
          opacity: 0.25,
          left: `${(x * 100).toFixed(1)}%`,
          top: `${(y * 100).toFixed(1)}%`,
        });
      }

      if (!animFrameId.current) {
        animFrameId.current = requestAnimationFrame(updateAnimation);
      }
    },
    [scale, glare, updateAnimation],
  );

  const onPointerLeave = useCallback(() => {
    if (!isEnabled.current) return;
    targetX.current = 0;
    targetY.current = 0;
    targetScale.current = 1;

    if (glare) {
      setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
    }

    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(updateAnimation);
    }
  }, [glare, updateAnimation]);

  const onPointerDown = useCallback(() => {
    if (!isEnabled.current) return;
    targetScale.current = scale * 0.96;
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(updateAnimation);
    }
  }, [scale, updateAnimation]);

  const onPointerUp = useCallback(() => {
    if (!isEnabled.current) return;
    targetScale.current = scale;
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(updateAnimation);
    }
  }, [scale, updateAnimation]);

  useEffect(() => {
    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return {
    ref: cardRef,
    transformStyle,
    glareStyle,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onPointerUp,
  };
}
