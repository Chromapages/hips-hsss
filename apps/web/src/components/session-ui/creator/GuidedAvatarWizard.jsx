"use client";

import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Mars, Venus } from "lucide-react";
import { toast } from "sonner";
import { avatar2DOptions } from "@/lib/avatar-asset-registry";
import { BASE_FORM_LABELS, accentOptions, backdropOptions, getOptionsForBase, privacyOptions, voiceOptions } from "./avatarOptions";
import { useWizardStore } from "./wizardStore";
import { HairPanel } from "./HairPanel";
import { FacePanel } from "./FacePanel";
import { WardrobePanel } from "./WardrobePanel";
import { BrowserVoiceTest } from "./BrowserVoiceTest";

const BASE_FORM_OPTIONS = [
  { id: "man", label: "Man", description: "Masculine silhouette", Icon: Mars },
  { id: "woman", label: "Woman", description: "Feminine silhouette", Icon: Venus },
];

const STEP_LABELS = ["Base", "Face", "Backdrop", "Wardrobe", "Privacy", "Voice", "Done"];
const STEP_TITLES = [
  "",
  "Choose a base form",
  "Shape the face",
  "Set the backdrop",
  "Choose wardrobe and accessories",
  "Set a privacy level",
  "Hear your masked voice",
  "Review your protected setup",
];
const stepNames = { base: 1, face: 2, backdrop: 3, wardrobe: 4, privacy: 5, voice: 6, done: 7 };
const stepSlugs = ["", "base", "face", "backdrop", "wardrobe", "privacy", "voice", "done"];
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD6A5] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#FFD6A5]";

function canAccessStep(step, state) {
  if (step === 1) return true;
  if (!state.baseForm) return false;
  if (step <= 3) return true;
  if (!state.backdrop) return false;
  if (step === 4) return true;
  if (!state.accent) return false;
  if (step === 5) return true;
  if (!state.privacy) return false;
  if (step === 6) return true;
  return state.voiceComplete;
}

function findLabel(options, id, fallback) {
  return options.find((option) => option.id === id)?.label || fallback || id || "Not selected";
}

function ChoiceCards({ name, options, value, onChange, prompt, compact = false }) {
  return (
    <>
      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
        {options.map((option) => (
          <label key={option.id} className={`flex min-h-[76px] cursor-pointer flex-col justify-center rounded-xl border p-3 transition-colors motion-reduce:transition-none ${focus} ${value === option.id ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : "border-av-border bg-av-bg-input text-av-text-secondary hover:border-av-accent"}`}>
            <input className="sr-only" type="radio" name={name} value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} aria-label={`${option.label}, ${option.description}`} />
            <span className="text-sm font-bold">{option.label}</span>
            <span className="mt-1 text-xs font-normal leading-5 text-av-text-muted">{option.description}</span>
          </label>
        ))}
      </div>
      {!value && <p id={`${name}-prompt`} className="mt-3 text-xs font-medium text-av-accent-fg">{prompt}</p>}
    </>
  );
}

function SummaryBlock({ title, items, onEdit }) {
  return (
    <section className="rounded-xl border border-av-border bg-av-bg-input p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-av-text-primary">{title}</h3>
        <button type="button" onClick={onEdit} className={`hips-action-secondary min-h-[36px] rounded-lg border px-3 text-xs font-semibold ${focus}`}>Edit</button>
      </div>
      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="font-semibold text-av-text-muted">{label}</dt>
            <dd className="mt-0.5 text-av-text-secondary">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function GuidedAvatarWizard(props) {
  const { avatar2D, bodyType, setLocalAvatar2D, setAvatarConfig, chooseBaseForm, chooseBackdrop, chooseAccent, onSave, saving, showVoice, voiceProps, onSessionSetupChange } = props;
  const step = useWizardStore((state) => state.step);
  const baseForm = useWizardStore((state) => state.baseForm);
  const backdrop = useWizardStore((state) => state.backdrop);
  const accent = useWizardStore((state) => state.accent);
  const privacy = useWizardStore((state) => state.privacy);
  const voiceMode = useWizardStore((state) => state.voiceMode);
  const styleNeedsReview = useWizardStore((state) => state.styleNeedsReview);
  const setStep = useWizardStore((state) => state.setStep);
  const setBaseForm = useWizardStore((state) => state.setBaseForm);
  const setBackdrop = useWizardStore((state) => state.setBackdrop);
  const setAccent = useWizardStore((state) => state.setAccent);
  const setPrivacy = useWizardStore((state) => state.setPrivacy);
  const setVoiceMode = useWizardStore((state) => state.setVoiceMode);
  const [voiceSetup, setVoiceSetup] = useState({ status: "not-started", complete: false, presetLabel: "Soft Mask" });
  const [direction, setDirection] = useState(1);
  const headingRef = useRef(null);
  const guardedStepRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const options = useMemo(() => ({
    backdrop: getOptionsForBase(backdropOptions, baseForm),
    accent: getOptionsForBase(accentOptions, baseForm),
    privacy: getOptionsForBase(privacyOptions, baseForm),
    voice: getOptionsForBase(voiceOptions, baseForm),
  }), [baseForm]);
  const avatarComplete = Boolean(baseForm && backdrop && accent && privacy);
  const voiceComplete = !showVoice || Boolean(voiceMode);
  const state = { baseForm, backdrop, accent, privacy, voiceMode, voiceComplete };
  const activeStep = canAccessStep(step, state) ? step : 1;

  const writeStepToUrl = (nextStep, replace = false) => {
    const url = new URL(window.location.href);
    if (nextStep === 1) url.searchParams.delete("step");
    else url.searchParams.set("step", stepSlugs[nextStep]);
    window.history[replace ? "replaceState" : "pushState"]({}, "", url);
  };
  const redirectToBase = () => {
    setDirection(-1);
    setStep(1);
    writeStepToUrl(1, true);
    toast.error("Choose a base form to continue");
  };
  const navigate = (nextStep, replace = false) => {
    if (!canAccessStep(nextStep, state)) {
      if (!baseForm) redirectToBase();
      return;
    }
    setDirection(nextStep >= activeStep ? 1 : -1);
    setStep(nextStep);
    writeStepToUrl(nextStep, replace);
  };

  useEffect(() => {
    const readStepFromUrl = () => {
      const requested = stepNames[new URLSearchParams(window.location.search).get("step") || "base"] || 1;
      const wizardState = useWizardStore.getState();
      const requestedState = { ...wizardState, voiceComplete: !showVoice || Boolean(wizardState.voiceMode) };
      if (!canAccessStep(requested, requestedState)) {
        if (!wizardState.baseForm && guardedStepRef.current !== requested) {
          guardedStepRef.current = requested;
          redirectToBase();
        }
        return;
      }
      guardedStepRef.current = null;
      setDirection(requested >= wizardState.step ? 1 : -1);
      setStep(requested);
    };
    readStepFromUrl();
    window.addEventListener("popstate", readStepFromUrl);
    return () => window.removeEventListener("popstate", readStepFromUrl);
  // Navigation listener intentionally reads current store state rather than rerunning on each selection.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, [activeStep]);
  useEffect(() => {
    onSessionSetupChange?.({
      avatarComplete,
      voiceComplete,
      sessionReady: avatarComplete && voiceComplete,
      summary: `${baseForm ? BASE_FORM_LABELS[baseForm] : "Base"} · ${backdrop || "Backdrop"} · ${accent || "Wardrobe"} · ${privacy || "Privacy"} · ${voiceSetup.status === "skipped" ? "Voice skipped" : voiceSetup.presetLabel}`,
    });
  }, [accent, avatarComplete, backdrop, baseForm, onSessionSetupChange, privacy, voiceComplete, voiceSetup.presetLabel, voiceSetup.status]);

  const selectBase = (id) => { setBaseForm(id); chooseBaseForm(id); };
  const selectBackdrop = (id) => { setBackdrop(id); chooseBackdrop(id); };
  const selectAccent = (id) => { setAccent(id); chooseAccent(id); };
  const selectPrivacy = (id) => setPrivacy(id);
  const onVoiceConfigurationChange = useCallback((configuration) => {
    setVoiceSetup(configuration);
    setVoiceMode(configuration.complete ? (configuration.status === "skipped" ? "skipped" : configuration.presetId) : null);
  }, [setVoiceMode]);
  const currentStepValid = activeStep === 1 ? Boolean(baseForm) : activeStep === 3 ? Boolean(backdrop) : activeStep === 4 ? Boolean(accent) : activeStep === 5 ? Boolean(privacy) : activeStep === 6 ? voiceComplete : true;
  const goForward = () => navigate(Math.min(7, activeStep + 1));
  const animation = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } }
    : { initial: { opacity: 0, x: direction * 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: direction * -18 }, transition: { duration: 0.18, ease: "easeOut" } };
  const context = <p className="mt-1 text-sm text-av-text-muted">Showing options for: <strong className="text-av-text-secondary">{baseForm ? BASE_FORM_LABELS[baseForm] : "your selection"}</strong></p>;

  const renderStep = () => {
    if (activeStep === 1) {
      return (
        <div className="space-y-6">
          <fieldset>
            <legend className="text-sm font-semibold text-av-text-secondary">Choose a base form</legend>
            <p className="mt-1 text-sm text-av-text-muted">Choose the silhouette that matches your persona.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BASE_FORM_OPTIONS.map(({ id, label, description, Icon }) => (
                <label key={id} className={`min-h-[76px] cursor-pointer rounded-xl border p-4 transition-colors motion-reduce:transition-none ${focus} ${baseForm === id ? "border-av-accent bg-av-bg-accent" : "border-av-border bg-av-bg-input hover:border-av-accent"}`}>
                  <input className="sr-only" type="radio" name="baseForm" value={id} checked={baseForm === id} onChange={() => selectBase(id)} aria-label={`${label}, ${description}`} />
                  <span className="flex items-center gap-3"><Icon className="h-5 w-5 shrink-0 text-av-accent" aria-hidden="true" /><span><span className="block text-sm font-medium text-av-text-primary">{label}</span><span className="mt-1 block text-sm text-av-text-muted">{description}</span></span></span>
                </label>
              ))}
            </div>
            {!baseForm && <p id="base-form-prompt" className="mt-3 text-xs font-medium text-av-accent-fg">Choose a base form to continue.</p>}
          </fieldset>
          {baseForm && <HairPanel bodyType={bodyType} avatar2D={avatar2D} setLocalAvatar2D={setLocalAvatar2D} skinOffset={props.skinOffset} setSkinOffset={props.setSkinOffset} />}
        </div>
      );
    }
    if (activeStep === 2) {
      return <div>{context}<FacePanel bodyType={bodyType} avatar2D={avatar2D} setLocalAvatar2D={setLocalAvatar2D} setAvatarConfig={setAvatarConfig} /></div>;
    }
    if (activeStep === 3) {
      return <fieldset><legend className="text-sm font-semibold text-av-text-secondary">Choose a backdrop</legend>{context}<ChoiceCards name="backdrop" options={options.backdrop} value={backdrop} onChange={selectBackdrop} prompt="Choose a backdrop to continue." compact /></fieldset>;
    }
    if (activeStep === 4) {
      return <div className="space-y-6"><fieldset><legend className="text-sm font-semibold text-av-text-secondary">Choose an accessory</legend>{context}<ChoiceCards name="wardrobe-accessory" options={options.accent} value={accent} onChange={selectAccent} prompt="Choose an accessory option to continue." compact /></fieldset><WardrobePanel bodyType={bodyType} avatar2D={avatar2D} setLocalAvatar2D={setLocalAvatar2D} /></div>;
    }
    if (activeStep === 5) {
      return <fieldset><legend className="text-sm font-semibold text-av-text-secondary">Set a privacy level</legend>{context}<ChoiceCards name="privacy-level" options={options.privacy} value={privacy} onChange={selectPrivacy} prompt="Choose a privacy level to continue." /></fieldset>;
    }
    if (activeStep === 6 && showVoice) {
      return (
        <div>
          {context}
          <BrowserVoiceTest semitones={voiceProps.semitones} suggestedPresetId="soft" allowedPresetIds={options.voice.map((option) => option.id)} onConfigurationChange={onVoiceConfigurationChange} onPresetChange={(preset) => setAvatarConfig({ voicePreset: preset.legacyPreset, semitones: preset.semitones, reverbLevel: preset.reverbLevel })} />
          {!voiceComplete && <p id="voice-prompt" className="mt-3 text-xs font-medium text-av-accent-fg">Finish the voice test or choose Continue without voice test.</p>}
        </div>
      );
    }
    if (activeStep === 6) {
      return <div className="rounded-xl border border-av-border bg-av-bg-input p-5 text-sm text-av-text-secondary">Voice setup is unavailable for this session. Continue when you are ready.</div>;
    }
    return (
      <div className="space-y-4 rounded-2xl border border-av-success-border bg-av-success-bg p-5">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-av-success-fg/15 text-av-success-fg" aria-hidden="true"><Check className="h-7 w-7" /></span>
          <h2 className="hips-section-h2 mt-4 text-av-text-primary">Ready when you are</h2>
          <p className="mt-2 text-sm leading-6 text-av-text-subtle">Review every choice, jump back to edit any section, then save this setup for the demo.</p>
        </div>
        <SummaryBlock title="Base" onEdit={() => navigate(1)} items={[
          ["Silhouette", baseForm ? BASE_FORM_LABELS[baseForm] : "Not selected"],
          ["Hair style", findLabel(avatar2DOptions.hairStyles, avatar2D.hairStyle)],
          ["Skin tone", avatar2D.skinTone],
        ]} />
        <SummaryBlock title="Face" onEdit={() => navigate(2)} items={[
          ["Hair color", avatar2D.hairColor],
          ["Brows", findLabel(avatar2DOptions.eyebrows, avatar2D.eyebrow)],
          ["Mouth", findLabel(avatar2DOptions.mouths, avatar2D.mouth)],
          ["Facial hair", findLabel(avatar2DOptions.facialHair, avatar2D.facialHair, "None")],
          ["Expression", findLabel(avatar2DOptions.expressions, avatar2D.expression)],
        ]} />
        <SummaryBlock title="Backdrop" onEdit={() => navigate(3)} items={[["Backdrop", findLabel(backdropOptions, backdrop)]]} />
        <SummaryBlock title="Wardrobe" onEdit={() => navigate(4)} items={[
          ["Accessory", findLabel(accentOptions, accent)],
          ["Clothing style", findLabel(avatar2DOptions.clothing, avatar2D.clothingStyle)],
          ["Clothing color", avatar2D.clothingColor],
        ]} />
        <SummaryBlock title="Privacy" onEdit={() => navigate(5)} items={[["Privacy level", findLabel(privacyOptions, privacy)]]} />
        <SummaryBlock title="Voice" onEdit={() => navigate(6)} items={[
          ["Voice test", voiceSetup.status === "skipped" ? "Skipped" : voiceSetup.complete ? voiceSetup.presetLabel : "Needs attention"],
        ]} />
        <button type="button" onClick={onSave} disabled={saving} className={`hips-action-primary min-h-[48px] w-full rounded-lg px-4 text-sm font-bold disabled:opacity-45 ${focus}`}>{saving ? "Saving setup..." : "Save protected setup"}</button>
      </div>
    );
  };

  const promptId = activeStep === 1 && !baseForm ? "base-form-prompt" : activeStep === 3 && !backdrop ? "backdrop-prompt" : activeStep === 4 && !accent ? "wardrobe-accessory-prompt" : activeStep === 5 && !privacy ? "privacy-level-prompt" : activeStep === 6 && !voiceComplete ? "voice-prompt" : undefined;

  return (
    <MotionConfig reducedMotion="user">
      <section className="min-w-0 rounded-2xl border border-av-border-strong bg-av-bg-elevated p-4 pb-28 sm:p-6 sm:pb-28 lg:pb-6" aria-labelledby="avatar-wizard-title">
        <p className="hips-eyebrow">Create a protected persona</p>
        <h1 ref={headingRef} tabIndex={-1} id="avatar-wizard-title" className={`hips-section-h2 mt-2 text-av-text-primary ${focus}`}>{STEP_TITLES[activeStep]}</h1>
        <ol className="sticky top-0 z-20 mt-5 grid grid-cols-2 gap-1 border-y border-av-border bg-av-bg-elevated py-3 sm:grid-cols-4 xl:grid-cols-7" aria-label="Setup progress">
          {STEP_LABELS.map((label, index) => {
            const value = index + 1;
            const complete = value === 1 ? Boolean(baseForm) : value === 2 ? Boolean(baseForm) : value === 3 ? Boolean(backdrop) : value === 4 ? Boolean(accent) : value === 5 ? Boolean(privacy) : value === 6 ? voiceComplete : avatarComplete && voiceComplete;
            const current = activeStep === value;
            const locked = !canAccessStep(value, state);
            const stale = value === 3 && styleNeedsReview;
            return (
              <li key={label} aria-current={current ? "step" : undefined} className="min-w-0">
                <button type="button" disabled={locked} onClick={() => navigate(value)} aria-label={`Step ${value}: ${label}${stale ? ", needs review" : current ? ", current" : complete ? ", complete" : locked ? ", locked" : ", available"}`} className={`hips-pill relative flex min-h-[52px] w-full flex-col items-center justify-center border text-center transition-colors motion-reduce:transition-none ${focus} ${current ? "border-av-accent bg-av-bg-accent text-av-accent-fg" : complete ? "border-av-success-border bg-av-success-bg text-av-success-fg" : locked ? "border-av-border-strong text-av-text-muted opacity-60" : "border-av-border text-av-text-secondary"}`}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px]" aria-hidden="true">{complete ? <Check className="h-3 w-3" /> : value}</span>
                  <span className="mt-1 whitespace-nowrap text-[11px]">{label}</span>
                  {stale && <AlertTriangle className="absolute right-1 top-1 h-3 w-3 text-av-accent" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 min-h-[340px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={activeStep} {...animation}>{renderStep()}</motion.div>
          </AnimatePresence>
        </div>
        {activeStep < 7 && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-av-border-strong bg-av-bg-elevated/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:static lg:mt-6 lg:border-0 lg:bg-transparent lg:p-0">
            <div className="flex gap-2">
              <button type="button" disabled={activeStep === 1} onClick={() => navigate(activeStep - 1)} className={`hips-action-secondary min-h-[48px] rounded-lg border px-4 text-sm font-semibold disabled:opacity-40 ${focus}`}><ChevronLeft className="mr-1 inline h-4 w-4" />Back</button>
              <button type="button" onClick={goForward} disabled={!currentStepValid} aria-describedby={promptId} className={`hips-action-primary min-h-[48px] flex-1 rounded-lg px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-45 ${focus}`}>Continue<ChevronRight className="ml-1 inline h-4 w-4" /></button>
            </div>
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
