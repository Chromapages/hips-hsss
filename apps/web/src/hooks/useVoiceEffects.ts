'use client';

import { useCallback, useState } from 'react';
import { VOICE_PRESETS, type VoicePreset } from '@/lib/voice-mask-presets';
import type { AudioProcessorOptions, TrackProcessor } from 'livekit-client';
import { Track } from 'livekit-client';

interface VoiceMaskProcessorOptions {
  preset: VoicePreset;
  semitones?: number;
  wetDryRatio?: number;
}

export interface UseVoiceEffectsReturn {
  activePreset: VoicePreset;
  semitones: number;
  wetDryRatio: number;
  setPreset: (preset: VoicePreset) => void;
  setSemitones: (semitones: number) => void;
  setWetDryRatio: (ratio: number) => void;
  getProcessorOptions: () => VoiceMaskProcessorOptions;
}

export function useVoiceEffects(
  initialPreset: VoicePreset = 'sofi',
  initialSemitones: number = 4,
): UseVoiceEffectsReturn {
  const [activePreset, setActivePreset] = useState<VoicePreset>(initialPreset);
  const [semitones, setSemitonesState] = useState(initialSemitones);
  const [wetDryRatio, setWetDryRatioState] = useState(0.22);

  const setPreset = useCallback((preset: VoicePreset) => {
    setActivePreset(preset);
    // Set default semitone for pitch presets; echo/cave use 0 (no pitch shift)
    switch (preset) {
      case 'sofi':
        setSemitonesState(-3);
        break;
      case 'guardian':
        setSemitonesState(-6);
        break;
      case 'lark':
        setSemitonesState(6);
        break;
      case 'cyber':
        setSemitonesState(-2);
        break;
      case 'echo':
        setSemitonesState(0);
        break;
      case 'cave':
        setSemitonesState(0);
        break;
    }
  }, []);

  const setSemitones = useCallback((value: number) => {
    const config = VOICE_PRESETS[activePreset];
    const [min, max] = config ? config.semitoneRange : [-5, 5];
    setSemitonesState(Math.max(min, Math.min(max, value)));
  }, [activePreset]);

  const setWetDryRatio = useCallback((ratio: number) => {
    setWetDryRatioState(Math.max(0, Math.min(1, ratio)));
  }, []);

  const getProcessorOptions = useCallback(
    (): VoiceMaskProcessorOptions => ({
      preset: activePreset,
      semitones,
      wetDryRatio,
    }),
    [activePreset, semitones, wetDryRatio],
  );

  return {
    activePreset,
    semitones,
    wetDryRatio,
    setPreset,
    setSemitones,
    setWetDryRatio,
    getProcessorOptions,
  };
}

export type { VoiceMaskProcessorOptions };
export type { TrackProcessor, Track, AudioProcessorOptions };
