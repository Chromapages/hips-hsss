import { create } from "zustand";
import type { BaseForm } from "./avatarOptions";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type WizardState = {
  step: WizardStep;
  baseForm: BaseForm | null;
  backdrop: string | null;
  accent: string | null;
  privacy: string | null;
  voiceMode: string | null;
  styleNeedsReview: boolean;
  setStep: (step: WizardStep) => void;
  setBaseForm: (baseForm: BaseForm) => void;
  setBackdrop: (backdrop: string | null) => void;
  setAccent: (accent: string | null) => void;
  setPrivacy: (privacy: string | null) => void;
  setVoiceMode: (voiceMode: string | null) => void;
  reset: () => void;
};

const initialState = {
  step: 1 as WizardStep,
  baseForm: null,
  backdrop: null,
  accent: null,
  privacy: null,
  voiceMode: null,
  styleNeedsReview: false,
};

// Deliberately no persist middleware: setup remains in memory for this tab only.
export const useWizardStore = create<WizardState>()((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setBaseForm: (baseForm) => set((state) => state.baseForm === baseForm ? { baseForm } : {
    baseForm,
    backdrop: null,
    accent: null,
    privacy: null,
    voiceMode: null,
    styleNeedsReview: Boolean(state.backdrop || state.accent),
  }),
  setBackdrop: (backdrop) => set({ backdrop, styleNeedsReview: false }),
  setAccent: (accent) => set({ accent, styleNeedsReview: false }),
  setPrivacy: (privacy) => set({ privacy }),
  setVoiceMode: (voiceMode) => set({ voiceMode }),
  reset: () => set(initialState),
}));
