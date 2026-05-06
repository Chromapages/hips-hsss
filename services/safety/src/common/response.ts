// Standard API response shape for all Safety Engine endpoints
export function makeResponse<T>(data: T, requestId: string = crypto.randomUUID()) {
  return {
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}

export function makeError(
  code: string,
  message: string,
  requestId: string = crypto.randomUUID(),
) {
  return {
    data: null,
    error: { code, message },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  }
}