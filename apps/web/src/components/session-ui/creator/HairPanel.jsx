"use client";

import { Sliders } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import {
  MAN_HAIR_STYLES,
  WOMAN_HAIR_STYLES,
} from "./creator-constants";

export function HairPanel({
  bodyType,
  avatar2D,
  setLocalAvatar2D,
  skinOffset,
  setSkinOffset,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Select Hair Style
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Hair style">
          {avatar2DOptions.hairStyles
            .filter((hair) => {
              if (bodyType === 0) {
                return MAN_HAIR_STYLES.includes(hair.id);
              } else {
                return WOMAN_HAIR_STYLES.includes(hair.id);
              }
            })
            .map((hair) => {
              const isSelected = avatar2D.hairStyle === hair.id;
              return (
                <button
                  key={hair.id}
                  onClick={() => setLocalAvatar2D({ hairStyle: hair.id })}
                  className={`group relative min-h-[56px] min-w-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition ${
                    isSelected
                      ? "border-av-accent bg-av-bg-accent"
                      : "border-av-border bg-av-bg-input hover:border-av-accent"
                  }`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={hair.label}
                  title={hair.label}
                >
                  <MiniAvatarPreview partType="hairStyle" partId={hair.id} />
                </button>
              );
            })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Skin Tone
        </h3>
        <div className="rounded-lg border border-av-border bg-av-bg-input p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="skin-tone-slider" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-av-text-subtle font-ui">
              <Sliders className="h-3.5 w-3.5" aria-hidden="true" />
              Fine Adjustment
            </label>
            <span className="rounded bg-av-bg-elevated px-2 py-1 text-xs font-bold font-mono text-av-text-primary">
              {skinOffset > 0 ? `+${Math.round(skinOffset * 100)}` : Math.round(skinOffset * 100)}%
            </span>
          </div>
          <input
            id="skin-tone-slider"
            type="range"
            min={-0.12}
            max={0.12}
            step={0.01}
            value={skinOffset}
            onChange={(event) => setSkinOffset(Number(event.target.value))}
            className="min-h-[44px] w-full cursor-ew-resize accent-[var(--color-action-primary)]"
            aria-label="Adjust skin tone luminance"
          />
          <div className="mt-1 flex justify-between text-[9px] text-av-text-muted font-mono">
            <span>Darker</span>
            <span>Neutral</span>
            <span>Lighter</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-av-text-muted">
            <span className="h-5 w-5 rounded border border-av-border" style={{ backgroundColor: avatar2D.skinTone }} aria-hidden="true" />
            Current tone <span className="font-mono text-av-text-secondary">{avatar2D.skinTone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
