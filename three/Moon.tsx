'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface MoonProps {
  scrollProgress?: number; // 0..1 from hero scroll
  isMobile?: boolean;
}

export const Moon: React.FC<MoonProps> = ({ scrollProgress = 0, isMobile = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const breathPhase = useRef<number>(0);

  // Generate procedural cel-shading gradient map (3-step toon palette)
  const gradientMap = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 3;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 3 distinct color steps sampled from landing page.png
    ctx.fillStyle = '#2B589C'; // Deep shadow tone
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = '#5AA0E0'; // Midtone
    ctx.fillRect(1, 0, 1, 1);
    ctx.fillStyle = '#8AD4FF'; // Highlight pale blue
    ctx.fillRect(2, 0, 1, 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return texture;
  }, []);

  // Generate runtime procedural crater bump map on 256x256 canvas
  const bumpMap = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Draw procedural circular crater depressions
    const craterSeeds = [
      { x: 70, y: 80, r: 24, depth: 40 },
      { x: 160, y: 60, r: 18, depth: 35 },
      { x: 120, y: 150, r: 32, depth: 45 },
      { x: 200, y: 170, r: 20, depth: 30 },
      { x: 50, y: 190, r: 15, depth: 25 },
      { x: 180, y: 110, r: 12, depth: 20 },
    ];

    craterSeeds.forEach((c) => {
      const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grad.addColorStop(0, `rgb(${80 - c.depth}, ${80 - c.depth}, ${80 - c.depth})`);
      grad.addColorStop(0.7, `rgb(${80 - c.depth * 0.4}, ${80 - c.depth * 0.4}, ${80 - c.depth * 0.4})`);
      grad.addColorStop(0.9, `rgb(160, 160, 160)`); // Raised rim
      grad.addColorStop(1, '#808080');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // Cleanup textures on unmount
  useEffect(() => {
    return () => {
      gradientMap?.dispose();
      bumpMap?.dispose();
    };
  }, [gradientMap, bumpMap]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Slow planetary rotation
    meshRef.current.rotation.y += delta * 0.04;

    // Breathing loop (6s period)
    breathPhase.current += delta * 1.05;
    const breath = 1 + Math.sin(breathPhase.current) * 0.025;

    // Scroll zoom: moon expands to transition into About section
    const scrollZoom = 1 + scrollProgress * 3.5;
    const baseScale = (isMobile ? 2.4 : 3.2) * breath * scrollZoom;
    meshRef.current.scale.set(baseScale, baseScale, baseScale);

    // Slight vertical shift during scroll
    meshRef.current.position.y = -1.6 + scrollProgress * 0.8;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, -1.6, -1.5]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 48, 48]} />
      <meshToonMaterial
        color="#70BAF8"
        gradientMap={gradientMap}
        bumpMap={bumpMap}
        bumpScale={0.06}
      />
    </mesh>
  );
};
