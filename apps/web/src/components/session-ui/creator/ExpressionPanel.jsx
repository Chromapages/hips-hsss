"use client";

import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";

export function ExpressionPanel({
  avatar2D,
  setLocalAvatar2D,
  setAvatarConfig,
}) {
  return (
    <div className="space-y-6">
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
