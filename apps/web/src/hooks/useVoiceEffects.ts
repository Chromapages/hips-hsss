'use client';

import { useCallback, useState } from 'react';
import type { VoicePreset } from '@/lib/voice-mask-presets';
import type { AudioProcessorOptions, TrackProcessor } from 'livekit-client';
import { Track } from 'livekit-client';

interface VoiceMaskProcessorOptions {
  preset: VoicePreset;
  semitones?: number;
}

export interface UseVoiceEffectsReturn {
  activePreset: VoicePreset;
  semitones: number;
  setPreset: (preset: VoicePreset) => void;
  setSemitones: (semitones: number) => void;
  getProcessorOptions: () => VoiceMaskProcessorOptions;
}

export function useVoiceEffects(
  initialPreset: VoicePreset = 'subtle',
  initialSemitones: number = 4,
): UseVoiceEffectsReturn {
  const [activePreset, setActivePreset] = useState<VoicePreset>(initialPreset);
  const [semitones, setSemitonesState] = useState(initialSemitones);

  const setPreset = useCallback((preset: VoicePreset) => {
    setActivePreset(preset);
    // Set default semitone for preset if user hasn't manually slid
    switch (preset) {
      case 'subtle':
        setSemitonesState(4);
        break;
      case 'deep':
        setSemitonesState(-4);
        break;
      case 'high':
        setSemitonesState(4);
        break;
      case 'robotic':
        setSemitonesState(6);
        break;
    }
  }, []);

  const setSemitones = useCallback((value: number) => {
    setSemitonesState(Math.max(-5, Math.min(5, value)));
  }, []);

  const getProcessorOptions = useCallback(
    (): VoiceMaskProcessorOptions => ({
      preset: activePreset,
      semitones,
    }),
    [activePreset, semitones],
  );

  return {
    activePreset,
    semitones,
    setPreset,
    setSemitones,
    getProcessorOptions,
  };
}

export type { VoiceMaskProcessorOptions };
export type { TrackProcessor, Track, AudioProcessorOptions };
