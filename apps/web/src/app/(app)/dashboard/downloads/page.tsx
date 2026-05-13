import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads — H.I.P.S.',
  robots: { index: false },
}

const MOCK_DOWNLOADS = [
  {
    id: 'dl_1',
    name: 'Restoration Guide',
    description: 'Practical tools for navigating emotional distress and building resilience.',
    fileType: 'PDF',
    sizeKB: 2450,
    purchasedAt: '2026-04-01',
  },
  {
    id: 'dl_2',
    name: 'Peer Support Handbook',
    description: 'A guide to getting the most out of your peer support sessions.',
    fileType: 'PDF',
    sizeKB: 1820,
    purchasedAt: '2026-04-15',
  },
]

export default function DownloadsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-brand-deep mb-2">Digital Downloads</h1>
      <p className="text-neutral-500 mb-8">
        Resources included with your purchases. Re-download anytime.
      </p>

      <div className="space-y-4">
        {MOCK_DOWNLOADS.map(dl => (
          <article
            key={dl.id}
            className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-warm">
                <FileText className="h-6 w-6 text-brand-deep" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900">{dl.name}</h2>
                <p className="text-sm text-neutral-500 mt-0.5">{dl.description}</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {dl.fileType} · {(dl.sizeKB / 1024).toFixed(1)} MB · Purchased{' '}
                  {new Date(dl.purchasedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <a
              href={`/api/v1/downloads/${dl.id}`}
              className="flex items-center gap-2 rounded-lg border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors shrink-0"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download
            </a>
          </article>
        ))}
      </div>

      {MOCK_DOWNLOADS.length === 0 && (
        <div className="text-center py-12 rounded-lg border border-neutral-200 bg-white">
          <Lock className="h-12 w-12 text-neutral-200 mx-auto mb-4" aria-hidden="true" />
          <h3 className="font-semibold text-neutral-900 mb-1">No downloads available</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Purchased digital products will appear here.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
          >
            Browse Services
          </Link>
        </div>
      )}
    </div>
  )
}
