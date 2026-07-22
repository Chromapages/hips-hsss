"use client";

import { Sliders } from "lucide-react";

export function IdentityPanel({
  bodyType,
  setBodyType,
  skinOffset,
  setSkinOffset,
  setLocalAvatar2D,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Select Model
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Select model">
          <button
            onClick={() => {
              setBodyType(0);
              setLocalAvatar2D({ hairStyle: "hair_short_01" });
            }}
            className={`min-h-[44px] py-3 px-4 rounded-lg text-left border transition ${
              bodyType === 0
                ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
            }`}
            type="button"
            role="radio"
            aria-checked={bodyType === 0}
            aria-label="Man model"
          >
            <div className="text-xs font-bold font-ui">Man</div>
            <div className="text-[9px] text-av-text-subtle font-body mt-0.5">Short hair style model</div>
          </button>
          <button
            onClick={() => {
              setBodyType(1);
              setLocalAvatar2D({ hairStyle: "hair_long_01", facialHair: null });
            }}
            className={`min-h-[44px] py-3 px-4 rounded-lg text-left border transition ${
              bodyType === 1
                ? "border-av-accent bg-av-bg-accent text-av-accent-fg font-bold"
                : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"
            }`}
            type="button"
            role="radio"
            aria-checked={bodyType === 1}
            aria-label="Woman model"
          >
            <div className="text-xs font-bold font-ui">Woman</div>
            <div className="text-[9px] text-av-text-subtle font-body mt-0.5">Long hair style model</div>
          </button>
        </div>
      </div>

      <div>
        {/* Fine range slider for micro adjustments in OKLCH */}
        <div className="p-3 rounded-lg bg-av-bg-input border border-av-border">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="skin-slider" className="text-[10px] font-bold uppercase tracking-wider text-av-text-subtle font-ui flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Fine Adjustment (Luminance)
            </label>
            <span className="text-xs font-mono font-bold text-white">
              {skinOffset > 0 ? `+${Math.round(skinOffset * 100)}` : Math.round(skinOffset * 100)}%
            </span>
          </div>
          <input
            id="skin-slider"
            type="range"
            min={-0.12}
            max={0.12}
            step={0.01}
            value={skinOffset}
            onChange={(e) => setSkinOffset(Number(e.target.value))}
            className="min-h-[44px] w-full accent-[#F4A261] bg-av-border-strong cursor-ew-resize"
          />
          <div className="flex justify-between text-[9px] text-av-text-muted font-mono mt-1">
            <span>Lighter</span>
            <span>Neutral</span>
            <span>Darker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
