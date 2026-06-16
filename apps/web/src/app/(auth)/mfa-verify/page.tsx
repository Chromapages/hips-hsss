/**
 * Server component shell for the MFA verify page.
 * Wraps the client component. No data fetching at the page level — the
 * pending token arrives in the URL from the login redirect.
 */

import { Suspense } from "react";
import MfaVerifyClient from "./MfaVerifyClient";

export const dynamic = "force-dynamic";

export default function MfaVerifyPage() {
  return (
    <Suspense fallback={<div className="text-center text-text-muted">Loading…</div>}>
      <MfaVerifyClient />
    </Suspense>
  );
}
