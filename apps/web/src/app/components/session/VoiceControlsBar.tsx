'use client';

import React from 'react';

interface VoiceControlsBarProps {
  isMuted: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleHand: () => void;
  onFlag: () => void;
  onLeave: () => void;
}

export function VoiceControlsBar({
  isMuted,
  isHandRaised,
  onToggleMute,
  onToggleHand,
  onFlag,
  onLeave,
}: VoiceControlsBarProps) {
  return (
    <footer className="flex items-center justify-center px-4 sm:px-6 py-4 sm:py-5 border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-3xl border border-white/10 bg-white/[0.03]">
        {/* Mute button */}
        <button
          id="btn-mute"
          onClick={onToggleMute}
          aria-label="Toggle microphone mute"
          aria-pressed={isMuted}
          className={`
            flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-2xl border border-white/10 font-bold transition-all 
            hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${isMuted 
              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
              : 'border-white/10 text-white hover:bg-white/10'
            }
          `}
        >
          <span id="mic-icon" className="text-lg sm:text-xl">
            {isMuted ? '🔇' : '🎤'}
          </span>
          <span id="mic-label" className="text-sm sm:text-base">
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </button>

        {/* Raise hand button */}
        <button
          id="btn-hand"
          onClick={onToggleHand}
          aria-label="Raise hand for facilitator attention"
          aria-pressed={isHandRaised}
          className={`
            flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-2xl border font-bold transition-all 
            hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500
            ${isHandRaised 
              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200' 
              : 'border-white/10 text-white hover:bg-white/10'
            }
          `}
        >
          <span className="text-lg sm:text-xl">✋</span>
          <span className="text-sm sm:text-base">
            {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
          </span>
        </button>

        {/* Flag button */}
        <button
          onClick={onFlag}
          aria-label="Flag a safety concern"
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl border border-white/10 font-bold transition-all 
            hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500
            text-white"
        >
          <span className="text-lg sm:text-xl">🚨</span>
          <span className="text-sm sm:text-base">Flag</span>
        </button>

        {/* Leave button */}
        <button
          onClick={onLeave}
          aria-label="Leave the session"
          className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 
            rounded-xl bg-red-600 text-white font-bold transition-all 
            hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500
            ml-0 sm:ml-3 leave-btn"
        >
          <span className="text-lg sm:text-xl">📞</span>
          <span className="text-sm sm:text-base">Leave</span>
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding-bottom: env(safe-area-inset-bottom);
          }
          
          footer .flex.gap-2,
          footer .flex.gap-3 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            width: 100%;
            padding: 0.5rem;
          }
          
          footer .leave-btn {
            grid-column: span 2;
            margin-left: 0 !important;
            margin-top: 0.25rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default VoiceControlsBar;