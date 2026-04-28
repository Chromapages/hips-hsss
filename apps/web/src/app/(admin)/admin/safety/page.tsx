import { adminQueue } from "@/data/catalog";

export default function AdminSafetyQueuePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">
          Safety
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Human-reviewed escalation queue
        </h1>
        <p className="mt-3 max-w-3xl text-gray-400">
          Flags appear by anonymous session reference. Crisis protocol and
          vault access require reviewer justification.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400">
            <tr>
              {["ID", "Session", "Level", "Age", "Status", "Action"].map(
                (header) => (
                  <th className="px-4 py-3" key={header}>
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {adminQueue.map((item) => (
              <tr className="border-t border-gray-800" key={item.id}>
                <td className="px-4 py-3 font-mono text-gray-300">
                  {item.id}
                </td>
                <td className="px-4 py-3 font-mono text-gray-300">
                  {item.sessionRef}
                </td>
                <td className="px-4 py-3 text-red-300">{item.level}</td>
                <td className="px-4 py-3 text-gray-300">{item.age}</td>
                <td className="px-4 py-3 text-gray-300">{item.status}</td>
                <td className="px-4 py-3">
                  <button className="min-h-11 rounded-md bg-red-950 px-4 font-semibold text-red-100 hover:bg-red-900">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
