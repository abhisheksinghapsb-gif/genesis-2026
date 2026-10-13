'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Moon } from './Moon';
import { Planet } from './Planet';
import { Stars } from './Stars';

export interface SceneProps {
  shouldAnimate: boolean;
  scrollProgress?: number;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  isLowPower?: boolean;
  onReady?: () => void;
  onDowngrade?: (reason: string) => void;
}

// Internal Camera Rig reacting to pointer & scroll dolly
function CameraRig({
  pointerRef,
  scrollProgress = 0,
}: {
  pointerRef: React.RefObject<{ x: number; y: number }>;
  scrollProgress: number;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const px = pointerRef.current?.x ?? 0;
    const py = pointerRef.current?.y ?? 0;

    // Camera parallax bounds: x +-0.4, y +-0.25
    const targetX = px * 0.4;
    const targetY = py * 0.25;
    const targetZ = 4.8 - scrollProgress * 1.5;

    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.lookAt(0, -0.4, 0);
  });

  return null;
}

// Runtime FPS Watchdog: monitors frame rate after 1s warm-up; downgrades if < 30fps over 2s
function FpsWatchdog({
  onDowngrade,
}: {
  onDowngrade?: (reason: string) => void;
}) {
  const frames = useRef(0);
  const startTime = useRef(performance.now());
  const warmedUp = useRef(false);

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    const elapsed = now - startTime.current;

    // 1.0s warm-up period
    if (!warmedUp.current) {
      if (elapsed >= 1000) {
        warmedUp.current = true;
        frames.current = 0;
        startTime.current = now;
      }
      return;
    }

    // 2.0s measurement window
    if (elapsed >= 2000) {
      const avgFps = (frames.current / elapsed) * 1000;
      if (avgFps < 30 && onDowngrade) {
        onDowngrade(`Low FPS watchdog triggered: ${avgFps.toFixed(1)} fps`);
      }
      frames.current = 0;
      startTime.current = now;
    }
  });

  return null;
}

// Initial frame signal for 400ms crossfade
function FrameSignal({ onReady }: { onReady?: () => void }) {
  const signaled = useRef(false);
  useFrame(() => {
    if (!signaled.current && onReady) {
      signaled.current = true;
      onReady();
    }
  });
  return null;
}

export const Scene: React.FC<SceneProps> = ({
  shouldAnimate,
  scrollProgress = 0,
  pointerRef,
  isLowPower = false,
  onReady,
  onDowngrade,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      rendererRef.current = gl;

      // Handle WebGL context lost event
      const canvasEl = gl.domElement;
      const onContextLost = (e: Event) => {
        e.preventDefault();
        if (onDowngrade) {
          onDowngrade('webglcontextlost event received');
        }
      };

      canvasEl.addEventListener('webglcontextlost', onContextLost);
      return () => {
        canvasEl.removeEventListener('webglcontextlost', onContextLost);
      };
    },
    [onDowngrade],
  );

  // Complete cleanup on unmount: dispose renderer cache & resources
  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={shouldAnimate ? 'always' : 'never'}
      camera={{ position: [0, 0, 4.8], fov: 45 }}
      gl={{
        antialias: !isLowPower,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={handleCreated}
      className="pointer-events-auto h-full w-full select-none"
    >
      {/* Lighting */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} />
      <directionalLight position={[-4, -3, 2]} intensity={0.4} color="#38D4FF" />

      {/* 3D Celestial Objects */}
      <Stars isLowPower={isLowPower} />
      <Planet isMobile={isMobile} />
      <Moon scrollProgress={scrollProgress} isMobile={isMobile} />

      {/* Controller & Watchdogs */}
      <CameraRig pointerRef={pointerRef} scrollProgress={scrollProgress} />
      <FpsWatchdog onDowngrade={onDowngrade} />
      <FrameSignal onReady={onReady} />
    </Canvas>
  );
};

export default Scene;
