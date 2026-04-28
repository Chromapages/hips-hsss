'use client';

import { useState } from 'react';
import { Mic, Volume2, ShieldCheck, Lock, Headphones, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface LobbyClientProps {
  groupId: string;
}

export function LobbyClient({ groupId }: LobbyClientProps) {
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({
    anonymous: false,
    headphones: false,
    safeSpace: false
  });

  const handleTestMic = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setMicActive(true);
        // Stop the stream immediately after testing to release the device
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.error('Mic access denied:', err);
      setMicError('Access denied. Please check browser permissions.');
      setMicActive(false);
    }
  };

  const allChecked = Object.values(checklist).every(v => v) && micActive;

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-700">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
          <Lock className="w-3 h-3 text-indigo-400" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">Secure Entry Point</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Session Lobby</h1>
        <p className="text-gray-400">ID: <span className="font-mono text-indigo-300">{groupId}</span></p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Device Check Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Hardware Audit</h2>
          
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/[0.07]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${micActive ? 'bg-emerald-500/20' : micError ? 'bg-red-500/20' : 'bg-white/5'}`}>
                  <Mic className={`w-5 h-5 ${micActive ? 'text-emerald-400' : micError ? 'text-red-400' : 'text-gray-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">Microphone</p>
                  <p className="text-xs text-gray-500">{micActive ? 'Input detected' : micError ? 'Test failed' : 'Click to test'}</p>
                </div>
              </div>
              <button 
                onClick={handleTestMic}
                className={`text-xs px-3 py-1 rounded-md transition ${micActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {micActive ? 'Success' : 'Test Mic'}
              </button>
            </div>
            {micError && (
              <p className="text-[10px] text-red-400 mb-2">{micError}</p>
            )}
            {micActive && (
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse w-2/3" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5">
              <Volume2 className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Audio Output</p>
              <p className="text-xs text-gray-500">Speakers/Headphones OK</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong>Hard Anonymity Notice:</strong> Your camera is disabled by default. Identity verification is cryptographic, not visual.
            </p>
          </div>
        </section>

        {/* Privacy Checklist Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Privacy Protocols</h2>
          
          <div className="rounded-xl border border-white/10 bg-gray-950 p-6 space-y-4">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input 
                type="checkbox"
                checked={checklist.anonymous}
                onChange={() => setChecklist({...checklist, anonymous: !checklist.anonymous})}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white">Handle-only Protocol</p>
                </div>
                <p className="text-xs text-gray-500 italic">"I will not share my real name or physical location."</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <input 
                type="checkbox"
                checked={checklist.headphones}
                onChange={() => setChecklist({...checklist, headphones: !checklist.headphones})}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white">Aural Isolation</p>
                </div>
                <p className="text-xs text-gray-500">"I am wearing headphones to protect others&apos; privacy."</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <input 
                type="checkbox"
                checked={checklist.safeSpace}
                onChange={() => setChecklist({...checklist, safeSpace: !checklist.safeSpace})}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-black text-indigo-600 focus:ring-indigo-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-200 group-hover:text-white">Safe Environment</p>
                </div>
                <p className="text-xs text-gray-500">"I am in a private space where I will not be overheard."</p>
              </div>
            </label>
          </div>

          {allChecked ? (
            <Link
              href={`/session/${groupId}`}
              className="flex items-center justify-center min-h-12 w-full rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all duration-300"
            >
              Enter Session Room
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="flex items-center justify-center min-h-12 w-full rounded-xl font-bold bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
            >
              Complete Protocols to Enter
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
