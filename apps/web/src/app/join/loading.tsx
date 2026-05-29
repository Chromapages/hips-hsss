export default function JoinLoading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Joining Session</p>
      </div>
    </main>
  );
}
