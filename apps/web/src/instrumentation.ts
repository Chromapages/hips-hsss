/**
 * Next.js instrumentation hook — runs once when the server starts.
 *
 * The actual secret-validation logic is in `./instrumentation-node.ts`,
 * which is loaded only when running in the Node.js runtime.
 *
 * We use `require()` with a runtime-guarded wrapper string so webpack does
 * NOT statically trace the dependency graph. A static `await import(...)`
 * statement causes webpack's edge compilation to follow the import chain
 * into `lib/secrets` (which uses Node builtins), producing:
 *   UnhandledSchemeError: Reading from "node:crypto" is not handled
 *   Module not found: Can't resolve 'crypto'
 *
 * By using `require()` with a non-literal-ish wrapper, webpack treats the
 * dependency as opaque and does not try to bundle `instrumentation-node.ts`
 * for the edge runtime.
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // Use a non-statically-analyzable require to prevent webpack from tracing
  // the import graph of instrumentation-node.ts into the edge bundle.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeModule = require('./instrumentation-node');
  nodeModule.runNodeStartupChecks();
}
