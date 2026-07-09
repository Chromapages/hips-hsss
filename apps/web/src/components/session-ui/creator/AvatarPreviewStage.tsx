"use client";

import type { Avatar2DConfig } from "@hips/types";
import { AvatarCompositor } from "@/components/avatar/AvatarCompositor";
import {
  Undo,
  Redo,
  Share2,
  Download,
  Shuffle,
  RotateCcw,
} from "lucide-react";

interface AvatarPreviewStageProps {
  deferredAvatar2D: Avatar2DConfig;
  isSpeaking: boolean;
  voiceLevel: number;
  isPreviewing: boolean;
  voicePreviewStatus: string | null;
  voicePreviewAudioUrl: string | null;
  isShuffling: boolean;
  canUndo: boolean;
  canRedo: boolean;
  handlePreviewVoice: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleShareAvatar: () => void;
  handleExportAvatar: () => void;
  handleRandomizeAvatar: () => void;
  handleResetAvatar: () => void;
}

export function AvatarPreviewStage({
  deferredAvatar2D,
  isSpeaking,
  voiceLevel,
  isPreviewing,
  voicePreviewStatus,
  voicePreviewAudioUrl,
  isShuffling,
  canUndo,
  canRedo,
  handlePreviewVoice,
  handleUndo,
  handleRedo,
  handleShareAvatar,
  handleExportAvatar,
  handleRandomizeAvatar,
  handleResetAvatar,
}: AvatarPreviewStageProps) {
  return (
    <div className="lg:col-span-3 flex flex-col items-center justify-center bg-zinc-950/40 rounded-3xl p-5 border border-white/5 relative">
      <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-white/10 relative shadow-2xl flex items-center justify-center mb-6 group">
        <div className="w-[90%] h-[90%] flex items-center justify-center">
          <AvatarCompositor
            config={deferredAvatar2D}
            className={`w-full h-full transition-transform duration-300 ${isSpeaking ? "scale-105" : ""}`}
          />
        </div>
        <div className="absolute top-3 left-3 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg pointer-events-none transition duration-200 group-hover:scale-95">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-ui">
            Custom 2D Preview
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
        {/* Quick speaking test button */}
        <button
          onClick={handlePreviewVoice}
          className={`py-2 px-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider font-ui transition-all ${
            isPreviewing
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : isSpeaking
                ? "border-accent bg-accent/20 text-accent"
                : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
          }`}
          type="button"
          aria-label={isPreviewing ? "Stop voice test" : `Test speech, current voice activity ${Math.round(voiceLevel * 100)} percent`}
        >
          {isPreviewing ? "Stop Test" : isSpeaking ? "Voice Ok" : "Voice Test"}
        </button>

        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
          type="button"
        >
          <Undo className="w-3 h-3" />
          Undo
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1 disabled:opacity-30 disabled:pointer-events-none"
          type="button"
        >
          <Redo className="w-3 h-3" />
          Redo
        </button>

        <button
          onClick={handleShareAvatar}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
          type="button"
        >
          <Share2 className="w-3 h-3" />
          Share
        </button>
        <button
          onClick={handleExportAvatar}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
          type="button"
        >
          <Download className="w-3 h-3" />
          Export
        </button>
        <button
          onClick={handleRandomizeAvatar}
          disabled={isShuffling}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
          type="button"
        >
          <Shuffle className={`w-3 h-3 ${isShuffling ? "animate-spin" : ""}`} />
          Random
        </button>
        <button
          onClick={handleResetAvatar}
          className="py-2 px-1 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider font-ui transition-all flex items-center justify-center gap-1"
          type="button"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {voicePreviewStatus ? (
        <div className="mt-3 w-full max-w-[560px] rounded-xl border border-accent/25 bg-accent/10 px-3 py-2 text-center text-[11px] font-body text-accent">
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
