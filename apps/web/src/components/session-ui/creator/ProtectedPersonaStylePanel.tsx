"use client";

import { useState } from "react";
import type { Avatar2DConfig } from "@hips/types";
import { Check, Layers3, Palette, Shapes, ShieldCheck } from "lucide-react";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";

type StyleCategory = "base" | "color" | "accessories" | "patterns";

type ProtectedPersonaStylePanelProps = {
  avatar2D: Avatar2DConfig;
  setLocalAvatar2D: (patch: Partial<Avatar2DConfig>) => void;
};

const BASE_PRESETS = [
  { id: "shield", label: "Shield", detail: "Compact protective silhouette", patch: { hairStyle: "hair_short_01", clothingStyle: "top_hoodie_01" } },
  { id: "axis", label: "Axis", detail: "Clean centered silhouette", patch: { hairStyle: "hair_pixie_01", clothingStyle: "top_sweater_01" } },
  { id: "arc", label: "Arc", detail: "Rounded abstract silhouette", patch: { hairStyle: "hair_bob_01", clothingStyle: "top_tshirt_01" } },
  { id: "drift", label: "Drift", detail: "Flowing geometric silhouette", patch: { hairStyle: "hair_waves_01", clothingStyle: "top_sweater_01" } },
  { id: "beacon", label: "Beacon", detail: "Elevated signal silhouette", patch: { hairStyle: "hair_bun_01", clothingStyle: "top_blazer_01" } },
  { id: "harbor", label: "Harbor", detail: "Enclosed calm silhouette", patch: { hairStyle: "cover_hijab_01", clothingStyle: "top_hoodie_01" } },
  { id: "vector", label: "Vector", detail: "Angular minimal silhouette", patch: { hairStyle: "hair_shaved_01", clothingStyle: "top_blazer_01" } },
  { id: "orbit", label: "Orbit", detail: "Balanced dual-form silhouette", patch: { hairStyle: "hair_spacebuns_01", clothingStyle: "top_tshirt_01" } },
] as const;

const PALETTES = [
  { id: "slate", label: "Slate", swatches: ["#334155", "#94A3B8", "#DDE7F0"], patch: { clothingColor: "#334155", hairColor: "#1E293B", eyeColor: "#DDE7F0", background: "bg_gradient_cool" } },
  { id: "harbor", label: "Harbor", swatches: ["#0F766E", "#5EEAD4", "#D5F5EE"], patch: { clothingColor: "#0F766E", hairColor: "#134E4A", eyeColor: "#D5F5EE", background: "bg_gradient_mint" } },
  { id: "ember", label: "Ember", swatches: ["#9A3412", "#FDBA74", "#FFF0DD"], patch: { clothingColor: "#9A3412", hairColor: "#431407", eyeColor: "#FFF0DD", background: "bg_gradient_warm" } },
  { id: "plum", label: "Plum", swatches: ["#6B21A8", "#D8B4FE", "#F5E9FF"], patch: { clothingColor: "#6B21A8", hairColor: "#3B0764", eyeColor: "#F5E9FF", background: "bg_gradient_rose" } },
  { id: "signal", label: "Signal", swatches: ["#1D4ED8", "#7DD3FC", "#E0F2FE"], patch: { clothingColor: "#1D4ED8", hairColor: "#172554", eyeColor: "#E0F2FE", background: "bg_gradient_cool" } },
  { id: "moss", label: "Moss", swatches: ["#3F6212", "#A3E635", "#ECFCCB"], patch: { clothingColor: "#3F6212", hairColor: "#1A2E05", eyeColor: "#ECFCCB", background: "bg_gradient_mint" } },
  { id: "graphite", label: "Graphite", swatches: ["#27272A", "#A1A1AA", "#F4F4F5"], patch: { clothingColor: "#27272A", hairColor: "#09090B", eyeColor: "#F4F4F5", background: "bg_solid_charcoal" } },
  { id: "clay", label: "Clay", swatches: ["#7C2D12", "#D6A576", "#FFF7ED"], patch: { clothingColor: "#7C2D12", hairColor: "#431407", eyeColor: "#FFF7ED", background: "bg_solid_cloud" } },
] as const;

const CATEGORIES: Array<{ id: StyleCategory; label: string; icon: typeof Shapes }> = [
  { id: "base", label: "Base", icon: Shapes },
  { id: "color", label: "Color", icon: Palette },
  { id: "accessories", label: "Accessories", icon: ShieldCheck },
  { id: "patterns", label: "Patterns", icon: Layers3 },
];

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD6A5]";

export function ProtectedPersonaStylePanel({ avatar2D, setLocalAvatar2D }: ProtectedPersonaStylePanelProps) {
  const [category, setCategory] = useState<StyleCategory>("base");

  return (
    <section aria-labelledby="persona-style-heading" className="rounded-xl border border-av-border-strong bg-av-bg-section p-3 sm:p-4">
      <div className="flex items-start gap-2">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-av-success-fg" />
        <div>
          <h2 id="persona-style-heading" className="text-sm font-bold text-av-text-primary">Protected persona styling</h2>
          <p className="mt-1 text-xs leading-5 text-av-text-subtle">Abstract style layers only. These controls never use a photo, face scan, realistic skin mapping, or biometric geometry.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Customization categories">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)} className={`min-h-[48px] rounded-lg border px-2 text-xs font-semibold transition-colors motion-reduce:transition-none ${focus} ${category === id ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-[#6B7280]"}`}>
            <Icon aria-hidden="true" className="mr-1.5 inline h-4 w-4" />{label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {category === "base" ? <fieldset><legend className="text-xs font-semibold text-av-text-secondary">Choose a stylized silhouette, not a body or face match.</legend><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">{BASE_PRESETS.map(({ id, label, detail, patch }) => { const selected = avatar2D.hairStyle === patch.hairStyle && avatar2D.clothingStyle === patch.clothingStyle; return <button key={id} type="button" aria-pressed={selected} onClick={() => setLocalAvatar2D(patch)} className={`min-h-[64px] rounded-lg border px-3 py-2 text-left ${focus} ${selected ? "border-av-accent bg-av-bg-accent" : "border-av-border bg-av-bg-input"}`}><span className="flex items-center justify-between text-xs font-bold text-av-text-primary">{label}{selected ? <Check aria-hidden="true" className="h-4 w-4 text-av-accent-fg" /> : null}</span><span className="mt-1 block text-[11px] text-av-text-subtle">{detail}</span></button>; })}</div></fieldset> : null}

        {category === "color" ? <fieldset><legend className="text-xs font-semibold text-av-text-secondary">Choose an abstract color system. Facial and skin geometry do not change.</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{PALETTES.map(({ id, label, swatches, patch }) => { const selected = avatar2D.clothingColor.toLowerCase() === patch.clothingColor.toLowerCase(); return <button key={id} type="button" aria-pressed={selected} onClick={() => setLocalAvatar2D(patch)} className={`min-h-[68px] rounded-lg border p-2 text-left ${focus} ${selected ? "border-av-accent bg-av-bg-accent" : "border-av-border bg-av-bg-input"}`}><span aria-hidden="true" className="flex overflow-hidden rounded-full">{swatches.map((color) => <span key={color} className="h-4 flex-1" style={{ backgroundColor: color }} />)}</span><span className="mt-2 flex items-center justify-between text-[11px] font-semibold text-av-text-secondary">{label}{selected ? <Check aria-hidden="true" className="h-3.5 w-3.5 text-av-accent-fg" /> : null}</span></button>; })}</div></fieldset> : null}

        {category === "accessories" ? <fieldset><legend className="text-xs font-semibold text-av-text-secondary">Optional symbolic layers that do not reveal real-world traits.</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{avatar2DOptions.accessories.map((option) => { const selected = avatar2D.accessory === option.id; return <button key={option.id ?? "none"} type="button" aria-pressed={selected} onClick={() => setLocalAvatar2D({ accessory: option.id })} className={`min-h-[52px] rounded-lg border px-3 text-xs font-semibold ${focus} ${selected ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary"}`}>{option.label}</button>; })}</div></fieldset> : null}

        {category === "patterns" ? <div className="space-y-5"><fieldset><legend className="text-xs font-semibold text-av-text-secondary">Clothing texture</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{avatar2DOptions.patterns.map((option) => { const selected = (avatar2D.pattern ?? null) === option.id; return <button key={option.id ?? "none"} type="button" aria-pressed={selected} onClick={() => setLocalAvatar2D({ pattern: option.id })} className={`min-h-[48px] rounded-lg border px-2 text-xs font-semibold ${focus} ${selected ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary"}`}>{option.label}</button>; })}</div></fieldset><fieldset><legend className="text-xs font-semibold text-av-text-secondary">Preview frame</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{avatar2DOptions.frameStyles.map((option) => { const selected = (avatar2D.frameStyle ?? "frame_none") === option.id; return <button key={option.id} type="button" aria-pressed={selected} onClick={() => setLocalAvatar2D({ frameStyle: option.id })} className={`min-h-[48px] rounded-lg border px-2 text-xs font-semibold ${focus} ${selected ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary"}`}>{option.label}</button>; })}</div></fieldset></div> : null}
      </div>
    </section>
  );
}
