'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useParticipants } from '@livekit/components-react';
import AbstractAvatar from './AbstractAvatar';

export default function AvatarCanvas() {
  const participants = useParticipants();

  // Simple layout logic to arrange avatars in a circle
  const radius = participants.length > 1 ? 3 : 0;
  const angleStep = (Math.PI * 2) / participants.length;

  // A set of calming colors for anonymous avatars
  const avatarColors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Environment map for realistic reflections */}
      <Environment preset="city" />

      {/* Render an avatar for each participant */}
      {participants.map((p, index) => {
        const angle = index * angleStep;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Pick a consistent color based on identity hash (or just index for MVP)
        const color = avatarColors[index % avatarColors.length] || '#6366f1';

        return (
          <AbstractAvatar 
            key={p.identity} 
            isSpeaking={p.isSpeaking} 
            position={[x, 0, z]} 
            color={color}
          />
        );
      })}

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3} 
        maxDistance={15}
        autoRotate={participants.length > 1}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
