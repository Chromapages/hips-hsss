import { FileText } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const downloads = ["Grounding guide", "Meeting prep worksheet", "Resource map"];

export default function DashboardDownloadsPage() {
  return (
    <DashboardLayout>
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="text-4xl font-bold">Downloads</h1>
        <p className="mt-3 text-zinc-400">Purchased resources and worksheets.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {downloads.map((download) => (
            <article className="rounded-lg border border-white/10 bg-zinc-950 p-5" key={download}>
              <FileText className="h-8 w-8 text-indigo-300" />
              <h2 className="mt-4 text-xl font-semibold">{download}</h2>
              <button className="mt-5 min-h-11 rounded-xl border border-white/10 px-4 text-sm font-semibold transition hover:bg-white/10">
                Download
              </button>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
