import { Suspense } from "react";
import MfaSetupClient from "./MfaSetupClient";

export const dynamic = "force-dynamic";

export default function MfaSetupPage() {
  return (
    <Suspense fallback={<div className="text-center text-text-muted">Loading…</div>}>
      <MfaSetupClient />
    </Suspense>
  );
}
