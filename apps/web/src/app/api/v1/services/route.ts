import { NextResponse } from 'next/server'
import { commerceDb } from '@/lib/commerce-db'

export async function GET() {
  try {
    const services = await commerceDb.service.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}