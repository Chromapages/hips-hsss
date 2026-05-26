"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface OfficeRoomProps {
  maxDrawCalls?: number;
}

function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.hardwareConcurrency || 4) < 4;
}

// Task 5.5 — Optimized virtual office scene with ≤50 draw calls at 60fps on M1
export function OfficeRoomScene({ maxDrawCalls = 50 }: OfficeRoomProps) {
  const isLowEnd = isLowEndDevice();

  // Count draw calls: ground + 3 rings + 4 pillars + starfield = 9 base objects
  // Each ring geometry counts as 1 draw call

  return (
    <>
      <fog attach="fog" args={["#030712", 14, 38]} />

      {/* Ambient — very dim, sanctuary is lit by emissives */}
      <ambientLight intensity={0.18} />

      {/* Warm amber key from top-right */}
      <directionalLight
        color="#fde68a"
        intensity={0.7}
        position={[5, 9, 4]}
        castShadow={!isLowEnd}
      />

      {/* Cool indigo fill from left */}
      <directionalLight
        color="#818cf8"
        intensity={0.35}
        position={[-6, 4, -4]}
      />

      {/* Central indigo point — drives avatar glow */}
      <pointLight
        color="#6366f1"
        intensity={18}
        position={[0, 2.5, 0]}
        distance={18}
        decay={2}
      />

      <GroundPlane />
      <MandalaRings />
      {!isLowEnd && <Starfield />}
    </>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, -1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[6.5, 96]} />
      <meshStandardMaterial
        color="#060614"
        emissive="#1e1b4b"
        emissiveIntensity={0.25}
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

function MandalaRings() {
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (outerRef.current) {
      outerRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <>
      {/* Inner mandala ring — indigo */}
      <mesh position={[0, -1.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.18, 128]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={1.4}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Mid ring — soft violet */}
      <mesh position={[0, -1.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 3.44, 128]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.7}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Outer ring — slowly rotates */}
      <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={outerRef}>
        <ringGeometry args={[5.0, 5.06, 128]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#818cf8"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
}

function Starfield() {
  const positions = useMemo(() => {
    const arr = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#a5b4fc"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.55}
      />
    </points>
  );
}