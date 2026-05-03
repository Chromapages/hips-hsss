'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferAttribute } from 'three';

const INDIGO = '#818cf8';
const AMBER = '#fbbf24';

function ParticleLayer({ count, color, speed, spread }: {
  count: number;
  color: string;
  speed: number;
  spread: number;
}) {
  const ref = useRef<Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = Math.random() * 7 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      vel[i * 3]     = (Math.random() - 0.5) * speed;
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed * 0.6;
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed;
    }
    return { positions: pos, velocities: vel };
  }, [count, speed, spread]);

  useFrame(() => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < count; i++) {
      let x = attr.getX(i) + (velocities[i * 3] ?? 0);
      let y = attr.getY(i) + (velocities[i * 3 + 1] ?? 0);
      let z = attr.getZ(i) + (velocities[i * 3 + 2] ?? 0);
      const half = spread / 2;
      if (x > half) x = -half;
      if (x < -half) x = half;
      if (y > 6) y = -1;
      if (y < -1) y = 6;
      if (z > half) z = -half;
      if (z < -half) z = half;
      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.03} sizeAttenuation transparent opacity={0.45} />
    </points>
  );
}

export default function SanctuaryParticles() {
  return (
    <>
      <ParticleLayer count={220} color={INDIGO} speed={0.003} spread={22} />
      <ParticleLayer count={80}  color={AMBER}  speed={0.002} spread={18} />
    </>
  );
}
