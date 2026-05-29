'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';

export type SessionExitStateProps = {
  actionLabel: string;
  description: string;
  icon: 'danger' | 'warning';
  onAction: () => void;
  title: string;
};

export function SessionExitState({
  actionLabel,
  description,
  icon,
  onAction,
  title,
}: SessionExitStateProps) {
  const Icon = icon === 'danger' ? ShieldAlert : AlertTriangle;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
        <Icon className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 max-w-md text-zinc-400">{description}</p>
      <button
        className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-medium text-white shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-500"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </button>
    </div>
  );
}