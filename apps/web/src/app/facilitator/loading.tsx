export default function FacilitatorLoading() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
      </div>
    </main>
  );
}
