"use client";

import { Check } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";
import { hairColors } from "./creator-constants";

export function FacePanel({
  bodyType,
  avatar2D,
  setLocalAvatar2D,
  setAvatarConfig,
}) {
  return (
    <div className="space-y-6">
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
          {avatar2DOptions.mouths
            .filter((mouth) => mouth.id !== "mouth_smile_01")
            .map((mouth) => {
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

      {bodyType === 0 && (
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
            Facial Hair
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial hair">
            {avatar2DOptions.facialHair.map((item) => {
              const isSelected = avatar2D.facialHair === item.id;
              return (
                <button
                  key={item.id ?? "none"}
                  onClick={() => setLocalAvatar2D({ facialHair: item.id })}
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
                  <MiniAvatarPreview partType="facialHair" partId={item.id} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-av-text-subtle font-ui mb-3">
          Facial Expression
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial expression">
          {avatar2DOptions.expressions.map((expression) => {
            const isSelected = avatar2D.expression === expression.id;
            return (
              <button
                key={expression.id}
                onClick={() => {
                  setLocalAvatar2D({ expression: expression.id });
                  setAvatarConfig({
                    emotion: expression.id === "concerned" ? "distressed" : "neutral",
                  });
                }}
                className={`group relative min-h-[56px] min-w-[56px] rounded-lg overflow-hidden border flex items-center justify-center transition ${
                  isSelected
                    ? "border-av-accent bg-av-bg-accent"
                    : "border-av-border bg-av-bg-input hover:border-av-accent"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={expression.label}
                title={expression.label}
              >
                <MiniAvatarPreview partType="expression" partId={expression.id} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}