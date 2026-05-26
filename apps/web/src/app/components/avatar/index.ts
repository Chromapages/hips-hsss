/**
 * Avatar System - HIPS Phase 5
 *
 * Exports for the avatar component system
 * - 12 avatar styles × 3 color palettes = 36 combinations
 * - 5 gesture presets
 * - Max 2,000 polys, no shadow maps
 * - React.lazy + Suspense for code splitting
 */

export { Avatar, AvatarRing } from './Avatar';
export type { AvatarConfig, AvatarRingProps } from './Avatar';

export { AvatarCanvas } from './AvatarCanvas';

export { AVATAR_STYLES } from './AvatarStyles';
export type { AvatarStyle, AvatarStyleId } from './AvatarStyles';

export { AVATAR_PALETTES } from './AvatarPalettes';
export type { ColorPalette, PaletteId } from './AvatarPalettes';

export { GESTURE_PRESETS } from './GesturePresets';
export type { GesturePreset, GestureId } from './GesturePresets';

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