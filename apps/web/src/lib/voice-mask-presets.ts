export type VoicePreset = 'subtle' | 'deep' | 'high' | 'robotic';

export interface VoicePresetConfig {
  label: string;
  description: string;
  semitoneRange: [number, number]; // [min, max]
  character: string;
}

export const VOICE_PRESETS: Record<VoicePreset, VoicePresetConfig> = {
  subtle: {
    label: 'Subtle',
    description: 'Natural anonymisation with randomised pitch shift',
    semitoneRange: [-5, 5],
    character: 'default',
  },
  deep: {
    label: 'Deep',
    description: 'Lower pitch for a deeper, more commanding presence',
    semitoneRange: [-5, -2],
    character: 'lower',
  },
  high: {
    label: 'High',
    description: 'Raised pitch for a lighter, softer delivery',
    semitoneRange: [2, 5],
    character: 'higher',
  },
  robotic: {
    label: 'Robotic',
    description: 'Extreme pitch shift with distorted reverb — intentionally uncanny',
    semitoneRange: [-6, 6],
    character: 'uncanny',
  },
};

export function getDefaultSemitoneForPreset(preset: VoicePreset): number {
  switch (preset) {
    case 'subtle':
      return 4; // was default randomised in old code
    case 'deep':
      return -4;
    case 'high':
      return 4;
    case 'robotic':
      return 6;
  }
}