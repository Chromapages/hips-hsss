import { Skeleton } from "@/components/ui/skeleton";

export default function HostLoading() {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-background p-6 text-foreground flex flex-col justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full bg-surface/10 animate-spin border-2 border-primary border-t-transparent" />
        <Skeleton className="h-4 w-32 bg-surface/10" />
      </div>
    </main>
  );
}
