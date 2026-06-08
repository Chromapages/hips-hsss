'use client';

import React from 'react';

interface MobileBlockPageProps {
  onDismiss?: () => void;
}

export function MobileBlockPage({ onDismiss }: MobileBlockPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4 sm:hidden">
      <div className="max-w-sm text-center">
        <div className="mb-6 text-5xl">📱</div>
        <h2 className="mb-3 text-2xl font-extrabold text-white">
          Desktop Required
        </h2>
        <p className="mb-6 text-sm text-text-muted">
          HIPS peer support sessions require a larger screen for the full experience, 
          including real-time voice masking controls and participant video.
        </p>
        <div className="mb-6 space-y-3 rounded-xl border border-white/10 bg-surface/[0.03] p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Session Features
          </p>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span>🎤</span>
            <span>Voice masking with pitch shift</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span>🛡️</span>
            <span>Safety engine monitoring</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span>🔒</span>
            <span>Zero data correlation</span>
          </div>
        </div>
        <p className="mb-6 text-xs text-text-muted">
          Please visit on a desktop or tablet device to join this session.
        </p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full rounded-xl bg-primary py-3 font-bold text-white 
              transition-all hover:bg-primary active:scale-[0.97]
              focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default MobileBlockPage;