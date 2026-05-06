import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

export interface ApiErrorBody {
  data: null
  error: {
    code: string
    message: string
  }
  meta: {
    timestamp: string
    requestId: string
  }
}

export interface ApiSuccessBody<T> {
  data: T
  error: null
  meta: {
    timestamp: string
    requestId: string
  }
}

function makeMeta(requestId?: string) {
  return {
    timestamp: new Date().toISOString(),
    requestId: requestId ?? randomUUID(),
  }
}

export function apiSuccess<T>(
  data: T,
  requestId?: string,
  status: number = 200
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json({ data, error: null, meta: makeMeta(requestId) }, { status })
}

export function apiError(
  code: string,
  message: string,
  requestId?: string,
  status: number = 400
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    { data: null, error: { code, message }, meta: makeMeta(requestId) },
    { status }
  )
}

export function formatZodError(error: ZodError): string {
  const firstIssue = error.issues[0]
  if (!firstIssue) return 'Validation failed'
  const path = firstIssue.path.join('.')
  return path ? `${path}: ${firstIssue.message}` : firstIssue.message
}
