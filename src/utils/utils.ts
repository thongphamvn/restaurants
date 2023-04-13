import { times } from '@/data/time'
import { AvailabilityParams } from '@/types'
import { PrismaClient, Restaurant, Review, Table } from '@prisma/client'
import Joi from 'joi'
import { NextResponse } from 'next/server'

export const calculateReviewScore = (reviews: Review[]) => {
  if (reviews.length === 0) return 0

  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  const inv = 1.0 / 0.5
  return Math.round((total / reviews.length) * inv) / inv
}

const prisma = new PrismaClient()
export const findAvailableTables = async (
  restaurant: Pick<Restaurant, 'close_time' | 'open_time'> & {
    tables: Table[]
  },
  { time, day, partySize }: AvailabilityParams
): Promise<{ time: string; available: boolean }[]> => {
  const searchTimes = times.find((t) => t.time === time)?.searchTimes || []

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      booking_time: true,
      number_of_people: true,
      bookingsTables: {
        select: {
          table: true,
        },
      },
    },
  })

  const data: any = bookings
    .map(({ bookingsTables, ...booking }) => ({
      ...booking,
      tables: bookingsTables.map((bt) => bt.table),
    }))
    .reduce(
      (acc, booking) => ({
        ...acc,
        [booking.booking_time.toISOString()]: booking.tables.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: true }),
          {}
        ),
      }),
      {}
    )

  const tables = restaurant.tables

  const searchTimesWithTables = searchTimes.map((t) => ({
    date: new Date(day + 'T' + t),
    time: t,
    tables,
  }))

  searchTimesWithTables.forEach((st) => {
    st.tables = st.tables?.filter((table) => {
      if (data[st.date.toISOString()]?.[table.id]) {
        return false
      }
      return true
    })
  })

  const availability = searchTimesWithTables
    .map((t) => {
      const sumSeats =
        t.tables?.reduce((acc, cur) => acc + cur.number_of_seats, 0) || 0
      return { time: t.time, available: sumSeats >= Number(partySize) }
    })
    .filter((t) => {
      const timeIsAfterOpeningHour =
        new Date(`${day}T${t.time}`) >=
        new Date(`${day}T${restaurant?.open_time}`)
      const timeIsBeforeClosingHour =
        new Date(`${day}T${t.time}`) <=
        new Date(`${day}T${restaurant?.close_time}`)

      return timeIsAfterOpeningHour && timeIsBeforeClosingHour
    })

  return availability
}

export const getSearchParams = <T>(url: string): T => {
  const { searchParams } = new URL(url)

  const paramsArray = [...searchParams.entries()]
  const paramsObject = Object.fromEntries(paramsArray)
  return paramsObject as T
}

export const joiValidate = (schema: Joi.Schema, data: unknown) => {
  const { error } = schema.validate(data)
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
