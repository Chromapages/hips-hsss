'use client';

import { Lock, ShieldCheck, Headphones, Shuffle } from 'lucide-react';
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
  avatarSeed?: string;
  onAvatarRefresh?: () => void;
}

export function DirectJoinLobby({
  sessionId,
  onJoin,
  allChecked,
  checklist,
  onChecklistChange,
  avatarSeed,
  onAvatarRefresh,
}: DirectJoinLobbyProps) {
  const [displayName, setDisplayName] = useState('');

  const handleJoin = useCallback(() => {
    const name = displayName.trim() || `anon-${Math.random().toString(36).slice(2, 8)}`;
    onJoin(name);
  }, [displayName, onJoin]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
          <Lock className="h-3 w-3 text-indigo-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-300">
            Secure Entry Point
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">Ready to Enter</h2>
        <p className="mt-1 font-mono text-xs text-zinc-500">
          Session: <span className="text-indigo-300">{sessionId}</span>
        </p>
      </div>

      {/* Display name + avatar */}
      <div className="flex items-center gap-4">
        <div className="group relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 font-black text-2xl text-white">
            {avatarSeed ? avatarSeed.slice(0, 2).toUpperCase() : '??'}
          </div>
          {onAvatarRefresh && (
            <button
              onClick={onAvatarRefresh}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 ring-1 ring-white/10 hover:bg-indigo-600 hover:text-white"
              aria-label="Randomise avatar"
            >
              <Shuffle className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Display Handle
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Anonymous handle..."
            maxLength={32}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 Transition-all"
          />
        </div>
      </div>

      {/* Privacy protocols */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Privacy Protocols
        </h3>
        <div className="space-y-3 rounded-xl border border-white/5 bg-zinc-950 p-5">
          <ProtocolCheckbox
            checked={checklist.anonymous}
            onChange={() =>
              onChecklistChange({ ...checklist, anonymous: !checklist.anonymous })
            }
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Handle-only Protocol"
            description="I will not share my real name or physical location."
          />
          <ProtocolCheckbox
            checked={checklist.headphones}
            onChange={() =>
              onChecklistChange({ ...checklist, headphones: !checklist.headphones })
            }
            icon={<Headphones className="h-4 w-4" />}
            label="Aural Isolation"
            description="I am wearing headphones to protect others' privacy."
          />
          <ProtocolCheckbox
            checked={checklist.safeSpace}
            onChange={() =>
              onChecklistChange({ ...checklist, safeSpace: !checklist.safeSpace })
            }
            icon={<Lock className="h-4 w-4" />}
            label="Safe Environment"
            description="I am in a private space where I will not be overheard."
          />
        </div>
      </div>

      {/* Join button */}
      {allChecked ? (
        <button
          onClick={handleJoin}
          className="flex min-h-14 w-full items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.98]"
          type="button"
        >
          Join Session Room
        </button>
      ) : (
        <div className="flex min-h-14 w-full items-center justify-center rounded-xl border border-white/5 bg-white/5 text-sm font-bold text-zinc-500">
          Complete all protocols to join
        </div>
      )}
    </div>
  );
}

function ProtocolCheckbox({
  checked,
  onChange,
  icon,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">{icon}</span>
          <p className="text-sm font-medium text-zinc-200 group-hover:text-white">{label}</p>
        </div>
        <p className="text-xs italic text-zinc-500">{description}</p>
      </div>
    </label>
  );
}