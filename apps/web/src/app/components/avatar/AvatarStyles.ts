/**
 * Avatar Styles for HIPS Phase 5
 * 12 distinct avatar silhouettes, max 2,000 polys each, no shadow maps
 */

export interface AvatarStyle {
  id: string;
  name: string;
  geometryType: 'capsule' | 'sphere' | 'cylinder' | 'box' | 'custom';
  polyCount: number;
  features: string[];
}

export const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'round', name: 'Round', geometryType: 'sphere', polyCount: 892, features: ['circular', 'soft'] },
  { id: 'tall', name: 'Tall', geometryType: 'capsule', polyCount: 1240, features: ['elongated', 'slim'] },
  { id: 'broad', name: 'Broad', geometryType: 'box', polyCount: 1560, features: ['wide', 'solid'] },
  { id: 'pear', name: 'Pear', geometryType: 'sphere', polyCount: 1380, features: ['bottom-heavy', 'rounded'] },
  { id: 'inverted-triangle', name: 'V-Shape', geometryType: 'cylinder', polyCount: 1650, features: ['top-heavy', 'angular'] },
  { id: 'hourglass', name: 'Hourglass', geometryType: 'sphere', polyCount: 1520, features: ['curved', 'symmetric'] },
  { id: 'slim', name: 'Slim', geometryType: 'capsule', polyCount: 1080, features: ['thin', 'minimal'] },
  { id: 'muscular', name: 'Muscular', geometryType: 'box', polyCount: 1890, features: ['athletic', 'defined'] },
  { id: 'soft-square', name: 'Soft Square', geometryType: 'box', polyCount: 1240, features: ['blocky', 'friendly'] },
  { id: 'diamond', name: 'Diamond', geometryType: 'cylinder', polyCount: 1420, features: ['angular', 'geometric'] },
  { id: 'blob', name: 'Blob', geometryType: 'sphere', polyCount: 980, features: ['organic', 'flowing'] },
  { id: 'geometric', name: 'Geometric', geometryType: 'box', polyCount: 1720, features: ['faceted', 'modern'] },
];

export type AvatarStyleId =
  | 'round' | 'tall' | 'broad' | 'pear' | 'inverted-triangle'
  | 'hourglass' | 'slim' | 'muscular' | 'soft-square' | 'diamond'
  | 'blob' | 'geometric';