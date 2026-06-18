'use client';

import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { type Group, MeshStandardMaterial } from 'three';

import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AbstractAvatarProps {
  color: string;
  isLocal: boolean;
  isSpeaking: boolean;
  position: [number, number, number];
  raisedHand: boolean;
  styleIndex: number;
}

export default function AbstractAvatar({
  color,
  isLocal,
  isSpeaking,
  position,
  raisedHand,
  styleIndex,
}: AbstractAvatarProps) {
  const groupRef = useRef<Group>(null);
  const headMatRef = useRef<MeshStandardMaterial>(null);
  const bodyMatRef = useRef<MeshStandardMaterial>(null);
  const mouthMatRef = useRef<MeshStandardMaterial>(null);
  const reduced = useReducedMotion();
  // Head sphere center — keep in sync with mesh position={[0, HEAD_Y, 0]}
  const HEAD_Y = 0.88;
  const HEAD_R = isLocal ? 0.42 : 0.37; // head radius

  // Unique phase offset per avatar so they don't all bob in sync
  const phaseOffset = (styleIndex * 1.37) % (Math.PI * 2);
  const headSize = isLocal ? 0.42 : 0.37;

  useFrame((state) => {
    if (!groupRef.current) return;

    // Slow vertical float - disabled in reduced motion
    if (reduced) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    } else {
      groupRef.current.position.set(
        position[0],
        position[1] + Math.sin(state.clock.elapsedTime * 0.75 + phaseOffset) * 0.14,
        position[2],
      );
    }

    const targetHead = isSpeaking
      ? 0.55 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 7.5) * 0.3)
      : isLocal ? 0.14 : 0.07;
    const targetBody = isSpeaking
      ? 0.45 + (reduced ? 0 : Math.sin(state.clock.elapsedTime * 7.5) * 0.22)
      : isLocal ? 0.11 : 0.05;

    if (headMatRef.current) {
      headMatRef.current.emissiveIntensity +=
        (targetHead - headMatRef.current.emissiveIntensity) * 0.12;
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.emissiveIntensity +=
        (targetBody - bodyMatRef.current.emissiveIntensity) * 0.12;
    }

    // Mouth opens with speaking — lerp scaleY between 0.1 (closed) and 1.0 (open)
    if (mouthMatRef.current) {
      const targetMouth = isSpeaking ? 1.0 : 0.1;
      mouthMatRef.current.opacity += (targetMouth - mouthMatRef.current.opacity) * 0.15;
    }
  });

  const sharedMat = {
    color,
    emissive: color,
    metalness: 0.05,
    roughness: 0.88,
    transparent: true,
    opacity: 0.9,
  } as const;

  return (
    <group ref={groupRef} position={position}>
      {/* Raised-hand badge */}
      {raisedHand ? (
        <Html center position={[0, 2.1, 0]}>
          <div className="rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-100 shadow-xl backdrop-blur-xl">
            ✋ Hand raised
          </div>
        </Html>
      ) : null}

      {/* Local indicator */}
      {isLocal ? (
        <Html center position={[0, -1.65, 0]}>
          <div className="rounded-full border border-white/15 bg-surface/5 px-3 py-1 text-[11px] font-bold text-white/60 backdrop-blur-sm">
            You
          </div>
        </Html>
      ) : null}

      {/* Head sphere */}
      <mesh position={[0, HEAD_Y, 0]}>
        <sphereGeometry args={[HEAD_R, 18, 14]} />
        <meshStandardMaterial {...sharedMat} emissiveIntensity={isLocal ? 0.14 : 0.07} ref={headMatRef} />
      </mesh>

      {/* Body — ellipsoid (sphere scaled) */}
      <mesh position={[0, -0.08, 0]} scale={[0.58, 0.72, 0.5]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial {...sharedMat} emissiveIntensity={isLocal ? 0.11 : 0.05} ref={bodyMatRef} />
      </mesh>

      {/* Mouth — dark ellipsoid on the face, scales open when speaking */}
      {/* Positioned at lower-front of head sphere; scaleY animates 0.1 (closed) → 1 (open) */}
      <mesh
        position={[0, HEAD_Y - HEAD_R * 0.55, HEAD_R * 0.80]}
        scale={[1.4, 0.1, 0.6]}
        visible={isLocal}
      >
        <sphereGeometry args={[0.09, 8, 6]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.1}
          ref={mouthMatRef}
        />
      </mesh>

      {/* Speaking pulse ring */}
      {isSpeaking ? (
        <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.68, 0.76, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} />
        </mesh>
      ) : null}
    </group>
  );
}
