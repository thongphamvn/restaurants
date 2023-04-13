import { findAvailableTables } from '@/utils/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, args: any) {
  const { searchParams } = new URL(request.url)

  const paramsArray = [...searchParams.entries()]
  const paramsObject = Object.fromEntries(paramsArray)
  const { day, time, partySize } = paramsObject

  if (!day || !time || !partySize) {
    return new Response('Missing required query parameters', { status: 400 })
  }

  const availability = await findAvailableTables({
    day,
    time,
    partySize,
    slug: args.params.slug,
  })

  return NextResponse.json({
    availability,
  })
}
