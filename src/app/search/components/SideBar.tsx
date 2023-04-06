'use client'

import { Cuisine, Location, PRICE } from '@prisma/client'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  locations: Location[]
  cuisines: Cuisine[]
}

export default function SideBar({ locations, cuisines }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    router.replace(`${pathname}?${params}`)
  }

  return (
    <div className='w-[200px] pr-4'>
      <div className='border-b pb-4'>
        <div className='flex items-center mb-1'>
          <Image src='/location.svg' alt='' width={16} height={16} />
          <h1 className='ml-1 text-md'>Location</h1>
        </div>
        <div className='ml-1'>
          {locations.map((location) => (
            <p
              onClick={() => updateQuery('region', location.name)}
              key={location.id}
              className={
                'font-light text-reg capitalize cursor-pointer ' +
                `${
                  searchParams.get('region') === location.name
                    ? 'font-semibold'
                    : ''
                }`
              }
            >
              {location.name}
            </p>
          ))}
        </div>
      </div>
      <div className='border-b pb-4 mt-3'>
        <div className='flex items-center mb-1'>
          <Image src='/cuisine.svg' alt='' width={16} height={16} />
          <h1 className='ml-1 text-md'>Cuisine</h1>
        </div>
        <div className='ml-1'>
          {cuisines.map((cuisine) => (
            <p
              onClick={() => updateQuery('cuisine', cuisine.name)}
              key={cuisine.id}
              className={
                'font-light text-reg capitalize cursor-pointer ' +
                `${
                  searchParams.get('cuisine') === cuisine.name
                    ? 'font-semibold'
                    : ''
                }`
              }
            >
              {cuisine.name}
            </p>
          ))}
        </div>
      </div>
      <div className='mt-3 pb-4'>
        <div className='flex items-center mb-1'>
          <Image src='/price.svg' alt='' width={16} height={16} />
          <h1 className='ml-1 text-md'>Price</h1>
        </div>
        <div className='flex'>
          <button
            className={
              'border w-full text-reg font-light rounded-l p-2 ' +
              `${
                searchParams.get('price') === PRICE.CHEAP ? 'font-semibold' : ''
              }`
            }
            onClick={() => updateQuery('price', PRICE.CHEAP)}
          >
            $
          </button>
          <button
            className={
              'border-r border-t border-b w-full text-reg font-light p-2 ' +
              `${
                searchParams.get('price') === PRICE.REGULAR
                  ? 'font-semibold'
                  : ''
              }`
            }
            onClick={() => updateQuery('price', PRICE.REGULAR)}
          >
            $$
          </button>
          <button
            onClick={() => updateQuery('price', PRICE.EXPENSIVE)}
            className={
              'border-r border-t border-b w-full text-reg font-light p-2 rounded-r ' +
              `${
                searchParams.get('price') === PRICE.EXPENSIVE
                  ? 'font-semibold'
                  : ''
              }`
            }
          >
            $$$
          </button>
        </div>
      </div>
    </div>
  )
}
