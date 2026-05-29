"use client";

import { useState } from "react";

export const dynamic = "force-dynamic";import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";import { ArrowRight, Hash, Shield, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export default function JoinPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim()) {
      router.push(`/join/${sessionId.trim()}`);
    }
  };

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    try {
      // Navigate to demo room - token is fetched client-side
      router.push('/demo-room');
    } catch (err) {
      console.error('Demo session error:', err);
      setIsDemoLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            <Shield className="w-3 h-3 text-indigo-400" />
            Direct Session Access
          </div>
          <h1 className="text-3xl font-black tracking-tight">Join a Session</h1>
          <p className="text-sm text-zinc-500">Enter your session ID to connect directly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1" htmlFor="session-id">
              Session ID
            </label>
            <div className="relative group">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-500 transition-colors" />
              <input
                id="session-id"
                type="text"
                required
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="e.g. abc-123-def"
                className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!sessionId.trim()}
            className="group relative w-full h-14 items-center justify-center overflow-hidden rounded-2xl bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600"
          >
            <span className="flex items-center justify-center gap-2">
              Join Session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-black px-4 text-xs uppercase tracking-widest text-zinc-500">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTryDemo}
          disabled={isDemoLoading}
          className="group relative w-full h-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${isDemoLoading ? 'animate-spin' : ''}`} />
            {isDemoLoading ? 'Preparing Demo...' : 'Try a Demo Session'}
          </span>
        </button>

        <p className="text-center text-xs text-zinc-600">
          No account required — sessions are anonymous.
        </p>
      </div>
    </main>
  );
}