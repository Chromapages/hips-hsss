"use client";

import { Check } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import {
  MAN_HAIR_STYLES,
  WOMAN_HAIR_STYLES,
  hairColors,
} from "./creator-constants";

export function HairPanel({
  bodyType,
  avatar2D,
  setLocalAvatar2D,
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
          Select Hair Color
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2" role="radiogroup" aria-label="Hair color">
          {hairColors.map((color) => {
            const isSelected = avatar2D.hairColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                onClick={() => {
                  setLocalAvatar2D({ hairColor: color.hex });
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
      </div>
    </div>
  );
}
