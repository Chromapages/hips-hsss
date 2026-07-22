"use client";

import { Check } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import { clothingColors } from "./creator-constants";

export function WardrobePanel({
  avatar2D,
  setLocalAvatar2D,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Clothing Style
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Clothing style">
          {avatar2DOptions.clothing.map((item) => {
            const isSelected = avatar2D.clothingStyle === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setLocalAvatar2D({ clothingStyle: item.id })}
                className={`group relative min-h-[56px] min-w-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition ${
                  isSelected
                    ? "border-av-accent bg-av-bg-accent"
                    : "border-av-border bg-av-bg-input hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={item.label}
                title={item.label}
              >
                <MiniAvatarPreview partType="clothingStyle" partId={item.id} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Clothing Color
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2" role="radiogroup" aria-label="Clothing color">
          {clothingColors.map((color) => {
            const isSelected = avatar2D.clothingColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                onClick={() => {
                  setLocalAvatar2D({ clothingColor: color.hex });
                }}
                className="min-h-[44px] min-w-[44px] rounded-lg border-2 flex items-center justify-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4A261]"
                style={{
                  backgroundColor: color.hex,
                  borderColor: isSelected ? "#F4A261" : "#3A404D",
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={color.label}
              >
                {isSelected && <Check className="h-4 w-4 text-white" />}
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
            className="min-h-[44px] w-12 rounded-lg border border-av-border bg-av-bg-input"
            aria-label="Custom clothing color"
          />
          <input
            type="text"
            value={avatar2D.clothingColor}
            onChange={(event) => {
              setLocalAvatar2D({ clothingColor: event.target.value });
            }}
            className="min-h-[44px] flex-1 rounded-lg border border-av-border bg-av-bg-input px-3 text-xs font-mono text-av-text-primary"
            aria-label="Clothing color hex value"
          />
        </div>
      </div>
    </div>
  );
}
