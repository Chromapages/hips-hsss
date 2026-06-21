"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useParticipants } from "@livekit/components-react";
import { ACESFilmicToneMapping } from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import type { AvatarProfile } from "@hips/types";
import VirtualOfficeAvatar, {
  paletteColors,
  fallbackColors,
  type AvatarGesture,
  type AvatarEmotion,
} from "../session-ui/avatars/VirtualOfficeAvatar";
import { OfficeRoomScene } from "../session-ui/office/OfficeRoomScene";
import { WebGLFallback, isWebGLAvailable } from "../session-ui/WebGLFallback";
import { useState, useCallback, useEffect, type ReactNode } from "react";

// Context loss handler — lives inside Canvas so it has access to the R3F state
function WebGLContextHandler({
  onContextLost,
  onContextRestored,
}: {
  onContextLost: () => void;
  onContextRestored: () => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };

    const handleContextRestored = () => {
      onContextRestored();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, { passive: false });
    canvas.addEventListener("webglcontextrestored", handleContextRestored, { passive: false });

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl, onContextLost, onContextRestored]);

  return null;
}

// GuardedEffectComposer — wraps EffectComposer with null context check
function GuardedEffectComposer({ children }: { children: any }) {
  const { gl } = useThree();

  if (!gl || !(gl as any).context) {
    return null;
  }

  return <EffectComposer>{children}</EffectComposer>;
}

interface AvatarCanvasProps {
  avatar: AvatarProfile;
  localIdentity: string;
  raisedHands: Set<string>;
  activeSpeakerIdentity?: string | null;
  gesture?: AvatarGesture;
  localEmotion?: AvatarEmotion;
}

// Task 5.5 — Three.js virtual office room scene (max 50 draw calls, 60fps on M1)
// Task 5.10 — Active speaker detection + avatar ring animation
export default function AvatarCanvas({
  avatar,
  localIdentity,
  raisedHands,
  activeSpeakerIdentity,
  gesture = "idle",
  localEmotion = "neutral",
}: AvatarCanvasProps) {
  const participants = useParticipants();

  const webglAvailable = isWebGLAvailable();

  // Track WebGL context loss — when true, show fallback UI instead of crashing
  const [contextLost, setContextLost] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
    setCanvasKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isLowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        /Mobi|Android|iPhone/i.test(navigator.userAgent);
      if (isLowEnd || participants.length > 8) {
        setEnablePostProcessing(false);
      } else {
        setEnablePostProcessing(true);
      }
    }
  }, [participants.length]);

  if (!webglAvailable || contextLost) {
    return <WebGLFallback avatar={avatar} roomName={localIdentity} />;
  }

  const radius = participants.length > 1 ? Math.min(4.2, 2.4 + participants.length * 0.2) : 0;
  const angleStep = participants.length > 0 ? (Math.PI * 2) / participants.length : 0;

  return (
    <Canvas
      key={canvasKey}
      camera={{ position: [0, 3.5, 8], fov: 46 }}
      gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
        antialias: true,
      }}
      onCreated={({ gl: renderer }) => {
        // Ensure renderer is valid before any post-processing
        if (!(renderer as any).context) {
          setContextLost(true);
        }
      }}
    >
      {/* WebGL context loss listener */}
      <WebGLContextHandler onContextLost={handleContextLost} onContextRestored={handleContextRestored} />

      {/* Scene fog for depth */}
      <fog attach="fog" args={["#030712", 14, 38]} />

      {/* Ambient — very dim, sanctuary is lit by emissives */}
      <ambientLight intensity={0.18} />

      {/* Warm amber key from top-right */}
      <directionalLight color="#fde68a" intensity={0.7} position={[5, 9, 4]} />

      {/* Cool indigo fill from left */}
      <directionalLight color="#173B57" intensity={0.35} position={[-6, 4, -4]} />

      {/* Central indigo point — drives avatar glow */}
      <pointLight color="#173B57" intensity={18} position={[0, 2.5, 0]} distance={18} decay={2} />

      <OfficeRoomScene />

      {participants.map((participant, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const isLocal = participant.identity === localIdentity;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // CRIT-3 & MAJ-8: Local participant's color can be overridden by sessionStorage (from avatar selector modal)
        // or localStorage (from host avatar setup configuration).
        let localColor: string = paletteColors[avatar.palette] || "#06b6d4";
        if (isLocal) {
          const hostConfigStr = typeof window !== 'undefined' ? localStorage.getItem('hips-host-avatar') : null;
          if (hostConfigStr) {
            try {
              const hostConfig = JSON.parse(hostConfigStr);
              if (hostConfig.avatarColor) {
                localColor = hostConfig.avatarColor;
              }
            } catch {}
          }
          const storedColor = typeof window !== 'undefined' ? sessionStorage.getItem('hips-avatar-color') : null;
          if (storedColor) {
            localColor = storedColor;
          }
        }

        const remoteStyle = participant.attributes['avatar-style'];
        const remotePalette = participant.attributes['avatar-palette'];
        const remoteEmotion = participant.attributes['avatar-emotion'];

        const styleIndex = isLocal
          ? avatar.style
          : (remoteStyle ? parseInt(remoteStyle, 10) : index % 12);

        let color = fallbackColors[index % fallbackColors.length] ?? "#173B57";
        if (isLocal) {
          color = localColor;
        } else if (remotePalette && remotePalette in paletteColors) {
          color = paletteColors[remotePalette as keyof typeof paletteColors];
        }

        const emotion = isLocal
          ? localEmotion
          : ((remoteEmotion as AvatarEmotion) || "neutral");

        const isSpeaking = participant.isSpeaking || participant.identity === activeSpeakerIdentity;

        // Metadata is issued server-side from the authoritative Commerce role.
        // SECURITY WARNING (CRIT-1): isHost derived from client metadata is strictly
        // for rendering the visual crown badge. DO NOT use isHost or metadata role
        // for any server-side or client-side authorization/privilege decisions.
        let isHost = false;
        if (participant.metadata) {
          try {
            const parsed = JSON.parse(participant.metadata);
            isHost = ['FACILITATOR', 'ADMIN', 'SUPER_ADMIN'].includes(parsed.role);
          } catch {}
        }
        return (
          <VirtualOfficeAvatar
            color={color}
            isLocal={isLocal}
            isSpeaking={isSpeaking}
            key={participant.identity}
            position={[x, 0, z]}
            raisedHand={raisedHands.has(participant.identity)}
            styleIndex={styleIndex}
            gesture={isLocal ? gesture : ("idle" as AvatarGesture)}
            isHost={isHost}
            emotion={emotion}
          />
        );
      })}

      {enablePostProcessing && (
        <GuardedEffectComposer>
          <Bloom
            luminanceThreshold={0.05}
            luminanceSmoothing={0.85}
            intensity={0.35}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.38} darkness={0.55} />
        </GuardedEffectComposer>
      )}
    </Canvas>
  );
}
