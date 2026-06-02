export default function JoinLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-text-muted">
          Loading entry…
        </p>
      </div>
    </main>
  );
}
