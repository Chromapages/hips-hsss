'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Vector3 } from 'three';

interface AbstractAvatarProps {
  isSpeaking: boolean;
  position: [number, number, number];
  color?: string;
}

export default function AbstractAvatar({ isSpeaking, position, color = '#6366f1' }: AbstractAvatarProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const targetScale = new Vector3(1, 1, 1);

  // Animate the avatar based on speaking state
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation for all avatars
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z += delta * 0.1;

      // Pulse effect when speaking
      if (isSpeaking) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
        
        if (materialRef.current) {
          materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.5;
        }
      } else {
        // Return to normal
        meshRef.current.scale.lerp(targetScale, 0.1);
        if (materialRef.current) {
          materialRef.current.emissiveIntensity = 0;
        }
      }
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        {/* Abstract icosahedron shape for the avatar */}
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={color} 
          wireframe={false}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}
