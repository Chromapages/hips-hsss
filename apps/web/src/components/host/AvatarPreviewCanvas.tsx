"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import AbstractAvatar from "@/components/session/AbstractAvatar";
import SanctuaryScene from "@/components/session/SanctuaryScene";
import SanctuaryParticles from "@/components/session/SanctuaryParticles";

interface AvatarPreviewCanvasProps {
  color: string;
  styleIndex: number;
  isSpeaking: boolean;
}

/**
 * Lightweight standalone R3F canvas used on the Avatar Setup page.
 * Renders a single host avatar floating in the sanctuary environment.
 */
export default function AvatarPreviewCanvas({
  color,
  styleIndex,
  isSpeaking,
}: AvatarPreviewCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        antialias: true,
      }}
      style={{ width: "100%", height: "100%" }}
      aria-label="3D avatar preview"
    >
      {/* Sanctuary atmosphere */}
      <fog attach="fog" args={["#030712", 10, 28]} />
      <ambientLight intensity={0.15} />
      <directionalLight color="#fde68a" intensity={0.65} position={[4, 8, 3]} />
      <directionalLight color="#173B57" intensity={0.3} position={[-5, 3, -3]} />
      <pointLight color="#173B57" intensity={14} position={[0, 2, 0]} distance={14} decay={2} />

      <SanctuaryScene />
      <SanctuaryParticles />

      {/* Single host avatar, centred */}
      <AbstractAvatar
        color={color}
        isLocal={true}
        isSpeaking={isSpeaking}
        position={[0, 0, 0]}
        raisedHand={false}
        styleIndex={styleIndex}
      />
    </Canvas>
  );
}
