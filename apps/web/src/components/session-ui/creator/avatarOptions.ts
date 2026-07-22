export const BASE_FORMS = ["man", "woman"] as const;

export type BaseForm = (typeof BASE_FORMS)[number];

export type BaseScopedOption = {
  id: string;
  label: string;
  description: string;
  appliesTo: readonly BaseForm[];
  avatarPatch?: Record<string, unknown>;
};

// Every guided choice declares its eligible base forms. Backdrop and accent are
// intentionally shared today, while keeping this schema ready for variations.
export const backdropOptions = [
  { id: "bg_gradient_cool", label: "Cool", description: "A calm blue gradient", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_gradient_cool" } },
  { id: "bg_gradient_warm", label: "Warm", description: "A welcoming amber gradient", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_gradient_warm" } },
  { id: "bg_gradient_mint", label: "Mint", description: "A fresh green gradient", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_gradient_mint" } },
  { id: "bg_gradient_rose", label: "Rose", description: "A soft rose gradient", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_gradient_rose" } },
  { id: "bg_solid_cloud", label: "Cloud", description: "A light, neutral backdrop", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_solid_cloud" } },
  { id: "bg_solid_charcoal", label: "Charcoal", description: "A quiet, low-detail backdrop", appliesTo: ["man", "woman"], avatarPatch: { background: "bg_solid_charcoal" } },
] as const satisfies readonly BaseScopedOption[];

export const accentOptions = [
  { id: "none", label: "No accent", description: "Keep the persona minimal", appliesTo: ["man", "woman"], avatarPatch: { accessory: null } },
  { id: "acc_glasses_round_01", label: "Glasses", description: "A simple round-frame accent", appliesTo: ["man", "woman"], avatarPatch: { accessory: "acc_glasses_round_01" } },
  { id: "acc_headband_01", label: "Headband", description: "A clean, low-profile accent", appliesTo: ["man", "woman"], avatarPatch: { accessory: "acc_headband_01" } },
  { id: "acc_visor_01", label: "Abstract visor", description: "A stronger abstract accent", appliesTo: ["man", "woman"], avatarPatch: { accessory: "acc_visor_01" } },
  { id: "acc_cap_abstract_01", label: "Protective cap", description: "A compact protective accent", appliesTo: ["man", "woman"], avatarPatch: { accessory: "acc_cap_abstract_01" } },
  { id: "acc_signal_arc_01", label: "Signal arc", description: "A small signal-inspired accent", appliesTo: ["man", "woman"], avatarPatch: { accessory: "acc_signal_arc_01" } },
] as const satisfies readonly BaseScopedOption[];

export const privacyOptions = [
  { id: "most-private", label: "Most private", description: "Keep your chosen styling restrained and abstract.", appliesTo: ["man", "woman"] },
  { id: "balanced", label: "Balanced", description: "A clear persona with a moderate level of visual detail.", appliesTo: ["man", "woman"] },
  { id: "most-expressive", label: "Most expressive", description: "Use your selected styling while remaining non-biometric.", appliesTo: ["man", "woman"] },
] as const satisfies readonly BaseScopedOption[];

export const voiceOptions = [
  { id: "neutral", label: "Clear Neutral", description: "Maximum comprehension with gentle privacy color", appliesTo: ["man", "woman"] },
  { id: "soft", label: "Soft Mask", description: "Clearest speech with light privacy cover", appliesTo: ["man", "woman"] },
  { id: "balanced", label: "Balanced Mask", description: "Clear conversation with stronger cover", appliesTo: ["man", "woman"] },
  { id: "deep", label: "Deep Mask", description: "Strongest cover; clarity may vary by voice", appliesTo: ["man", "woman"] },
  { id: "warm", label: "Warm Mask", description: "Clear speech with a softer lower tone", appliesTo: ["man", "woman"] },
] as const satisfies readonly BaseScopedOption[];

export function getOptionsForBase<T extends { appliesTo: readonly BaseForm[] }>(options: readonly T[], baseForm: BaseForm | null) {
  if (!baseForm) return [] as T[];
  return options.filter((option) => option.appliesTo.includes(baseForm));
}

export const BASE_FORM_LABELS: Record<BaseForm, string> = { man: "Man", woman: "Woman" };
