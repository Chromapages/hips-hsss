"use client";

import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";

export function FacePanel({
  avatar2D,
  setLocalAvatar2D,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Brows
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Brow style">
          {avatar2DOptions.eyebrows.map((brow) => {
            const isSelected = avatar2D.eyebrow === brow.id;
            return (
              <button
                key={brow.id}
                onClick={() => setLocalAvatar2D({ eyebrow: brow.id })}
                className={`group relative min-h-[56px] min-w-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition ${
                  isSelected
                    ? "border-av-accent bg-av-bg-accent"
                    : "border-av-border bg-av-bg-input hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={brow.label}
                title={brow.label}
              >
                <MiniAvatarPreview partType="eyebrow" partId={brow.id} />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Mouth
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Mouth style">
          {avatar2DOptions.mouths.map((mouth) => {
            const isSelected = avatar2D.mouth === mouth.id && avatar2D.expression === "neutral";
            return (
              <button
                key={mouth.id}
                onClick={() => setLocalAvatar2D({ mouth: mouth.id, expression: "neutral" })}
                className={`group relative min-h-[56px] min-w-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition ${
                  isSelected
                    ? "border-av-accent bg-av-bg-accent"
                    : "border-av-border bg-av-bg-input hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={mouth.label}
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
