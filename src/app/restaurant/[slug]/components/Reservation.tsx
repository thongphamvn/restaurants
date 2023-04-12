'use client'

import LoadingSpinner from '@/app/components/LoadingSpinner'
import { RestaurantType } from '@/app/page'
import { partySize } from '@/data/partySize'
import { times } from '@/data/time'
import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { format, parse } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DatePicker from 'react-datepicker'

type Availability = {
  time: string
  available: boolean
}

export default function Reservation({
  restaurant,
}: {
  restaurant: RestaurantType
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [time, setTime] = useState<string>(restaurant.open_time)
  const [size, setSize] = useState('2')
  const [availableTimes, setAvailableTimes] = useState<Availability[]>([])
  const router = useRouter()

  const { refetch, isFetching } = useQuery<any, any, any, any>({
    queryKey: ['restaurant', restaurant.slug, 'availability'],
    queryFn: () =>
      axios.get(`/api/restaurant/${restaurant.slug}/availability`, {
        params: {
          day: selectedDate.toISOString().slice(0, 10),
          time,
          partySize: size,
        },
      }),
    retry: false,
    enabled: false,
    onSuccess: (data: AxiosResponse) => {
      setAvailableTimes(data.data.availability)
    },
  })

  const handleClickTime = (time: Availability) => {
    if (time.available) {
      const params = new URLSearchParams({
        day: selectedDate.toISOString().slice(0, 10),
        time: time.time,
        partySize: size,
      })
      router.push(`/reserve/${restaurant.slug}?${params.toString()}`)
    }
  }

  const handleChangeDate = (date: Date) => {
    setSelectedDate(date || null)
  }

  const filterTimesByRestaurantWindows = () => {
    const timeInWindows: typeof times = []
    let isWithinTimeWindow = false

    times.forEach((time) => {
      if (time.time === restaurant.open_time) {
        isWithinTimeWindow = true
      }

      if (isWithinTimeWindow) {
        timeInWindows.push(time)
      }

      if (time.time === restaurant.close_time) {
        isWithinTimeWindow = false
      }
    })

    return timeInWindows
  }

  const handleFindATime = () => {
    if (isFetching) {
      return
    }
    refetch()
  }

  return (
    <div className='lg:w-[350px]'>
      <div className='text-left border-b pb-2 font-bold'>
        <h4 className='mr-7 text-3xl'>Make a Reservation</h4>
      </div>
      <div className=' bg-white rounded p-3 shadow'>
        <div className='my-3 flex flex-col '>
          <label htmlFor=''>Party size</label>
          <select
            name=''
            className='py-3 border-b font-light'
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {partySize.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className='flex justify-between'>
          <div className='flex flex-col w-[45%]'>
            <label htmlFor=''>Date</label>
            <DatePicker
              placeholderText='Select a date'
              className='py-3 border-b font-light cursor-pointer w-full'
              dateFormat={'MMMM d'}
              wrapperClassName='w-full'
              onChange={handleChangeDate}
              selected={selectedDate}
            />
          </div>
          <div className='flex flex-col w-[45%]'>
            <label htmlFor=''>Time</label>
            <select
              name=''
              className='py-3 border-b font-light'
              id=''
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {filterTimesByRestaurantWindows().map((time) => (
                <option key={time.time} value={time.time}>
                  {time.displayTime}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='mt-5'>
          <button
            onClick={handleFindATime}
            className='bg-red-600 rounded w-full text-white font-bold p-4'
          >
            {isFetching ? <LoadingSpinner /> : <p>Find a Time</p>}
          </button>
        </div>
        {availableTimes.length > 0 ? (
          <div className='pt-6 pb-4 flex flex-wrap gap-x-2 gap-y-8'>
            {availableTimes.map((time) => (
              <button key={time.time} onClick={() => handleClickTime(time)}>
                <div
                  className={'p-3 bg-red-500 rounded text-white inline'}
                  key={time.time}
                >
                  {format(
                    parse(
                      time.time.split(':', 2).join(':'),
                      'HH:mm',
                      new Date()
                    ),
                    'hh:mm a'
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}
