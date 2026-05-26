/**
 * Avatar Color Palettes for HIPS Phase 5
 * 3 palettes × avatar styles = 36 combinations
 */

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;    // Main body color
  secondary: string;  // Accent color
  accent: string;     // Highlights
  emissive: string;   // Glow effect
}

export const AVATAR_PALETTES: ColorPalette[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#1E293B',   // Slate 800
    secondary: '#334155', // Slate 700
    accent: '#6366F1',    // Indigo 500
    emissive: '#818CF8',   // Indigo 400
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#14532D',   // Green 900
    secondary: '#166534', // Green 800
    accent: '#22C55E',    // Green 500
    emissive: '#4ADE80',   // Green 400
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#9A3412',   // Orange 800
    secondary: '#C2410C', // Orange 700
    accent: '#F97316',    // Orange 500
    emissive: '#FB923C',   // Orange 400
  },
];

export type PaletteId = 'midnight' | 'forest' | 'sunset';