"use client";

import { Loader2, Check } from "lucide-react";

interface AvatarExportMenuProps {
  saving: boolean;
  savingState: boolean;
  onCancel?: (() => void) | undefined;
  handleSaveConfig: () => void;
}

export function AvatarExportMenu({
  saving,
  savingState,
  onCancel,
  handleSaveConfig,
}: AvatarExportMenuProps) {
  const isPending = saving || savingState;

  return (
    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3 font-ui">
      {onCancel && (
        <button
          onClick={onCancel}
          disabled={isPending}
          className="py-3 px-6 rounded-xl text-white/70 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
          type="button"
        >
          Cancel
        </button>
      )}
      <button
        onClick={handleSaveConfig}
        disabled={isPending}
        className="py-3 px-8 rounded-xl bg-accent text-white hover:bg-accent/90 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-accent/25 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
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
