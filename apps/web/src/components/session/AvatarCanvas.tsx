'use client';

import { Canvas } from '@react-three/fiber';
import { useParticipants } from '@livekit/components-react';
import { ACESFilmicToneMapping } from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import type { AvatarProfile } from '@hips/types';
import AbstractAvatar from './AbstractAvatar';
import SanctuaryScene from './SanctuaryScene';
import SanctuaryParticles from './SanctuaryParticles';

const paletteColors = {
  coastal: '#06b6d4',
  sunrise: '#f59e0b',
  forest: '#10b981',
} as const;

const fallbackColors = ['#6366f1', '#a78bfa', '#f43f5e', '#f59e0b', '#34d399', '#38bdf8'];

export default function AvatarCanvas({
  avatar,
  localIdentity,
  raisedHands,
}: {
  avatar: AvatarProfile;
  localIdentity: string;
  raisedHands: Set<string>;
}) {
  const participants = useParticipants();
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
    >
      {/* Scene fog for depth */}
      <fog attach="fog" args={['#030712', 14, 38]} />

      {/* Ambient — very dim, sanctuary is lit by emissives */}
      <ambientLight intensity={0.18} />

      {/* Warm amber key from top-right */}
      <directionalLight color="#fde68a" intensity={0.7} position={[5, 9, 4]} />

      {/* Cool indigo fill from left */}
      <directionalLight color="#818cf8" intensity={0.35} position={[-6, 4, -4]} />

      {/* Central indigo point — drives avatar glow */}
      <pointLight color="#6366f1" intensity={18} position={[0, 2.5, 0]} distance={18} decay={2} />

      <SanctuaryScene />
      <SanctuaryParticles />

      {participants.map((participant, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const isLocal = participant.identity === localIdentity;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const color = isLocal
          ? paletteColors[avatar.palette]
          : fallbackColors[index % fallbackColors.length] ?? '#6366f1';

        return (
          <AbstractAvatar
            color={color}
            isLocal={isLocal}
            isSpeaking={participant.isSpeaking}
            key={participant.identity}
            position={[x, 0, z]}
            raisedHand={raisedHands.has(participant.identity)}
            styleIndex={isLocal ? avatar.style : index + 1}
          />
        );
      })}

      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.85} intensity={0.35} mipmapBlur />
        <Vignette eskil={false} offset={0.38} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
