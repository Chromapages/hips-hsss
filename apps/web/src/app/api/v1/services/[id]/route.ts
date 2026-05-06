import { NextResponse } from 'next/server'
import { commerceDb } from '@/lib/commerce-db'
import { makeResponse } from '@hips/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await commerceDb.service.findUnique({
      where: { id, isActive: true },
      include: {
        facilitator: {
          select: { displayName: true },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        makeResponse(null, crypto.randomUUID()),
        { status: 404 }
      )
    }

    const response = {
      id: service.id,
      name: service.name,
      description: service.description,
      standardPrice: service.standardPrice,
      category: service.category,
      durationMins: service.durationMins,
      maxSeats: service.maxSeats,
      scholarshipMin: service.scholarshipMin,
      facilitator: service.facilitator
        ? { displayName: service.facilitator.displayName }
        : null,
    }

    return NextResponse.json(makeResponse(response, crypto.randomUUID()))
  } catch (error) {
    console.error('Failed to fetch service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}
