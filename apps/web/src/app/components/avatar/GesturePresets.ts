/**
 * Avatar Gesture Presets for HIPS Phase 5
 * 5 gesture presets per avatar style
 */

export interface GesturePreset {
  id: string;
  name: string;
  pose: {
    headTilt: number;   // degrees
    headTurn: number;   // degrees
    armAngle: number;   // degrees from neutral
    handOpen: boolean;
    bodyLean: number;   // degrees
  };
}

export const GESTURE_PRESETS: GesturePreset[] = [
  {
    id: 'idle',
    name: 'Idle',
    pose: {
      headTilt: 0,
      headTurn: 0,
      armAngle: 0,
      handOpen: true,
      bodyLean: 0,
    },
  },
  {
    id: 'listening',
    name: 'Listening',
    pose: {
      headTilt: 5,
      headTurn: -10,
      armAngle: 15,
      handOpen: true,
      bodyLean: 3,
    },
  },
  {
    id: 'speaking',
    name: 'Speaking',
    pose: {
      headTilt: -3,
      headTurn: 5,
      armAngle: -20,
      handOpen: false,
      bodyLean: -2,
    },
  },
  {
    id: 'thinking',
    name: 'Thinking',
    pose: {
      headTilt: 12,
      headTurn: 8,
      armAngle: 45,
      handOpen: false,
      bodyLean: 5,
    },
  },
  {
    id: 'agreeing',
    name: 'Agreeing',
    pose: {
      headTilt: -8,
      headTurn: 0,
      armAngle: -35,
      handOpen: true,
      bodyLean: -4,
    },
  },
];

export type GestureId = 'idle' | 'listening' | 'speaking' | 'thinking' | 'agreeing';