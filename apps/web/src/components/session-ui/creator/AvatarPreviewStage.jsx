"use client";

import { useEffect, useRef, useState } from "react";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";
import {
  Undo,
  Redo,
  Download,
  Shuffle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

function GuardianOwlIcon({ className = "" }) {
  return (
    <svg
      role="img"
      aria-label="Guardian Owl mascot"
      className={className}
      viewBox="0 0 80 80"
      fill="none"
    >
      <path d="M12 18L40 8L68 18L56 68H24L12 18Z" fill="#F4A261" />
      <path d="M12 18L32 34L24 68L12 18Z" fill="#E76F51" />
      <path d="M68 18L48 34L56 68L68 18Z" fill="#D98C55" />
      <path d="M32 34L40 8L48 34L40 58L32 34Z" fill="#FFD6A5" />
      <path d="M25 31L36 27L33 40L25 31Z" fill="#242832" />
      <path d="M55 31L44 27L47 40L55 31Z" fill="#242832" />
      <path d="M36 47L40 58L44 47H36Z" fill="#1A1D24" />
    </svg>
  );
}

const BASE_FORM_LABELS = { man: "Man", woman: "Woman" };

function describePreview(config, baseForm, backdrop, accent, privacy) {
  const frame = BASE_FORM_LABELS[baseForm] || "Base form";
  const selectedBackdrop = backdrop || config?.background || "Backdrop";
  const selectedAccent = accent || (config?.accessory ? "accent" : "no accent");
  return { frame, backdrop: selectedBackdrop, accent: selectedAccent, privacy: privacy || "Privacy", caption: `${frame} frame · ${selectedBackdrop.replace(/^bg_/, "").replaceAll("_", " ")} · ${selectedAccent.replaceAll("_", " ")} · ${privacy || "Privacy"}` };
}

export function AvatarPreviewStage({
  deferredAvatar2D,
  baseForm,
  backdrop,
  accent,
  privacy,
  anonymizationMode,
  voicePreset,
  isSpeaking,
  voicePreviewStatus,
  voicePreviewAudioUrl,
  isShuffling,
  canUndo,
  canRedo,
  handleUndo,
  handleRedo,
  handleExportAvatar,
  handleRandomizeAvatar,
  handleResetAvatar,
}) {
  const [compareVersions, setCompareVersions] = useState(false);
  const [previousVersion, setPreviousVersion] = useState(null);
  const latestVersionRef = useRef(deferredAvatar2D);
  const preview = describePreview(deferredAvatar2D, baseForm, backdrop, accent, privacy);
  const maskVisual = anonymizationMode === "neural"
    ? { label: "Enhanced Neural preview", glow: "bg-[#B9A7E8]/14", filter: "saturate-[0.92] contrast-[1.04]" }
    : voicePreset === "deep"
      ? { label: "Deep / Warm mask", glow: "bg-[#88A8D8]/16", filter: "saturate-[0.9] contrast-[1.05] hue-rotate-[3deg]" }
      : voicePreset === "high"
        ? { label: "Bright Veil", glow: "bg-[#B9D9E8]/14", filter: "saturate-[0.96] brightness-[1.03]" }
        : voicePreset === "cyber"
          ? { label: "Cyber Mask", glow: "bg-[#A7D8D0]/14", filter: "saturate-[0.9] contrast-[1.05]" }
          : voicePreset === "custom"
            ? { label: "Custom Mask", glow: "bg-[#C8B7DD]/12", filter: "saturate-[0.98]" }
            : { label: "Soft / Balanced effects", glow: "bg-[#E8B98A]/12", filter: "saturate-[1.03]" };
  useEffect(() => {
    if (latestVersionRef.current !== deferredAvatar2D) {
      setPreviousVersion(latestVersionRef.current);
      latestVersionRef.current = deferredAvatar2D;
    }
  }, [deferredAvatar2D]);
  const moodBackdrop = preview.backdrop.includes("warm") ? "from-[#72563F] via-[#313943] to-[#1C2028]" : preview.backdrop.includes("mint") ? "from-[#36534D] via-[#293B3E] to-[#1C2028]" : preview.backdrop.includes("charcoal") ? "from-[#38344A] via-[#29313C] to-[#1C2028]" : preview.backdrop.includes("rose") ? "from-[#5A414B] via-[#34333E] to-[#1C2028]" : "from-[#4A5962] via-[#303943] to-[#1C2028]";
  const secondaryButtonClass =
    "min-h-[44px] min-w-[92px] flex-1 rounded-lg border border-av-border bg-av-bg-input px-3 text-[11px] font-semibold uppercase tracking-wide text-av-text-secondary transition hover:bg-[#2B303B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4A261] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2";

  return (
    <div className="order-first relative flex self-start flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#3D414A] bg-[#1C2028] p-4 sm:p-6 lg:sticky lg:top-4 lg:z-auto">
      <div className={`w-full max-w-[560px] aspect-square rounded-[24px] overflow-hidden border border-[#665347] relative flex items-center justify-center mb-3 group bg-gradient-to-br ${moodBackdrop} transition-colors duration-500 motion-reduce:transition-none shadow-[0_24px_60px_rgba(5,8,12,0.3)]`}>
        <div aria-hidden="true" className="absolute inset-[7%] rounded-[44%] border border-[#EBC7A4]/10" />
        <div aria-hidden="true" className="absolute inset-[13%] rounded-[42%] border border-[#9AC7C7]/10" />
        <div aria-hidden="true" className="absolute top-[13%] left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#F5C99C]/10 blur-2xl" />
        <div aria-hidden="true" className={`absolute inset-[10%] rounded-full blur-3xl transition-colors duration-500 motion-reduce:transition-none ${maskVisual.glow}`} />
        <div className={`h-[90%] w-[90%] ${compareVersions && previousVersion ? "grid grid-cols-2 gap-1" : "flex items-center justify-center"}`}>
          {compareVersions && previousVersion ? <div className="relative h-full overflow-hidden rounded-l-xl border-r border-av-text-primary/20"><AvatarCompositor config={previousVersion} className="h-full w-[200%] max-w-none -translate-x-1/4 opacity-75 transition-opacity duration-300 motion-reduce:transition-none" /><span className="absolute bottom-2 left-2 rounded bg-av-bg-elevated/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-av-text-secondary">Previous</span></div> : null}
          <div className="relative h-full w-full overflow-hidden"><AvatarCompositor
            config={deferredAvatar2D}
            className={`w-full h-full transition-[transform,opacity,filter] duration-500 ease-out motion-reduce:transition-none ${maskVisual.filter} ${isSpeaking ? "scale-[1.025] motion-reduce:scale-100" : ""}`}
          />{compareVersions && previousVersion ? <span className="absolute bottom-2 right-2 rounded bg-av-bg-elevated/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-av-accent-fg">Current</span> : null}</div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-[#EBC7A4]/25 bg-[#1C2028]/85 px-2.5 py-1.5 shadow-sm backdrop-blur-sm pointer-events-none transition duration-200 group-hover:scale-95">
          <ShieldCheck className="h-3.5 w-3.5 text-[#F4B978]" aria-hidden="true" />
          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#F5D8BB] font-ui">
            Protected persona
          </span>
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-[#B4DDD5]/20 bg-[#1C2028]/85 px-2.5 py-1.5 text-[9px] font-semibold text-[#D4E8E3] backdrop-blur-sm" aria-live="polite">
          Voice-linked · {maskVisual.label}
        </div>
        {isShuffling ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-av-bg-elevated">
            <GuardianOwlIcon className="h-16 w-16" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-av-accent-fg">
              Preparing avatar
            </span>
          </div>
        ) : null}
      </div>

      <div className="mb-4 flex w-full max-w-[560px] flex-col gap-2 rounded-xl border border-av-border bg-av-bg-section px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-av-text-secondary" aria-live="polite" aria-atomic="true">{preview.caption}</p>
        <div><label className="flex min-h-[36px] cursor-pointer items-center gap-2 text-xs font-semibold text-av-accent-fg"><input type="checkbox" className="h-4 w-4 accent-[#F4A261]" checked={compareVersions} disabled={!previousVersion} onChange={(event) => setCompareVersions(event.target.checked)} />Compare recent edits in this session</label><p className="text-[10px] leading-4 text-[#9FA8B5]">Held in this tab only. H.I.P.S. does not create a cross-session edit record.</p></div>
      </div>

      <div className="w-full max-w-[560px]"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-av-text-muted">Avatar actions</p><div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 flex-wrap gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={secondaryButtonClass}
          type="button"
        >
          <Undo className="w-4 h-4" />
          Undo
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={secondaryButtonClass}
          type="button"
        >
          <Redo className="w-4 h-4" />
          Redo
        </button>

        <button
          onClick={handleRandomizeAvatar}
          disabled={isShuffling}
          className={secondaryButtonClass}
          type="button"
        >
          <Shuffle className={`w-4 h-4 ${isShuffling ? "animate-spin motion-reduce:animate-none" : ""}`} />
          Randomize
        </button>
        <button onClick={handleExportAvatar} className={secondaryButtonClass} type="button">
          <Download className="w-4 h-4" />
          Export PNG
        </button>
        </div>
        <div className="border-t border-av-border pt-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
          <button onClick={handleResetAvatar} className={`${secondaryButtonClass} border-[#704A47] text-av-error-fg`} type="button"><RotateCcw className="h-4 w-4" />Reset</button>
        </div>
      </div></div>

      {voicePreviewStatus ? (
        <div className="mt-3 w-full max-w-[420px] rounded-lg border border-av-warn-border-soft bg-av-warn-bg px-3 py-2 text-center text-[11px] font-body text-av-accent-fg">
          <div>{voicePreviewStatus}</div>
          {voicePreviewAudioUrl ? (
            <audio
              className="mt-2 w-full"
              controls
              src={voicePreviewAudioUrl}
            />
          ) : null}
        </div>
      ) : null}

    </div>
  );
}
