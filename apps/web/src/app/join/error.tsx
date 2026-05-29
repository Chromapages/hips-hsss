'use client';

export default function JoinError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Join Failed</h1>
        <p className="text-zinc-400 mb-6">We couldn't connect you to this session.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white transition-colors"
          >
            Try Again
          </button>
          <a
            href="/join"
            className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-medium text-zinc-300 transition-colors"
          >
            Find Another Session
          </a>
        </div>
      </div>
    </main>
  );
}
