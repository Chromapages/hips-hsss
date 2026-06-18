'use client';

import { Zap, Waves } from 'lucide-react';
import { VOICE_PRESETS, type VoicePreset } from '@/lib/voice-mask-presets';

interface VoiceEffectsPanelProps {
  activePreset: VoicePreset;
  semitones: number;
  wetDryRatio: number;
  onPresetChange: (preset: VoicePreset) => void;
  onSemitoneChange: (semitones: number) => void;
  onWetDryChange: (ratio: number) => void;
  onClose?: () => void;
}

export function VoiceEffectsPanel({
  activePreset,
  semitones,
  wetDryRatio,
  onPresetChange,
  onSemitoneChange,
  onWetDryChange,
  onClose,
}: VoiceEffectsPanelProps) {
  const preset = VOICE_PRESETS[activePreset];
  const isPitchBased = preset.semitoneRange[0] !== 0 || preset.semitoneRange[1] !== 0;

  return (
    <div
      role="dialog"
      aria-label="Voice character controls"
      aria-labelledby="voice-effects-title"
      className="absolute bottom-full left-1/2 mb-4 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <Waves className="h-4 w-4 text-text" />
        <p className="text-sm font-semibold text-white" id="voice-effects-title">
          Voice Character
        </p>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-text">
          {preset.label}
        </span>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {(Object.keys(VOICE_PRESETS) as VoicePreset[]).map((p) => (
          <button
            key={p}
            title={VOICE_PRESETS[p].description}
            onClick={() => onPresetChange(p)}
            className={[
              'flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all',
              activePreset === p
                ? 'border-primary/40 bg-primary/20 text-text'
                : 'border-white/5 bg-surface/5 text-text hover:bg-surface/10 hover:text-white',
            ].join(' ')}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{VOICE_PRESETS[p].label}</span>
            </div>
            <span className="text-[10px] leading-tight text-muted-foreground">
              {VOICE_PRESETS[p].anonymizationAxis}
            </span>
          </button>
        ))}
      </div>

      {/* Pitch slider — only shown for pitch-based presets (sofi, guardian, lark) */}
      {isPitchBased ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="pitch-shift"
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Character
            </label>
            <span className="font-mono text-xs text-text">
              {activePreset === 'guardian' && semitones < 0
                ? `${semitones} — deeper`
                : activePreset === 'lark' && semitones > 0
                ? `+${semitones} — brighter`
                : activePreset === 'sofi' && semitones !== 0
                ? `${semitones > 0 ? '+' : ''}${semitones}`
                : semitones > 0
                ? `+${semitones} — brighter`
                : `${semitones} — deeper`}
            </span>
          </div>
          <input
            type="range"
            id="pitch-shift"
            min={preset.semitoneRange[0]}
            max={preset.semitoneRange[1]}
            step="1"
            value={semitones}
            onChange={(e) => onSemitoneChange(Number(e.target.value))}
            aria-label={`${preset.label} character intensity`}
            aria-valuemin={preset.semitoneRange[0]}
            aria-valuemax={preset.semitoneRange[1]}
            aria-valuenow={semitones}
            aria-valuetext={
              activePreset === 'guardian'
                ? `${Math.abs(semitones)} steps deeper`
                : `${semitones > 0 ? '+' : ''}${semitones} semitones`
            }
            className="h-2 w-full appearance-none rounded-full bg-surface/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
          />
          <div className="flex justify-between text-[9px] text-text">
            <span>
              {activePreset === 'guardian'
                ? `${preset.semitoneRange[0]} — deepest`
                : activePreset === 'lark'
                ? `${preset.semitoneRange[0]} — brightest`
                : `−${Math.abs(preset.semitoneRange[0])}`}
            </span>
            <span>0</span>
            <span>
              {activePreset === 'guardian'
                ? `${preset.semitoneRange[1]}`
                : activePreset === 'lark'
                ? `+${preset.semitoneRange[1]}`
                : `+${preset.semitoneRange[1]}`}
            </span>
          </div>

          {/* Wet / Dry mix slider */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="wet-dry"
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Dry / Wet
            </label>
            <span className="font-mono text-xs text-text">
              {Math.round(wetDryRatio * 100)}% wet
            </span>
          </div>
          <input
            type="range"
            id="wet-dry"
            min={0}
            max={1}
            step={0.05}
            value={wetDryRatio}
            onChange={(e) => onWetDryChange(Number(e.target.value))}
            aria-label="Dry / Wet mix"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(wetDryRatio * 100)}
            aria-valuetext={`${Math.round(wetDryRatio * 100)}% wet signal`}
            className="h-2 w-full appearance-none rounded-full bg-surface/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
          />
          <div className="flex justify-between text-[9px] text-text">
            <span>Dry</span>
            <span>Wet</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-center text-[10px] text-text-muted leading-relaxed">
            {activePreset === 'echo'
              ? 'Echo — rhythmic repetition breaks timing cues'
              : 'Cave — spatial reverb strips intimate presence'}
          </p>
          {/* Wet / Dry mix slider for echo/cave */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="wet-dry"
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Dry / Wet
            </label>
            <span className="font-mono text-xs text-text">
              {Math.round(wetDryRatio * 100)}% wet
            </span>
          </div>
          <input
            type="range"
            id="wet-dry"
            min={0}
            max={1}
            step={0.05}
            value={wetDryRatio}
            onChange={(e) => onWetDryChange(Number(e.target.value))}
            aria-label="Dry / Wet mix"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(wetDryRatio * 100)}
            aria-valuetext={`${Math.round(wetDryRatio * 100)}% wet signal`}
            className="h-2 w-full appearance-none rounded-full bg-surface/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30"
          />
          <div className="flex justify-between text-[9px] text-text">
            <span>Dry</span>
            <span>Wet</span>
          </div>
        </div>
      )}
    </div>
  );
}
