export type VoicePreset = 'sofi' | 'guardian' | 'lark' | 'echo' | 'cave' | 'cyber';

export interface VoicePresetConfig {
  /** User-facing character name */
  label: string;
  /** One-line description of the character */
  description: string;
  /** What acoustic axis this preset targets for anonymization */
  anonymizationAxis: string;
  /** Allowed semitone range for pitch presets; [0, 0] for non-pitch presets */
  semitoneRange: [number, number];
  /** Default semitone for pitch presets; 0 for non-pitch presets */
  defaultSemitones: number;
  character: string;
}

export const VOICE_PRESETS: Record<VoicePreset, VoicePresetConfig> = {
  sofi: {
    label: 'Sofi',
    description: 'Warm, gentle disguise — pitched down for deep, soft presence',
    anonymizationAxis: 'Pitch shift + reverb',
    semitoneRange: [-5, -1],
    defaultSemitones: -3,
    character: 'sofi',
  },
  guardian: {
    label: 'Guardian',
    description: 'Voice Shield — deeper register, heavy anonymisation',
    anonymizationAxis: 'Pitch shift + warmth',
    semitoneRange: [-8, -4],
    defaultSemitones: -6,
    character: 'guardian',
  },
  lark: {
    label: 'Lark',
    description: 'Bright Veil — raised register, high-pitched presence',
    anonymizationAxis: 'Pitch shift + clarity',
    semitoneRange: [4, 8],
    defaultSemitones: 6,
    character: 'lark',
  },
  cyber: {
    label: 'Cyber',
    description: 'Robotic and synthetic — ring modulation anonymises vocal profile',
    anonymizationAxis: 'Ring modulation + pitch shift',
    semitoneRange: [-4, 4],
    defaultSemitones: -2,
    character: 'cyber',
  },
  echo: {
    label: 'Echo',
    description: 'Dramatic rhythm disruption — distinct echoes break timing cues',
    anonymizationAxis: 'Timing & rhythm (no pitch shift)',
    semitoneRange: [0, 0],
    defaultSemitones: 0,
    character: 'echo',
  },
  cave: {
    label: 'Cave',
    description: 'Distant and spatial — hall reverb strips intimate presence',
    anonymizationAxis: 'Spatial presence (no pitch shift)',
    semitoneRange: [0, 0],
    defaultSemitones: 0,
    character: 'cave',
  },
};

export function getDefaultSemitoneForPreset(preset: VoicePreset): number {
  return VOICE_PRESETS[preset]?.defaultSemitones ?? 0;
}
