import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { commerceDb } from '@/lib/commerce-db'
import {
  SessionAvailabilitySchema,
  makeResponse,
  makeError,
  ErrorCodes,
} from '@hips/types'

export async function GET(req: NextRequest) {
  const requestId = uuidv4()
  try {
    const { searchParams } = new URL(req.url)
    const raw = Object.fromEntries(searchParams.entries())
    const parsed = SessionAvailabilitySchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        makeError(ErrorCodes.VALIDATION_ERROR, 'Invalid query parameters', requestId),
        { status: 400 }
      )
    }

    const { serviceId, startDate, endDate, facilitatorId } = parsed.data

    // Validate service exists
    const service = await commerceDb.service.findUnique({ where: { id: serviceId } })
    if (!service) {
      return NextResponse.json(
        makeError(ErrorCodes.SERVICE_NOT_FOUND, 'Service not found', requestId),
        { status: 404 }
      )
    }

    // Generate slots for the date range (simplified: Mon-Sat, 9am-5pm, 1-hour slots)
    const slots: Array<{ datetime: string; facilitatorId: string; available: boolean }> = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    const maxDate = new Date(start)
    maxDate.setDate(maxDate.getDate() + 30)
    if (end > maxDate) end.setDate(maxDate.getDate())

    const current = new Date(start)
    while (current <= end) {
      const day = current.getDay()
      if (day !== 0) {
        // Mon–Sat
        for (let hour = 9; hour < 17; hour++) {
          const slotDate = new Date(current)
          slotDate.setHours(hour, 0, 0, 0)
          slots.push({
            datetime: slotDate.toISOString(),
            facilitatorId: facilitatorId ?? 'any',
            available: true,
          })
        }
      }
      current.setDate(current.getDate() + 1)
    }

    // Check against booked sessions
    const booked = await commerceDb.session.findMany({
      where: {
        serviceId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledAt: { gte: start, lte: end },
        ...(facilitatorId ? { facilitatorId } : {}),
      },
      select: { scheduledAt: true },
    })

    const bookedSet = new Set(booked.map(s => s.scheduledAt.toISOString()))
    const availability = slots.map(slot => ({
      ...slot,
      available: !bookedSet.has(slot.datetime),
    }))

    return NextResponse.json(
      makeResponse({ slots: availability }, requestId),
      { status: 200 }
    )
  } catch (err) {
    console.error('[/api/v1/sessions/availability]', err)
    return NextResponse.json(
      makeError(ErrorCodes.INTERNAL_ERROR, 'Something went wrong. Please try again.', requestId),
      { status: 500 }
    )
  }
}
