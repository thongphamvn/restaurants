import { ReservationFormType, ReserveParams } from '@/types'
import {
  findAvailableTables,
  getSearchParams,
  joiValidate,
  prisma,
} from '@/utils'
import Joi from 'joi'
import { NextRequest, NextResponse } from 'next/server'

const joiSchemaParams = Joi.object<ReserveParams>({
  day: Joi.string().required(),
  time: Joi.string().required(),
  partySize: Joi.string().required(),
  slug: Joi.string().required(),
})

const joiSchemaBody = Joi.object<ReservationFormType>({
  bookerEmail: Joi.string().required(),
  bookerFirstName: Joi.string().required(),
  bookerLastName: Joi.string().required(),
  bookerPhone: Joi.string().required(),
  bookerOccasion: Joi.string().optional(),
  bookerRequest: Joi.string().optional(),
})

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ReservationFormType
  joiValidate(joiSchemaBody, body)

  const paramsObject = getSearchParams<ReserveParams>(request.url)
  joiValidate(joiSchemaParams, paramsObject)

  const { day, time, partySize, slug } = paramsObject

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    include: {
      tables: true,
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

  const availableTables = await findAvailableTables(restaurant, {
    day,
    time,
    partySize,
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
  } = body

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
