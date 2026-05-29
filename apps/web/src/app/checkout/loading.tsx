export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse mb-4" />
        <div className="h-4 w-72 bg-zinc-800/50 rounded animate-pulse mb-16" />
        <div className="space-y-4">
          <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-3xl animate-pulse" />
          <div className="h-32 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}
