'use client';

import React from 'react';

interface WebGLFallbackProps {
  reason?: string;
}

export function WebGLFallback({ reason }: WebGLFallbackProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black px-4">
      <div className="max-w-md text-center">
        {/* Warning Icon */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            <div className="text-5xl">⚠️</div>
            <div className="absolute -right-1 -top-1 text-2xl">🖥️</div>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-black text-white">
          Graphics Support Required
        </h2>

        {/* Description */}
        <p className="mb-4 text-sm text-slate-400">
          Your browser or device doesn't support WebGL, which is required for 
          the real-time voice visualization and avatar rendering in HIPS sessions.
        </p>

        {/* Reason if provided */}
        {reason && (
          <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              Technical Details
            </p>
            <p className="text-sm text-amber-200">{reason}</p>
          </div>
        )}

        {/* Help Section */}
        <div className="mb-6 space-y-2 text-left rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            What you can try
          </p>
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <span>🔄</span>
            <span>Update your browser to the latest version</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <span>🌐</span>
            <span>Try Chrome or Firefox if using a different browser</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <span>💻</span>
            <span>Enable hardware acceleration in your browser settings</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-300">
            <span>🔌</span>
            <span>Make sure your graphics drivers are up to date</span>
          </div>
        </div>

        {/* Support Link */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="text-sm text-indigo-200">
            🛡️ Your safety and privacy are still protected. Voice masking can still 
            work with fallback audio-only mode on supported devices.
          </p>
        </div>

        {/* Contact Support */}
        <div className="mt-6">
          <p className="text-xs text-slate-500">
            Need help?{' '}
            <a 
              href="mailto:support@hips.foundation" 
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Contact support@hips.foundation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export function checkWebGLSupport(): { supported: boolean; reason?: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { 
        supported: false, 
        reason: 'WebGL context could not be created. This may be due to disabled hardware acceleration or an incompatible graphics card.' 
      };
    }
    
    return { supported: true };
  } catch (e) {
    return { 
      supported: false, 
      reason: 'WebGL check failed with an unexpected error.' 
    };
  }
}

export function useWebGLCheck() {
  return checkWebGLSupport();
}

export default WebGLFallback;