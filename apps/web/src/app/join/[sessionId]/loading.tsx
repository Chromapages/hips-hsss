export default function DirectJoinLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm font-bold uppercase tracking-widest text-text-muted">
          Preparing your space…
        </span>
      </div>
    </div>
  );
}
