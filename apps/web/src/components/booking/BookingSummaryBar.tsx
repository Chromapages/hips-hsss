import Link from "next/link";

export function BookingSummaryBar({
  service,
  date,
  time,
}: {
  service: string;
  date: string;
  time: string;
}) {
  if (!date || !time) {
    return null;
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/90 p-4 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">{service}</span> on {date} at {time}. $50
        </p>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-indigo-500 px-4 font-semibold text-white transition hover:bg-indigo-400"
          href="/checkout"
        >
          Continue to checkout
        </Link>
      </div>
    </aside>
  );
}
