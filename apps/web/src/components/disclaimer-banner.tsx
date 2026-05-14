import { cn } from '@hips/ui'

const DISCLAIMER_TEXT =
  'H.I.P.S. is a peer support platform, not licensed medical or crisis care. We do not assess, prescribe, or provide licensed care. Our support is designed to complement, not replace, professional care.'

export function DisclaimerBanner({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Disclaimer"
      className={cn(
        'bg-brand-warm border border-brand-deep/10 rounded-lg p-4',
        className,
      )}
      role="complementary"
    >
      <p className="text-xs font-medium text-brand-deep leading-relaxed">
        <strong className="font-semibold">Important:</strong> {DISCLAIMER_TEXT}
      </p>
    </aside>
  )
}

export const DISCLAIMER_FOR_CHECKOUT = DISCLAIMER_TEXT
