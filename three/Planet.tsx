'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface PlanetProps {
  position?: [number, number, number];
  isMobile?: boolean;
}

export const Planet: React.FC<PlanetProps> = ({
  position = [3.2, 1.8, -2],
  isMobile = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [wobbleIntensity, setWobbleIntensity] = useState(0);
  const wobbleTime = useRef(0);

  // Generate radial alpha ring gradient texture on canvas
  const ringTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Concentric ring band gradient
    const grad = ctx.createLinearGradient(0, 0, 128, 0);
    grad.addColorStop(0, 'rgba(16, 38, 96, 0)');
    grad.addColorStop(0.2, 'rgba(56, 120, 220, 0.7)');
    grad.addColorStop(0.5, 'rgba(20, 50, 120, 0.9)');
    grad.addColorStop(0.7, 'rgba(56, 160, 255, 0.8)');
    grad.addColorStop(0.9, 'rgba(16, 38, 96, 0.4)');
    grad.addColorStop(1, 'rgba(16, 38, 96, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      ringTexture?.dispose();
    };
  }, [ringTexture]);

  const triggerWobble = () => {
    setWobbleIntensity(1);
    wobbleTime.current = 0;
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow orbital floating loop (7s period)
    const time = performance.now() * 0.001;
    const floatY = Math.sin(time * 0.8) * 0.12;
    const floatX = Math.cos(time * 0.6) * 0.08;

    // Wobble spring decay
    let wobbleOffset = 0;
    if (wobbleIntensity > 0.01) {
      wobbleTime.current += delta * 12;
      wobbleOffset = Math.sin(wobbleTime.current) * wobbleIntensity * 0.3;
      setWobbleIntensity((prev) => Math.max(0, prev - delta * 1.5));
    }

    groupRef.current.position.y = (isMobile ? 1.4 : position[1]) + floatY;
    groupRef.current.position.x = (isMobile ? 1.8 : position[0]) + floatX;

    // Ring tilt & slow precession
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.05;
      ringRef.current.rotation.x = -0.31 + wobbleOffset; // -18 deg tilt + wobble
    }
  });

  const scale = isMobile ? 0.65 : 1.0;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={triggerWobble}
      onPointerOver={() => triggerWobble()}
    >
      {/* Central Planet Sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.75, 36, 36]} />
        <meshStandardMaterial
          color="#1A3B8B"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Tilted Ring System */}
      <mesh
        ref={ringRef}
        rotation={[-0.31, 0, 0]}
      >
        <ringGeometry args={[0.95, 1.8, 64]} />
        <meshBasicMaterial
          map={ringTexture}
          side={THREE.DoubleSide}
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
};
