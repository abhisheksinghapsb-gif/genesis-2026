'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export interface StarsProps {
  isLowPower?: boolean;
}

export const Stars: React.FC<StarsProps> = ({ isLowPower = false }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const shootingStarRef = useRef<THREE.Mesh>(null);
  const shootingProgress = useRef<number>(-1);
  const nextShootTime = useRef<number>(performance.now() + 3000);

  // Star counts: 600 normally, 300 if low power
  const count = isLowPower ? 300 : 650;

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across background plane and depth
      pos[i * 3] = (Math.random() - 0.5) * 22; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16; // Y
      pos[i * 3 + 2] = -3 - Math.random() * 8; // Z (depth layering)

      // Random sizes (small, medium, bright)
      sz[i] = 12 + Math.random() * 24;
      ph[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, sizes: sz, phases: ph };
  }, [count]);

  // Shader material for GPU-side twinkle without CPU vertex thrashing
  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        attribute float aSize;
        attribute float aPhase;
        varying float vAlpha;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Twinkle sinusoid between 0.35 and 1.0
          float twinkle = 0.55 + 0.45 * sin(uTime * 1.8 + aPhase);
          vAlpha = twinkle;
          gl_PointSize = (aSize * twinkle) * (8.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          // Circular particle with soft glow falloff
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float intensity = smoothstep(0.5, 0.05, dist);
          // Cel-shaded Brawl Stars star tint: cyan-white core
          vec3 starColor = mix(vec3(0.4, 0.85, 1.0), vec3(1.0, 1.0, 1.0), intensity);
          gl_FragColor = vec4(starColor, intensity * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useEffect(() => {
    return () => {
      starMaterial.dispose();
    };
  }, [starMaterial]);

  useFrame((_, delta) => {
    const now = performance.now();

    // Update uniform for GPU twinkle
    if (shaderMatRef.current?.uniforms?.uTime) {
      shaderMatRef.current.uniforms.uTime.value += delta;
    }

    // Shooting star cycle every 6-10s
    if (shootingProgress.current < 0 && now >= nextShootTime.current) {
      shootingProgress.current = 0;
      nextShootTime.current = now + 6000 + Math.random() * 4000; // Next in 6-10s
    }

    if (shootingProgress.current >= 0 && shootingStarRef.current) {
      shootingProgress.current += delta * 1.4; // ~0.7s duration

      const p = shootingProgress.current;
      // Streak from top-left to bottom-right
      const startX = -8;
      const startY = 6;
      const endX = 6;
      const endY = -4;

      shootingStarRef.current.position.x = startX + (endX - startX) * p;
      shootingStarRef.current.position.y = startY + (endY - startY) * p;
      shootingStarRef.current.position.z = -4;

      // Fade in and out
      const alpha = Math.sin(p * Math.PI);
      const mat = shootingStarRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, alpha);
      }

      if (shootingProgress.current >= 1) {
        shootingProgress.current = -1;
      }
    }
  });

  return (
    <group>
      {/* 3D Twinkling Starfield */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[phases, 1]}
          />
        </bufferGeometry>
        <primitive object={starMaterial} ref={shaderMatRef} attach="material" />
      </points>

      {/* Periodic Shooting Star Mesh */}
      <mesh
        ref={shootingStarRef}
        position={[-100, -100, -4]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <planeGeometry args={[1.6, 0.06]} />
        <meshBasicMaterial
          color="#FFE066"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
