import type { Avatar2DConfig } from "@hips/types";

export const MAN_HAIR_STYLES = ["hair_short_01", "hair_curly_tight_01", "hair_locs_long_01", "hair_shaved_01"];
export const WOMAN_HAIR_STYLES = [
  "hair_long_01",
  "hair_bob_01",
  "hair_bun_01",
  "hair_curly_tight_01",
  "hair_locs_long_01",
  "cover_hijab_01",
  "hair_pixie_01",
  "hair_waves_01",
  "hair_spacebuns_01",
];

export const hairColors = [
  { hex: "#1c1917", label: "Charcoal" },
  { hex: "#292524", label: "Dark Brown" },
  { hex: "#44403c", label: "Medium Brown" },
  { hex: "#78716c", label: "Auburn" },
  { hex: "#f5d0a9", label: "Sand" },
];

export const clothingColors = [
  { hex: "#173B57", label: "Navy" },
  { hex: "#C59A35", label: "Gold" },
  { hex: "#10B981", label: "Emerald" },
  { hex: "#FBBF24", label: "Amber" },
  { hex: "#EF4444", label: "Crimson" },
  { hex: "#06B6D4", label: "Cyan" },
  { hex: "#8B5CF6", label: "Violet" },
  { hex: "#F43F5E", label: "Rose" },
  { hex: "#111827", label: "Ink" },
  { hex: "#F8FAFC", label: "Cloud" },
  { hex: "#FB7185", label: "Coral" },
  { hex: "#A3E635", label: "Lime" },
];

export const eyeColors = [
  { hex: "#1c1917", label: "Black" },
  { hex: "#3f2d20", label: "Brown" },
  { hex: "#6b7280", label: "Gray" },
  { hex: "#2563eb", label: "Blue" },
  { hex: "#059669", label: "Green" },
  { hex: "#a16207", label: "Amber" },
  { hex: "#7c3aed", label: "Violet" },
  { hex: "#be123c", label: "Rose" },
] as const;

export const voicePresets = [
  { id: "subtle", label: "Subtle", semitones: -2, description: "Slight pitch down — natural and calm cover" },
  { id: "deep", label: "Deep", semitones: -6, description: "Voice Shield — deep, anonymous register" },
  { id: "high", label: "High", semitones: 6, description: "Bright Veil — high, light register" },
  { id: "cyber", label: "Cyber", semitones: -2, description: "Robotic synthesis — ring modulation anonymiser" },
  { id: "custom", label: "Custom", semitones: 0, description: "Set your own semitone shift" },
];

export const pickRandom = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]!;

export interface HistoryState {
  past: Avatar2DConfig[];
  present: Avatar2DConfig;
  future: Avatar2DConfig[];
}

export type HistoryAction =
  | { type: "SET"; config: Avatar2DConfig }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; config: Avatar2DConfig };

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case "UNDO": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1]!;
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }
    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0]!;
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }
    case "SET": {
      if (JSON.stringify(action.config) === JSON.stringify(state.present)) {
        return state;
      }
      return {
        past: [...state.past, state.present],
        present: action.config,
        future: [],
      };
    }
    case "RESET": {
      return {
        past: [],
        present: action.config,
        future: [],
      };
    }
    default:
      return state;
  }
}
