import dynamic from 'next/dynamic';

const SessionRoom = dynamic(() => import('@/components/session/SessionRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="animate-pulse text-sm font-bold uppercase tracking-widest text-zinc-400">
          Loading session engine...
        </span>
      </div>
    </div>
  ),
});

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SessionRoom sessionId={id} />;
}