"use client";

import type { Avatar2DConfig } from "@hips/types";
import { Check } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import {
  MAN_HAIR_STYLES,
  WOMAN_HAIR_STYLES,
  hairColors,
} from "./creator-constants";

interface HairPanelProps {
  bodyType: 0 | 1;
  avatar2D: Avatar2DConfig;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
}

export function HairPanel({
  bodyType,
  avatar2D,
  setLocalAvatar2D,
}: HairPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Select Hair Style
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Hair Style">
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
                  className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                    isSelected
                      ? "border-accent ring-2 ring-accent/40"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  title={hair.label}
                >
                  <MiniAvatarPreview partType="hairStyle" partId={hair.id} />
                </button>
              );
            })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Select Hair Color
        </h3>
        <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Hair Color">
          {hairColors.map((color) => {
            const isSelected = avatar2D.hairColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                onClick={() => {
                  setLocalAvatar2D({ hairColor: color.hex });
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
      </div>
    </div>
  );
}
