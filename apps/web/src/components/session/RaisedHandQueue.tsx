'use client';

export type RaisedHandQueueProps = {
  raisedHands: string[];
  onLowerHand: (participantIdentity: string) => void;
};

export function RaisedHandQueue({ raisedHands, onLowerHand }: RaisedHandQueueProps) {
  return (
    <div className="border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Facilitator Queue</p>
        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-200">
          {raisedHands.length}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {raisedHands.length === 0 ? (
          <p className="text-sm text-zinc-500">No raised hands.</p>
        ) : (
          raisedHands.map((identity) => (
            <div
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2"
              key={identity}
            >
              <span className="font-mono text-xs text-zinc-300">anon-{identity.slice(0, 8)}</span>
              <button
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300 hover:bg-white/10"
                onClick={() => onLowerHand(identity)}
                type="button"
              >
                Lower
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}