export const asError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(String(e));

export const toErrorMessage = (e: unknown): string => asError(e).message;
