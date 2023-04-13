import { AvailabilityParams, SlugParams } from '@/types'
import {
  findAvailableTables,
  getSearchParams,
  joiValidate,
} from '@/utils/utils'
import { PrismaClient } from '@prisma/client'
import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'

const joiSchema = Joi.object<AvailabilityParams>({
  day: Joi.string().required(),
  time: Joi.string().required(),
  partySize: Joi.string().required(),
})

const prisma = new PrismaClient()
export async function GET(request: NextRequest, { params }: SlugParams) {
  const searchParams = getSearchParams<AvailabilityParams>(request.url)
  joiValidate(joiSchema, searchParams)

  const { day, time, partySize } = searchParams

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      open_time: true,
      close_time: true,
      tables: true,
    },
  })
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const availability = await findAvailableTables(restaurant, {
    day,
    time,
    partySize,
  })

  return NextResponse.json({
    availability,
  })
}
