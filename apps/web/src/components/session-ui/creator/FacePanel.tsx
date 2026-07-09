"use client";

import type { Avatar2DConfig } from "@hips/types";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";

interface FacePanelProps {
  avatar2D: Avatar2DConfig;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
}

export function FacePanel({
  avatar2D,
  setLocalAvatar2D,
}: FacePanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Brows
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Brow Style">
          {avatar2DOptions.eyebrows.map((brow) => {
            const isSelected = avatar2D.eyebrow === brow.id;
            return (
              <button
                key={brow.id}
                onClick={() => setLocalAvatar2D({ eyebrow: brow.id })}
                className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                title={brow.label}
              >
                <MiniAvatarPreview partType="eyebrow" partId={brow.id} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Mouth
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Mouth Style">
          {avatar2DOptions.mouths.map((mouth) => {
            const isSelected = avatar2D.mouth === mouth.id && avatar2D.expression === "neutral";
            return (
              <button
                key={mouth.id}
                onClick={() => setLocalAvatar2D({ mouth: mouth.id, expression: "neutral" })}
                className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                title={mouth.label}
              >
                <MiniAvatarPreview partType="mouth" partId={mouth.id} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
