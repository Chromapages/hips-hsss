import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MobileBookingBarProps {
  priceDisplay: string;
  serviceTitle: string;
  analyticsId: string;
}

export function MobileBookingBar({
  priceDisplay,
  serviceTitle,
  analyticsId,
}: MobileBookingBarProps) {
  return (
    <div
      role="region"
      aria-label="Quick book"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border shadow-elevated pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-7xl mx-auto">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted">
            {serviceTitle}
          </span>
          <span className="text-lg font-bold text-text-primary font-heading leading-tight">
            {priceDisplay}
            <span className="text-xs font-normal text-text-muted ml-1">
              / session
            </span>
          </span>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link
            href="/checkout?package=standard"
            data-analytics={analyticsId}
          >
            Book now
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
