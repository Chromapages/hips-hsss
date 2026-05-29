"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useParticipants } from "@livekit/components-react";
import { ACESFilmicToneMapping } from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Monitor } from "lucide-react";
import type { AvatarProfile } from "@hips/types";
import VirtualOfficeAvatar, {
  paletteColors,
  fallbackColors,
  type AvatarGesture,
} from "../session-ui/avatars/VirtualOfficeAvatar";
import { OfficeRoomScene } from "../session-ui/office/OfficeRoomScene";
import { useState, useCallback, useEffect, type ReactNode } from "react";

// Task 5.13 — Audio-only fallback when WebGL is unavailable
function AudioOnlyFallback({ roomName }: { avatar: AvatarProfile; roomName: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.16),transparent_45%),black] p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10">
        <Monitor className="h-8 w-8 text-indigo-300" />
      </div>
      <h2 className="text-xl font-bold text-white">3D Avatars Unavailable</h2>
      <p className="mt-2 max-w-xs text-sm text-zinc-400">
        Your browser does not support WebGL. Audio is still working and you can participate in
        the session.
      </p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Session Active</p>
        <p className="mt-1 font-mono text-sm text-indigo-300">anon-{roomName.slice(0, 8)}</p>
      </div>
    </div>
  );
}

// Task 5.13 — WebGL detection
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// Context loss handler — lives inside Canvas so it has access to the R3F state
function WebGLContextHandler({
  onContextLost,
}: {
  onContextLost: () => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };

    const handleContextRestored = () => {
      // R3F's Canvas re-creates the renderer on context restore automatically
      // We just need to trigger a re-render to re-initialize the scene
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, { passive: false });
    canvas.addEventListener("webglcontextrestored", handleContextRestored, { passive: false });

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, onContextLost]);

  return null;
}

// GuardedEffectComposer — wraps EffectComposer with null context check
function GuardedEffectComposer({ children }: { children: ReactNode }) {
  const { gl } = useThree();

  if (!gl || !gl.context) {
    return null;
  }

  return <EffectComposer>{children}</EffectComposer>;
}

interface AvatarCanvasProps {
  avatar: AvatarProfile;
  localIdentity: string;
  raisedHands: Set<string>;
  activeSpeakerIdentity?: string | null;
}

// Task 5.5 — Three.js virtual office room scene (max 50 draw calls, 60fps on M1)
// Task 5.10 — Active speaker detection + avatar ring animation
export default function AvatarCanvas({
  avatar,
  localIdentity,
  raisedHands,
  activeSpeakerIdentity,
}: AvatarCanvasProps) {
  const participants = useParticipants();

  const webglAvailable = isWebGLAvailable();

  // Track WebGL context loss — when true, show fallback UI instead of crashing
  const [contextLost, setContextLost] = useState(false);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  if (!webglAvailable || contextLost) {
    return <AudioOnlyFallback avatar={avatar} roomName={localIdentity} />;
  }

  const radius = participants.length > 1 ? Math.min(4.2, 2.4 + participants.length * 0.2) : 0;
  const angleStep = participants.length > 0 ? (Math.PI * 2) / participants.length : 0;

  return (
    <Canvas
      camera={{ position: [0, 3.5, 8], fov: 46 }}
      gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        antialias: true,
      }}
      onCreated={({ gl: renderer }) => {
        // Ensure renderer is valid before any post-processing
        if (!renderer.context) {
          setContextLost(true);
        }
      }}
    >
      {/* WebGL context loss listener */}
      <WebGLContextHandler onContextLost={handleContextLost} />

      {/* Scene fog for depth */}
      <fog attach="fog" args={["#030712", 14, 38]} />

      {/* Ambient — very dim, sanctuary is lit by emissives */}
      <ambientLight intensity={0.18} />

      {/* Warm amber key from top-right */}
      <directionalLight color="#fde68a" intensity={0.7} position={[5, 9, 4]} />

      {/* Cool indigo fill from left */}
      <directionalLight color="#818cf8" intensity={0.35} position={[-6, 4, -4]} />

      {/* Central indigo point — drives avatar glow */}
      <pointLight color="#6366f1" intensity={18} position={[0, 2.5, 0]} distance={18} decay={2} />

      <OfficeRoomScene />

      {participants.map((participant, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const isLocal = participant.identity === localIdentity;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const color = isLocal
          ? paletteColors[avatar.palette]
          : fallbackColors[index % fallbackColors.length] ?? "#6366f1";

        const isSpeaking = participant.isSpeaking || participant.identity === activeSpeakerIdentity;

        return (
          <VirtualOfficeAvatar
            color={color}
            isLocal={isLocal}
            isSpeaking={isSpeaking}
            key={participant.identity}
            position={[x, 0, z]}
            raisedHand={raisedHands.has(participant.identity)}
            styleIndex={isLocal ? avatar.style : index + 1}
            gesture={isLocal ? ("idle" as AvatarGesture) : ("idle" as AvatarGesture)}
          />
        );
      })}

      <GuardedEffectComposer>
        <Bloom
          luminanceThreshold={0.05}
          luminanceSmoothing={0.85}
          intensity={0.35}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.38} darkness={0.55} />
      </GuardedEffectComposer>
    </Canvas>
  );
}