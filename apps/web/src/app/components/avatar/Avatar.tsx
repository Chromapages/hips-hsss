/**
 * Avatar Component for HIPS Phase 5
 *
 * Features:
 * - 12 avatar styles × 3 color palettes = 36 combinations
 * - 5 gesture presets (idle, listening, speaking, thinking, agreeing)
 * - Max 2,000 polys per avatar, no shadow maps
 * - Uses React.lazy + Suspense for code splitting
 * - Three.js based rendering with procedural geometry
 */

'use client';

import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  Suspense,
  lazy,
  useCallback,
} from 'react';
import * as THREE from 'three';
import { AVATAR_STYLES, AvatarStyleId } from './AvatarStyles';
import { AVATAR_PALETTES, PaletteId } from './AvatarPalettes';
import { GESTURE_PRESETS, GestureId } from './GesturePresets';

// Lazy load the Three.js canvas component
const AvatarCanvas = lazy(() => import('./AvatarCanvas'));

/**
 * Avatar configuration props
 */
export interface AvatarConfig {
  /** Which of the 12 avatar silhouettes */
  style: AvatarStyleId;
  /** Which of the 3 color palettes */
  palette: PaletteId;
  /** Current gesture preset */
  gesture: GestureId;
  /** Whether the avatar is speaking (triggers animation) */
  speaking?: boolean;
  /** Size in pixels */
  size?: number;
  /** CSS class name */
  className?: string;
}

/**
 * Avatar component with lazy-loaded Three.js canvas
 */
export const Avatar: React.FC<AvatarConfig> = ({
  style = 'round',
  palette = 'midnight',
  gesture = 'idle',
  speaking = false,
  size = 128,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Get palette and gesture data
  const paletteData = useMemo(
    () => AVATAR_PALETTES.find((p) => p.id === palette) ?? AVATAR_PALETTES[0],
    [palette]
  );

  const gestureData = useMemo(
    () => GESTURE_PRESETS.find((g) => g.id === gesture) ?? GESTURE_PRESETS[0],
    [gesture]
  );

  // Generate unique avatar ID for animation sync
  const avatarId = useMemo(
    () => `avatar-${style}-${palette}-${gesture}-${Math.random().toString(36).slice(2, 8)}`,
    [style, palette, gesture]
  );

  useEffect(() => {
    // Small delay to allow canvas to initialize
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`avatar-container ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${paletteData.primary} 0%, ${paletteData.secondary} 100%)`,
            borderRadius: '50%',
          }}
        />
      )}

      {/* Three.js Canvas - lazy loaded with Suspense */}
      <Suspense
        fallback={
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: paletteData.primary }}
          >
            <span style={{ color: paletteData.accent, fontSize: size * 0.4 }}>
              👤
            </span>
          </div>
        }
      >
        <AvatarCanvas
          style={style}
          palette={paletteData}
          gesture={gestureData}
          speaking={speaking}
          avatarId={avatarId}
          size={size}
        />
      </Suspense>
    </div>
  );
};

/**
 * Avatar ring wrapper for session UI
 */
export interface AvatarRingProps {
  config: AvatarConfig;
  isSpeaking?: boolean;
  label?: string;
  isPeer?: boolean;
}

export const AvatarRing: React.FC<AvatarRingProps> = ({
  config,
  isSpeaking = false,
  label,
  isPeer = false,
}) => {
  const size = config.size ?? 128;
  const ringColor = isPeer ? '#6B7280' : '#6366F1';

  return (
    <div
      className={`avatar-ring ${isSpeaking ? 'speaking' : ''} ${isPeer ? 'peer' : ''}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `4px solid ${ringColor}`,
        background: `linear-gradient(135deg, ${config.palette === 'midnight' ? '#1E293B' : config.palette === 'forest' ? '#14532D' : '#9A3412'} 0%, ${config.palette === 'midnight' ? '#334155' : config.palette === 'forest' ? '#166534' : '#C2410C'} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'box-shadow 0.2s ease, border-color 0.3s ease',
        boxShadow: isSpeaking
          ? `0 0 0 4px ${ringColor}40, 0 0 20px ${ringColor}30`
          : 'none',
      }}
    >
      <Avatar {...config} size={size - 8} />
      {label && (
        <span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs"
          style={{ color: isPeer ? '#9CA3AF' : '#A5B4FC' }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Avatar;