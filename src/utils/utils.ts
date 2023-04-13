import { times } from '@/data/time'
import { PrismaClient, Review } from '@prisma/client'

export const calculateReviewScore = (reviews: Review[]) => {
  if (reviews.length === 0) return 0

  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  const inv = 1.0 / 0.5
  return Math.round((total / reviews.length) * inv) / inv
}

const prisma = new PrismaClient()
export const findAvailableTables = async ({
  time,
  day,
  slug,
  partySize,
}: {
  partySize: string
  slug: string
  time: string
  day: string
}): Promise<{ time: string; available: boolean }[]> => {
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

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
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

  return availability
}
