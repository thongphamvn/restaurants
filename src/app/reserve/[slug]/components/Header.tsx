import { Restaurant } from '@prisma/client'
import { format, parse } from 'date-fns'
import Image from 'next/image'

export default function Header({
  restaurant,
  day,
  time,
  partySize,
}: {
  restaurant: Restaurant
  day: string
  time: string
  partySize: string
}) {
  return (
    <div>
      <h3 className='font-bold'>{`You're almost done!`}</h3>
      <div className='mt-5 flex'>
        <Image
          src={restaurant.main_image}
          alt=''
          style={{ height: 'auto' }}
          width={24}
          height={24}
          className='w-32 h-18 rounded'
        />
        <div className='ml-4'>
          <h1 className='text-3xl font-bold'>{restaurant.name}</h1>
          <div className='flex mt-3'>
            <p className='mr-6'>{day}</p>
            <p className='mr-6'>
              {format(
                parse(time.split(':', 2).join(':'), 'HH:mm', new Date()),
                'hh:mm a'
              )}
            </p>
            <p className='mr-6'>
              {partySize === '1' ? `1 person` : `${partySize} people`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
