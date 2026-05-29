'use client';

import { Zap, Waves } from 'lucide-react';
import { VOICE_PRESETS, type VoicePreset } from '@/lib/voice-mask-presets';
import { useVoiceEffects } from '@/hooks/useVoiceEffects';

interface VoiceEffectsPanelProps {
  activePreset: VoicePreset;
  semitones: number;
  onPresetChange: (preset: VoicePreset) => void;
  onSemitoneChange: (semitones: number) => void;
}

export function VoiceEffectsPanel({
  activePreset,
  semitones,
  onPresetChange,
  onSemitoneChange,
}: VoiceEffectsPanelProps) {
  return (
    <div className="absolute bottom-full left-1/2 mb-4 w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="mb-4 flex items-center gap-2">
        <Waves className="h-4 w-4 text-indigo-400" />
        <p className="text-sm font-semibold text-white">Voice Effects</p>
        <span className="ml-auto rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
          {VOICE_PRESETS[activePreset].label}
        </span>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {(Object.keys(VOICE_PRESETS) as VoicePreset[]).map((preset) => (
          <button
            key={preset}
            onClick={() => onPresetChange(preset)}
            className={[
              'flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all',
              activePreset === preset
                ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200'
                : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">
                {VOICE_PRESETS[preset].label}
              </span>
            </div>
            <span className="text-[10px] leading-tight text-zinc-500">
              {VOICE_PRESETS[preset].description}
            </span>
          </button>
        ))}
      </div>

      {/* Semitone slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="pitch-shift" className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Pitch Shift
          </label>
          <span className="font-mono text-xs text-indigo-300">
            {semitones > 0 ? `+${semitones}` : semitones} st
          </span>
        </div>
        <input
          type="range"
          id="pitch-shift"
          min="-5"
          max="5"
          step="1"
          value={semitones}
          onChange={(e) => onSemitoneChange(Number(e.target.value))}
          aria-label="Pitch shift amount"
          aria-valuemin={-5 as const}
          aria-valuemax={5 as const}
          aria-valuenow={semitones}
          aria-valuetext={`${semitones > 0 ? '+' : ''}${semitones} semitones`}
          className="h-2 w-full appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-indigo-500/30"
        />
        <div className="flex justify-between text-[9px] text-zinc-600">
          <span>−5 (Deep)</span>
          <span>0</span>
          <span>+5 (High)</span>
        </div>
      </div>
    </div>
  );
}