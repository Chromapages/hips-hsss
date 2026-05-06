import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import {
  CompleteSessionSchema,
  makeResponse,
  makeError,
  ErrorCodes,
  UserRole,
} from '@hips/types'
import { requireRole } from '@/lib/auth'

// PATCH /api/v1/sessions/:id/complete
export async function PATCH(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const sessionId = req.url.split('/')[6] // /api/v1/sessions/{id}/complete
    if (!sessionId) {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_NOT_FOUND, 'Session ID is required', requestId),
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsed = CompleteSessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid request body', requestId),
        { status: 400 }
      )
    }

    // Fetch session
    const session = await commerceDb.session.findUnique({ where: { id: sessionId } })
    if (!session) {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_NOT_FOUND, 'Session not found', requestId),
        { status: 404 }
      )
    }

    if (session.status === 'COMPLETED') {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_ALREADY_COMPLETED, 'Session is already completed', requestId),
        { status: 409 }
      )
    }
    if (session.status === 'CANCELLED') {
      return NextResponse.json(
        makeError(ErrorCodes.SESSION_CANCELLED, 'Cannot complete a cancelled session', requestId),
        { status: 409 }
      )
    }

    // Verify caller is FACILITATOR or ADMIN
    const authResult = await requireRole(req, [UserRole.FACILITATOR, UserRole.ADMIN])
    if (authResult instanceof Response) return authResult
    if (session.facilitatorId && session.facilitatorId !== authResult.firebaseUid) {
      return NextResponse.json(
        makeError(ErrorCodes.FORBIDDEN, 'You can only complete your own sessions', requestId),
        { status: 403 }
      )
    }

    const completedAt = new Date()
    const updated = await commerceDb.session.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt,
        notes: parsed.data.notes,
      },
    })

    // Trigger 48-hour follow-up survey email cron registration would go here

    return NextResponse.json(
      makeResponse(
        {
          sessionId: updated.id,
          status: updated.status,
          completedAt: completedAt.toISOString(),
        },
        requestId
      ),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/sessions/:id/complete]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
