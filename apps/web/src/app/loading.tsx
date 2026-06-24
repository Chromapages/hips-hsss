import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-slate-950 p-6 text-white flex flex-col">
      <div className="mx-auto w-full max-w-7xl space-y-12 pt-24 animate-in fade-in duration-700">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-slate-800" />
          <Skeleton className="h-5 w-full max-w-lg bg-slate-800/50" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-slate-800" />
            <Skeleton className="h-32 w-full bg-slate-800/50" />
            <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
          </div>
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-slate-800" />
            <Skeleton className="h-32 w-full bg-slate-800/50" />
            <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
          </div>
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-slate-800" />
            <Skeleton className="h-32 w-full bg-slate-800/50" />
            <Skeleton className="h-10 w-full bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
