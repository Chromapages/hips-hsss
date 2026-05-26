"use client";

import { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type Group, MeshStandardMaterial, Color, Mesh } from "three";

// Task 5.6 — Avatar system: 12 styles × 3 palettes, 5 gestures, ≤2000 polys per avatar
// Each avatar is a simple geometric representation with unique phase offset
// to prevent synchronized bobbing. Max ~2000 polys for head + body combined.

export type AvatarStyle = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type AvatarPalette = "coastal" | "sunrise" | "forest";
export type AvatarGesture = "idle" | "nodding" | "raised-hand" | "thinking" | "applause";

interface AvatarConfig {
  color: string;
  isLocal: boolean;
  isSpeaking: boolean;
  position: [number, number, number];
  raisedHand: boolean;
  styleIndex: number; // 0-11 maps to different bob amplitudes / proportions
  gesture: AvatarGesture;
}

// 12 avatar styles with different proportions and bob amplitudes
const avatarStyles = {
  0: { headScale: 1.0, bodyScale: 1.0, bobAmp: 0.14, phase: 0.0 },
  1: { headScale: 0.95, bodyScale: 1.05, bobAmp: 0.13, phase: 0.3 },
  2: { headScale: 1.05, bodyScale: 0.95, bobAmp: 0.15, phase: 0.6 },
  3: { headScale: 0.9, bodyScale: 1.1, bobAmp: 0.12, phase: 0.9 },
  4: { headScale: 1.02, bodyScale: 0.98, bobAmp: 0.14, phase: 1.2 },
  5: { headScale: 0.97, bodyScale: 1.03, bobAmp: 0.13, phase: 1.5 },
  6: { headScale: 1.03, bodyScale: 0.97, bobAmp: 0.15, phase: 1.8 },
  7: { headScale: 0.88, bodyScale: 1.12, bobAmp: 0.11, phase: 2.1 },
  8: { headScale: 1.06, bodyScale: 0.94, bobAmp: 0.16, phase: 2.4 },
  9: { headScale: 0.93, bodyScale: 1.07, bobAmp: 0.12, phase: 2.7 },
  10: { headScale: 1.01, bodyScale: 0.99, bobAmp: 0.14, phase: 3.0 },
  11: { headScale: 0.96, bodyScale: 1.04, bobAmp: 0.13, phase: 3.3 },
} as const;

// 3 color palettes
export const paletteColors = {
  coastal: "#06b6d4",
  sunrise: "#f59e0b",
  forest: "#10b981",
} as const;

export const avatarGestures: AvatarGesture[] = [
  "idle",
  "nodding",
  "raised-hand",
  "thinking",
  "applause",
];

// Fallback colors for non-local participants
const fallbackColors = [
  "#6366f1",
  "#a78bfa",
  "#f43f5e",
  "#f59e0b",
  "#34d399",
  "#38bdf8",
];

export default function VirtualOfficeAvatar({
  color,
  isLocal,
  isSpeaking,
  position,
  raisedHand,
  styleIndex,
  gesture = "idle",
}: AvatarConfig) {
  const groupRef = useRef<Group>(null);
  const headMatRef = useRef<MeshStandardMaterial>(null);
  const bodyMatRef = useRef<MeshStandardMaterial>(null);
  const raisedArmRef = useRef<Group>(null);
  const applauseLeftRef = useRef<Mesh>(null);
  const applauseRightRef = useRef<Mesh>(null);
  const nodRef = useRef<number>(0);
  const applauseY = useRef<number>(0);

  const style = avatarStyles[(styleIndex % 12) as keyof typeof avatarStyles] || avatarStyles[0];
  const headSize = isLocal ? 0.42 * style.headScale : 0.37 * style.headScale;

  // Unique phase offset per avatar so they don't all bob in sync
  const phaseOffset = style.phase;

  useFrame((state) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;

    // Slow vertical float with unique phase
    groupRef.current.position.set(
      position[0],
      position[1] + Math.sin(elapsed * 0.75 + phaseOffset) * style.bobAmp,
      position[2],
    );

    // Task 5.10 — Active speaker detection: emissive pulse
    const targetHead = isSpeaking
      ? 0.55 + Math.sin(elapsed * 7.5) * 0.3
      : isLocal
        ? 0.14
        : 0.07;
    const targetBody = isSpeaking
      ? 0.45 + Math.sin(elapsed * 7.5) * 0.22
      : isLocal
        ? 0.11
        : 0.05;

    if (headMatRef.current) {
      headMatRef.current.emissiveIntensity +=
        (targetHead - headMatRef.current.emissiveIntensity) * 0.12;
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.emissiveIntensity +=
        (targetBody - bodyMatRef.current.emissiveIntensity) * 0.12;
    }

    // Task 5.6 — Gesture animations
    if (gesture === "nodding" && nodRef.current !== 1) {
      nodRef.current = 1;
      // Nodding head: rotate on X axis
      const nodAngle = Math.sin(elapsed * 3) * 0.3;
      groupRef.current.rotation.x = nodAngle;
    } else if (gesture !== "nodding" && nodRef.current === 1) {
      nodRef.current = 0;
      groupRef.current.rotation.x = 0;
    }

    // Raised arm animation for "raised-hand" gesture
    if (raisedArmRef.current) {
      if (gesture === "raised-hand") {
        raisedArmRef.current.rotation.z = -Math.PI / 2 + Math.sin(elapsed * 2) * 0.1;
      } else {
        raisedArmRef.current.rotation.z = 0;
      }
    }

    // Task 5.6 — Applause animation: rapid small bounces via refs
    if (gesture === "applause") {
      applauseY.current = Math.abs(Math.sin(elapsed * 8)) * 0.2;
      if (applauseLeftRef.current) {
        applauseLeftRef.current.position.y = -0.5 + applauseY.current;
      }
      if (applauseRightRef.current) {
        applauseRightRef.current.position.y = -0.5 + Math.abs(Math.sin(elapsed * 8 + 0.5)) * 0.2;
      }
    }
  });

  const sharedMat = {
    color: new Color(color),
    emissive: new Color(color),
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
          <div className="rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-black text-amber-100 shadow-xl backdrop-blur-xl">
            ✋ Hand raised
          </div>
        </Html>
      ) : null}

      {/* Local indicator */}
      {isLocal ? (
        <Html center position={[0, -1.65, 0]}>
          <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/60 backdrop-blur-sm">
            You
          </div>
        </Html>
      ) : null}

      {/* Head sphere */}
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[headSize, 18, 14]} />
        <meshStandardMaterial
          {...sharedMat}
          emissiveIntensity={isLocal ? 0.14 : 0.07}
          ref={headMatRef}
        />
      </mesh>

      {/* Body — ellipsoid (sphere scaled) */}
      <mesh position={[0, -0.08, 0]} scale={[0.58, 0.72, 0.5]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial
          {...sharedMat}
          emissiveIntensity={isLocal ? 0.11 : 0.05}
          ref={bodyMatRef}
        />
      </mesh>

      {/* Raised arm for gesture */}
      <group ref={raisedArmRef} position={[0.4, 0.2, 0]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <capsuleGeometry args={[0.08, 0.5, 8, 8]} />
          <meshStandardMaterial {...sharedMat} emissiveIntensity={0.1} />
        </mesh>
      </group>

      {/* Task 5.10 — Active speaker pulse ring */}
      {isSpeaking ? (
        <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.68, 0.76, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} />
        </mesh>
      ) : null}

{/* Task 5.6 — Applause animation: rapid small bounces */}
      {gesture === "applause" ? (
        <group position={[0, -0.5, 0]}>
          <mesh ref={applauseLeftRef} position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial {...sharedMat} emissiveIntensity={0.15} />
          </mesh>
          <mesh ref={applauseRightRef} position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial {...sharedMat} emissiveIntensity={0.15} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

// Export style/palette constants for external use
export { avatarStyles, fallbackColors };