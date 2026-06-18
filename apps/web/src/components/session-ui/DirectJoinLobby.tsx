'use client';

import { Lock, ShieldCheck, Headphones, Shuffle, Loader2 } from 'lucide-react';
import { useState, useCallback } from 'react';

interface ChecklistState {
  anonymous: boolean;
  headphones: boolean;
  safeSpace: boolean;
}

interface DirectJoinLobbyProps {
  sessionId: string;
  onJoin: (displayName: string) => void;
  allChecked: boolean;
  checklist: ChecklistState;
  onChecklistChange: (checklist: ChecklistState) => void;
  avatarInitials?: string;
  onAvatarRefresh?: () => void;
  isJoining?: boolean;
  isPreparing?: boolean;
}

export function DirectJoinLobby({
  sessionId,
  onJoin,
  allChecked,
  checklist,
  onChecklistChange,
  avatarInitials,
  onAvatarRefresh,
  isJoining = false,
  isPreparing = false,
}: DirectJoinLobbyProps) {
  const [displayName, setDisplayName] = useState('');

  const handleJoin = useCallback(() => {
    if (isJoining) return;
    const name = displayName.trim() || `anon-${Math.random().toString(36).slice(2, 8)}`;
    onJoin(name);
  }, [displayName, onJoin, isJoining]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1">
          <Lock className="h-3 w-3 text-accent" />
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            Secure Entry Point
          </span>
        </div>
        <h2 className="text-2xl font-bold text-primary">Ready to Enter</h2>
        <p className="mt-1 text-xs text-text-muted">
          Session: <span className="font-mono text-accent">{sessionId}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="group relative">
          {isPreparing ? (
            <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-zinc-800" />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent font-bold text-2xl text-primary-foreground shadow-sm shadow-primary/20"
              role="img"
              aria-label={`Lobby initials: ${avatarInitials || '??'}`}
            >
              {avatarInitials || '??'}
            </div>
          )}
          {onAvatarRefresh && !isPreparing && (
            <button
              onClick={onAvatarRefresh}
              className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full bg-background text-text-secondary ring-1 ring-border transition-colors hover:bg-accent hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Randomise initials"
              type="button"
            >
              <Shuffle className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="display-handle"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Display Handle
          </label>
          <input
            id="display-handle"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Anonymous handle..."
            maxLength={32}
            disabled={isJoining}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Privacy Protocols
        </legend>
        <div className="space-y-3 rounded-xl border border-border bg-background p-5">
          <ProtocolCheckbox
            id="check-anonymous"
            checked={checklist.anonymous}
            onChange={() =>
              onChecklistChange({ ...checklist, anonymous: !checklist.anonymous })
            }
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Handle-only Protocol"
            description="I will not share my real name or physical location."
          />
          <ProtocolCheckbox
            id="check-headphones"
            checked={checklist.headphones}
            onChange={() =>
              onChecklistChange({ ...checklist, headphones: !checklist.headphones })
            }
            icon={<Headphones className="h-4 w-4" />}
            label="Aural Isolation"
            description="I am wearing headphones to protect others' privacy."
          />
          <ProtocolCheckbox
            id="check-safespace"
            checked={checklist.safeSpace}
            onChange={() =>
              onChecklistChange({ ...checklist, safeSpace: !checklist.safeSpace })
            }
            icon={<Lock className="h-4 w-4" />}
            label="Safe Environment"
            description="I am in a private space where I will not be overheard."
          />
        </div>
      </fieldset>

      {isJoining ? (
        <div className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Entering the room…
        </div>
      ) : allChecked ? (
        <button
          onClick={handleJoin}
          disabled={isPreparing}
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60"
          type="button"
        >
          {isPreparing ? 'Preparing…' : 'Join Session Room'}
        </button>
      ) : (
        <div
          role="status"
          className="flex min-h-14 w-full items-center justify-center rounded-xl border border-dashed border-border bg-background text-sm font-bold text-text-muted"
        >
          Complete all protocols to join
        </div>
      )}
    </div>
  );
}

function ProtocolCheckbox({
  id,
  checked,
  onChange,
  icon,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-border bg-background text-accent focus:ring-accent"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-text-muted">{icon}</span>
          <p className="text-sm font-medium text-primary group-hover:text-primary-dark">{label}</p>
        </div>
        <p className="text-xs italic text-text-muted">{description}</p>
      </div>
    </label>
  );
}
