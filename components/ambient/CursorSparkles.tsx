'use client';

import React, { useEffect, useRef } from 'react';

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  decay: number;
}

const COLORS = ['#FFE066', '#FFB703', '#38D4FF', '#FFFFFF', '#FFA834'];

export const CursorSparkles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<SparkleParticle[]>([]);
  const animId = useRef<number | null>(null);
  const lastSpawn = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Guard: Only for desktop pointer devices with fine control and reduced motion OFF
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || isReducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Sizing
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Draw 4-point Brawl Star
    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      rot: number,
    ) => {
      c.save();
      c.translate(cx, cy);
      c.rotate(rot);
      c.beginPath();
      // 4-point star path
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = Math.cos(angle) * size;
        const outerY = Math.sin(angle) * size;
        const innerX = Math.cos(angle + Math.PI / 4) * (size * 0.35);
        const innerY = Math.sin(angle + Math.PI / 4) * (size * 0.35);
        if (i === 0) c.moveTo(outerX, outerY);
        else c.lineTo(outerX, outerY);
        c.lineTo(innerX, innerY);
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    // Render loop
    const tick = () => {
      if (document.hidden) {
        animId.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        if (!p) continue;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        drawStar(ctx, p.x, p.y, p.size, p.rotation);
      }

      ctx.globalAlpha = 1;

      // Keep running only while particles remain alive
      if (particles.current.length > 0) {
        animId.current = requestAnimationFrame(tick);
      } else {
        animId.current = null;
      }
    };

    // Pointer move listener
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      // Throttle spawn rate to ~35ms to pool max 24 particles
      if (now - lastSpawn.current < 35 || particles.current.length >= 24) {
        return;
      }
      lastSpawn.current = now;

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;

      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4, // Slight upward drift
        size: 4 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#FFDE00',
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        alpha: 0.9,
        decay: 0.035, // ~600ms fade at 60fps
      });

      if (!animId.current) {
        animId.current = requestAnimationFrame(tick);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden && animId.current) {
        cancelAnimationFrame(animId.current);
        animId.current = null;
      } else if (!document.hidden && particles.current.length > 0 && !animId.current) {
        animId.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animId.current) {
        cancelAnimationFrame(animId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full select-none"
      aria-hidden="true"
    />
  );
};
