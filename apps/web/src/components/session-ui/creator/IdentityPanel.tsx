"use client";

import type { Avatar2DConfig } from "@hips/types";
import { Sliders } from "lucide-react";

interface IdentityPanelProps {
  bodyType: 0 | 1;
  setBodyType: (body: 0 | 1) => void;
  skinOffset: number;
  setSkinOffset: (offset: number) => void;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
}

export function IdentityPanel({
  bodyType,
  setBodyType,
  skinOffset,
  setSkinOffset,
  setLocalAvatar2D,
}: IdentityPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Select Model
        </h3>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select Model">
          <button
            onClick={() => {
              setBodyType(0);
              setLocalAvatar2D({ hairStyle: "hair_short_01" });
            }}
            className={`py-3 px-4 rounded-xl text-left border transition-all ${
              bodyType === 0
                ? "border-accent bg-accent/8 text-accent font-bold"
                : "border-white/10 text-white/60 hover:border-white/20"
            }`}
            type="button"
            role="radio"
            aria-checked={bodyType === 0}
          >
            <div className="text-xs font-bold font-ui">Man</div>
            <div className="text-[9px] opacity-70 font-body mt-0.5">Short hair style model</div>
          </button>
          <button
            onClick={() => {
              setBodyType(1);
              setLocalAvatar2D({ hairStyle: "hair_long_01", facialHair: null });
            }}
            className={`py-3 px-4 rounded-xl text-left border transition-all ${
              bodyType === 1
                ? "border-accent bg-accent/8 text-accent font-bold"
                : "border-white/10 text-white/60 hover:border-white/20"
            }`}
            type="button"
            role="radio"
            aria-checked={bodyType === 1}
          >
            <div className="text-xs font-bold font-ui">Woman</div>
            <div className="text-[9px] opacity-70 font-body mt-0.5">Long hair style model</div>
          </button>
        </div>
      </div>

      <div>
        {/* Fine range slider for micro adjustments in OKLCH */}
        <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="skin-slider" className="text-[10px] font-bold uppercase tracking-wider text-white/60 font-ui flex items-center gap-1">
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
            className="w-full accent-accent bg-zinc-800 cursor-ew-resize"
          />
          <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
            <span>Lighter</span>
            <span>Neutral</span>
            <span>Darker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
