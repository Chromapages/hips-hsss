"use client";

import type { Avatar2DConfig } from "@hips/types";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { MiniAvatarPreview } from "./MiniAvatarPreview";

interface ExpressionPanelProps {
  avatar2D: Avatar2DConfig;
  setLocalAvatar2D: (config: Partial<Avatar2DConfig>) => void;
  setAvatarConfig: (config: any) => void;
}

export function ExpressionPanel({
  avatar2D,
  setLocalAvatar2D,
  setAvatarConfig,
}: ExpressionPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/55 font-ui mb-3">
          Facial Expression
        </h3>
        <div className="grid grid-cols-4 gap-2.5" role="radiogroup" aria-label="Facial Expression">
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
                className={`group relative w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center transition-all duration-200 hover:scale-[1.05] ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
