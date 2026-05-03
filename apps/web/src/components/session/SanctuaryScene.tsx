'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

function Starfield() {
  const count = 2000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 120;
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
      <pointsMaterial color="#a5b4fc" size={0.06} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

function MandalaRings() {
  const outerRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (outerRef.current) {
      outerRef.current.rotation.z = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <>
      {/* Ground disc */}
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

export default function SanctuaryScene() {
  return (
    <>
      <Starfield />
      <MandalaRings />
    </>
  );
}
