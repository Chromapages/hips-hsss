"use client";

import { Loader2, Check } from "lucide-react";

export function AvatarExportMenu({
  saving,
  savingState,
  onCancel,
  handleSaveConfig,
}) {
  const isPending = saving || savingState;

  return (
    <div className="mt-8 pt-4 border-t border-av-border-strong flex items-center justify-end gap-3 font-ui">
      {onCancel && (
        <button
          onClick={onCancel}
          disabled={isPending}
          className="min-h-[44px] rounded-lg px-6 text-xs font-semibold uppercase tracking-wide text-av-text-subtle transition hover:bg-av-bg-input hover:text-av-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4A261] disabled:opacity-50"
          type="button"
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleSaveConfig}
        disabled={isPending}
        className="min-h-[48px] rounded-lg bg-av-accent px-8 text-sm font-bold uppercase tracking-wide text-av-bg-elevated transition hover:bg-av-accent-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD6A5] disabled:opacity-50 flex items-center justify-center gap-2"
        type="button"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}
        {isPending ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  );
}
