import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-black p-6 text-white flex flex-col">
      <div className="mx-auto w-full max-w-7xl space-y-12 pt-24 animate-in fade-in duration-700">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-white/5 border border-white/5" />
          <Skeleton className="h-5 w-full max-w-lg bg-white/5 border border-white/5" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
            <Skeleton className="h-6 w-1/2 bg-white/10" />
            <Skeleton className="h-32 w-full bg-white/5" />
            <Skeleton className="h-10 w-full bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
