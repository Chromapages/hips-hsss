/**
 * Phase 9 Docker integration blueprint.
 *
 * This file is intentionally excluded from `vitest.config.ts` so local and CI
 * checks do not require Docker. When the environment has Docker and the
 * `testcontainers` package installed, copy this into an enabled spec and wire
 * service clients to the returned URLs.
 */
export type IsolatedDatabaseUrls = {
  commerceUrl: string;
  sessionUrl: string;
  vaultUrl: string;
};

export async function startPhase9PostgresContainers(): Promise<IsolatedDatabaseUrls> {
  const { PostgreSqlContainer } = await import("@testcontainers/postgresql");

  const [commerce, session, vault] = await Promise.all([
    new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("commerce")
      .withUsername("commerce_service")
      .start(),
    new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("session")
      .withUsername("session_service")
      .start(),
    new PostgreSqlContainer("postgres:16-alpine")
      .withDatabase("vault")
      .withUsername("vault_service")
      .start(),
  ]);

  return {
    commerceUrl: commerce.getConnectionUri(),
    sessionUrl: session.getConnectionUri(),
    vaultUrl: vault.getConnectionUri(),
  };
}
