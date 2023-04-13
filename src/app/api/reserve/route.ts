import { findAvailableTables } from '@/utils/utils'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

type ReserveParams = {
  day: string
  time: string
  partySize: string
  slug: string
}

const prisma = new PrismaClient()
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const body = await request.json()
  const paramsArray = [...searchParams.entries()]
  const paramsObject = Object.fromEntries(paramsArray) as ReserveParams
  const { day, time, partySize, slug } = paramsObject

  if (!day || !time || !partySize || !slug) {
    return NextResponse.json(
      { error: 'Missing required params' },
      { status: 400 }
    )
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      tables: true,
      open_time: true,
      close_time: true,
    },
  })
  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
  }

  const beforeOpenTime =
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`)
  const afterCloseTime =
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)

  if (beforeOpenTime || afterCloseTime) {
    return NextResponse.json(
      { error: 'Reservation time is outside of restaurant hours' },
      { status: 400 }
    )
  }

  const availableTables = await findAvailableTables({
    day,
    time,
    partySize,
    slug,
  })

  if (!availableTables.find((a) => a.time === time)?.available) {
    return NextResponse.json(
      { error: 'Reservation time is not available' },
      { status: 400 }
    )
  }

  const tablesCount: { 2: number[]; 4: number[] } = {
    2: [],
    4: [],
  }

  restaurant.tables.forEach((table) => {
    if (table.number_of_seats === 2) {
      tablesCount[2].push(table.id)
    } else {
      tablesCount[4].push(table.id)
    }
  })

  const tableToBook: number[] = []
  let seatsRemaining = parseInt(partySize)
  while (seatsRemaining > 0) {
    if (seatsRemaining >= 3 && tablesCount[4].length > 0) {
      tableToBook.push(tablesCount[4].shift()!)
      seatsRemaining -= 4
    } else if (tablesCount[2].length > 0) {
      tableToBook.push(tablesCount[2].shift()!)
      seatsRemaining -= 2
    } else {
      return NextResponse.json(
        { error: 'Not enough tables available' },
        { status: 400 }
      )
    }
  }

  const {
    bookerEmail,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerOccasion,
    bookerRequest,
  } = body || {}
  console.log(body)

  const reservation = await prisma.booking.create({
    data: {
      booking_time: new Date(`${day}T${time}`),
      number_of_people: parseInt(partySize),
      restaurant_id: restaurant.id,
      booker_email: bookerEmail,
      booker_first_name: bookerFirstName,
      booker_last_name: bookerLastName,
      booker_phone: bookerPhone,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
    },
  })
  const tables = await prisma.bookingTable.createMany({
    data: tableToBook.map((tableId) => ({
      booking_id: reservation.id,
      table_id: tableId,
    })),
  })

  return NextResponse.json({ reservation, tables })
}
