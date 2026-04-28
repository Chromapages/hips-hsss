import Link from "next/link"
import { ShieldAlert } from "lucide-react"
import { SERVICES_CATALOG } from "@/lib/services-data"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/polish/Navbar"

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES_CATALOG.find(s => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <Navbar />
      <div className="container mx-auto px-6 max-w-3xl pt-24">
        <Link href="/services" className="text-sm text-indigo-400 hover:text-indigo-300 mb-8 inline-block transition-colors">
          &larr; Back to Catalog
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{service.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-400 mb-10 pb-10 border-b border-gray-800">
          <span className="font-medium text-gray-200">{service.duration}</span>
          <span>•</span>
          <span className="font-medium text-gray-200">{service.price} Standard Rate</span>
          <span>•</span>
          <Link href="/scholarship" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">Apply for Scholarship</Link>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-lg text-gray-300 leading-relaxed">
            {service.longDescription}
          </p>
          <h3 className="text-xl font-semibold mt-8 mb-4 text-white">What to expect:</h3>
          <ul className="list-disc pl-6 text-gray-300 space-y-3">
            <li>Strictly anonymous entry using your H.I.P.S. session token.</li>
            <li>No cameras allowed; you will be represented by a 3D avatar.</li>
            <li>Real-time safety monitoring to ensure a secure environment.</li>
            <li>No medical advice or emergency-care services.</li>
          </ul>
        </div>

        {/* Global Disclaimer */}
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-xl p-6 mb-10 flex gap-4 animate-in fade-in slide-in-from-bottom-4">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong>Disclaimer:</strong> H.I.P.S. provides peer support, coaching, and support navigation. It is not emergency care. We do not provide psychiatric evaluation or medical advice. If you are experiencing a medical emergency or active crisis, please call or text <a href="tel:988" className="text-amber-500 hover:underline">988</a> (USA) or your local emergency number.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            className="inline-flex h-14 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-8 text-lg font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
            href={`/book/${slug}`}
          >
            Book Session
          </Link>
          <Link
            className="h-14 flex-1 inline-flex items-center justify-center rounded-xl border border-white/10 px-8 text-lg font-bold text-white hover:bg-white/5 transition-all active:scale-[0.98]"
            href="/donate"
          >
            Sponsor Someone Else
          </Link>
        </div>
      </div>
    </main>
  )
}

