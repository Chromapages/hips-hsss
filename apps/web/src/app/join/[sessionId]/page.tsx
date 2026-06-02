import { Suspense } from "react";
import type { Metadata } from "next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DirectJoinClient } from "./DirectJoinClient";

interface JoinPageProps {
  params: Promise<{ sessionId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(_: JoinPageProps): Promise<Metadata> {
  return {
    title: "Join a Session — H.I.P.S. Sanctuary",
    description: "Enter the secure Virtual Sanctuary session.",
    robots: { index: false, follow: false },
  };
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { sessionId } = await params;

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-background text-foreground">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm font-bold uppercase tracking-widest text-text-muted">
                Loading
              </span>
            </div>
          </div>
        }
      >
        <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
          <div className="fixed top-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
            <DirectJoinClient sessionId={sessionId} />
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
