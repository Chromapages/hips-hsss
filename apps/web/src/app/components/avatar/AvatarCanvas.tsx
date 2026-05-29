/**
 * AvatarCanvas - Three.js renderer for avatar visualization
 * Lazy-loaded component for React.lazy + Suspense pattern
 *
 * Constraints:
 * - Max 2,000 polys per avatar
 * - No shadow maps
 * - Procedural geometry based on style
 */

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { AvatarStyleId } from './AvatarStyles';
import type { ColorPalette } from './AvatarPalettes';
import type { GesturePreset } from './GesturePresets';

interface AvatarCanvasProps {
  style: AvatarStyleId;
  palette: ColorPalette;
  gesture: GesturePreset;
  speaking: boolean;
  avatarId: string;
  size: number;
}

/**
 * Create procedural avatar geometry based on style
 * All under 2,000 polygons
 */
function createAvatarGeometry(style: AvatarStyleId): THREE.BufferGeometry {
  const geometries: Record<string, THREE.BufferGeometry> = {
    round: new THREE.SphereGeometry(0.45, 24, 18),
    tall: new THREE.CapsuleGeometry(0.25, 0.6, 8, 16),
    broad: new THREE.BoxGeometry(0.7, 0.65, 0.4, 4, 4, 4),
    pear: new THREE.SphereGeometry(0.45, 20, 16),
    'inverted-triangle': new THREE.CylinderGeometry(0.4, 0.25, 0.7, 12),
    hourglass: new THREE.SphereGeometry(0.4, 18, 14),
    slim: new THREE.CapsuleGeometry(0.18, 0.55, 6, 12),
    muscular: new THREE.BoxGeometry(0.65, 0.6, 0.45, 6, 6, 4),
    'soft-square': new THREE.BoxGeometry(0.5, 0.55, 0.45, 3, 3, 3),
    diamond: new THREE.CylinderGeometry(0.3, 0.35, 0.7, 8),
    blob: new THREE.SphereGeometry(0.42, 16, 12),
    geometric: new THREE.BoxGeometry(0.55, 0.6, 0.5, 6, 6, 6),
  };

  return (geometries[style] ?? geometries.round)!;
}

/**
 * AvatarCanvas - Renders a 3D avatar using Three.js
 */
const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  style,
  palette,
  gesture,
  speaking,
  avatarId,
  size,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>(0);

  // Create materials and scene on mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer - NO shadow maps
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.shadowMap.enabled = false; // Disabled per spec
    rendererRef.current = renderer;

    // Create avatar mesh
    const geometry = createAvatarGeometry(style);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.primary),
      emissive: new THREE.Color(palette.emissive),
      emissiveIntensity: speaking ? 0.4 : 0.15,
      roughness: 0.6,
      metalness: 0.1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Add subtle rim light effect (no shadow map)
    const rimLight = new THREE.PointLight(palette.accent, 0.5, 5);
    rimLight.position.set(1.5, 1, 1.5);
    scene.add(rimLight);

    // Ambient light for soft fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    // Append canvas
    containerRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Gentle idle rotation
      const time = Date.now() * 0.001;
      if (mesh) {
        mesh.rotation.y = Math.sin(time * 0.5) * 0.1;
        // Apply gesture pose
        const headTilt = (gesture.pose.headTilt * Math.PI) / 180;
        const bodyLean = (gesture.pose.bodyLean * Math.PI) / 180;
        mesh.rotation.z = headTilt;
        mesh.rotation.x = bodyLean;

        // Speaking animation - subtle pulse
        if (speaking) {
          const pulse = 1 + Math.sin(time * 6) * 0.03;
          mesh.scale.setScalar(pulse);
          (material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.3 + Math.sin(time * 8) * 0.15;
        } else {
          mesh.scale.setScalar(1);
          (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.15;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [style, palette, speaking, size, gesture]);

  // Update material colors when palette changes
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(palette.primary);
      material.emissive.set(palette.emissive);
    }
  }, [palette]);

  return (
    <div
      ref={containerRef}
      style={{
        width: size,
        height: size,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default AvatarCanvas;