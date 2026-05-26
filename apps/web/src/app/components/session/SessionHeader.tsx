'use client';

import React from 'react';

interface SessionHeaderProps {
  sessionId: string;
  anonId: string;
}

export function SessionHeader({ sessionId, anonId }: SessionHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div>
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
          Anonymous Room
        </p>
        <p id="session-anon-id" className="font-mono text-sm text-indigo-300">
          {anonId}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
        <span className="text-lg">🛡️</span>
        <span className="hidden xs:inline">Safety Engine Active</span>
      </div>

      <div className="text-right">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
          Room
        </p>
        <p className="font-mono text-xs text-slate-400">{sessionId}</p>
      </div>
    </header>
  );
}

export default SessionHeader;