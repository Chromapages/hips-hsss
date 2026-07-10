"use client";

import type { Avatar2DConfig } from "@hips/types";
import { Check } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import { clothingColors } from "./creator-constants";

interface WardrobePanelProps {
  bodyType: 0 | 1;
  avatar2D: Avatar2DConfig;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
}

export function WardrobePanel({
  bodyType,
  avatar2D,
  setLocalAvatar2D,
}: WardrobePanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Clothing Style
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Clothing Style">
          {avatar2DOptions.clothing.map((item) => {
            const isSelected = avatar2D.clothingStyle === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLocalAvatar2D({ clothingStyle: item.id })}
                className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                title={item.label}
              >
                <MiniAvatarPreview partType="clothingStyle" partId={item.id} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Clothing Color
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" role="radiogroup" aria-label="Clothing Color">
          {clothingColors.map((color) => {
            const isSelected = avatar2D.clothingColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                onClick={() => {
                  setLocalAvatar2D({ clothingColor: color.hex });
                }}
                className={`aspect-square rounded-xl flex items-center justify-center transition hover:scale-105`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: isSelected
                    ? `0 0 0 2px #09090b, 0 0 0 4px ${color.hex}`
                    : undefined,
                }}
                type="button"
                aria-label={color.label}
              >
                {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={avatar2D.clothingColor}
            onChange={(event) => {
              setLocalAvatar2D({ clothingColor: event.target.value });
            }}
            className="h-9 w-11 rounded-lg border border-white/10 bg-transparent"
            aria-label="Custom clothing color"
          />
          <input
            type="text"
            value={avatar2D.clothingColor}
            onChange={(event) => {
              setLocalAvatar2D({ clothingColor: event.target.value });
            }}
            className="h-9 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-3 text-xs font-mono text-white"
            aria-label="Clothing color hex value"
          />
        </div>
      </div>

      {bodyType === 0 && (
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
            Facial Hair
          </h3>
          <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial Hair">
            {avatar2DOptions.facialHair.map((item) => {
              const isSelected = avatar2D.facialHair === item.id;
              return (
                <button
                  key={item.id ?? "none"}
                  onClick={() => setLocalAvatar2D({ facialHair: item.id })}
                  className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/40"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  title={item.label}
                >
                  <MiniAvatarPreview partType="facialHair" partId={item.id} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Accessories
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Accessories">
          {avatar2DOptions.accessories.map((acc) => {
            const isSelected = avatar2D.accessory === acc.id;
            return (
              <button
                key={acc.id ?? "none"}
                onClick={() => setLocalAvatar2D({ accessory: acc.id })}
                className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                title={acc.label}
              >
                <MiniAvatarPreview partType="accessory" partId={acc.id} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Background
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Background">
          {avatar2DOptions.backgrounds.map((background) => {
            const isSelected = avatar2D.background === background.id;
            return (
              <button
                key={background.id}
                onClick={() => setLocalAvatar2D({ background: background.id })}
                className={`rounded-lg border px-3 py-2 text-center transition-all ${
                  isSelected
                    ? "border-accent bg-accent/8 text-accent font-bold"
                    : "border-white/5 text-white/60 hover:border-white/15 hover:text-white"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
              >
                <span className="text-xs font-ui">{background.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
