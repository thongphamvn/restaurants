import { times } from '@/data/time'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, args: any) {
  const { searchParams } = new URL(request.url)

  const paramsArray = [...searchParams.entries()]
  const paramsObject = Object.fromEntries(paramsArray)
  const { day, time, partySize } = paramsObject

  if (!day || !time || !partySize) {
    return new Response('Missing required query parameters', { status: 400 })
  }

  const searchTimes = times.find((t) => t.time === time)?.searchTimes || []

  const prisma = new PrismaClient()
  console.log(new Date(`${day}T${searchTimes[0]}`), `${day}T${searchTimes[0]}`)
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

  console.log(bookings)
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

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: args.params.slug,
    },
    select: {
      open_time: true,
      close_time: true,
      tables: true,
    },
  })

  const tables = restaurant?.tables

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

  return NextResponse.json({
    availability,
  })
}
