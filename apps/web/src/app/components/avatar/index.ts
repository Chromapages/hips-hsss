/**
 * Avatar System - HIPS Phase 5
 *
 * Exports for the avatar component system
 * - 12 avatar styles × 3 color palettes = 36 combinations
 * - 5 gesture presets
 * - Max 2,000 polys, no shadow maps
 * - React.lazy + Suspense for code splitting
 */

import { Avatar, AvatarRing } from './Avatar';
export type { AvatarConfig, AvatarRingProps } from './Avatar';
export { Avatar, AvatarRing };

import AvatarCanvas from './AvatarCanvas';
export { AvatarCanvas };

import { AVATAR_STYLES } from './AvatarStyles';
import type { AvatarStyle, AvatarStyleId } from './AvatarStyles';
export { AVATAR_STYLES };
export type { AvatarStyle, AvatarStyleId };

import { AVATAR_PALETTES } from './AvatarPalettes';
import type { ColorPalette, PaletteId } from './AvatarPalettes';
export { AVATAR_PALETTES };
export type { ColorPalette, PaletteId };

import { GESTURE_PRESETS } from './GesturePresets';
import type { GesturePreset, GestureId } from './GesturePresets';
export { GESTURE_PRESETS };
export type { GesturePreset, GestureId };

/**
 * All possible avatar combinations: 36
 * 12 styles × 3 palettes
 */
export const AVATAR_COMBINATIONS = AVATAR_STYLES.flatMap((style) =>
  AVATAR_PALETTES.map((palette) => ({
    style: style.id,
    palette: palette.id,
    key: `${style.id}-${palette.id}`,
  }))
);

/**
 * Default avatar configuration
 */
export const DEFAULT_AVATAR_CONFIG = {
  style: 'round' as AvatarStyleId,
  palette: 'midnight' as PaletteId,
  gesture: 'idle' as GestureId,
  speaking: false,
  size: 128,
};