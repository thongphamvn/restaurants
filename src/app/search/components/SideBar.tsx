'use client'

import { Cuisine, Location, PRICE } from '@prisma/client'
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
    <div className='w-1/5'>
      <div className='border-b pb-4'>
        <h1 className='mb-2'>Region</h1>
        {locations.map((location) => (
          <p
            onClick={() => updateQuery('region', location.name)}
            key={location.id}
            className='font-light text-reg capitalize cursor-pointer'
          >
            {location.name}
          </p>
        ))}
      </div>
      <div className='border-b pb-4 mt-3'>
        <h1 className='mb-2'>Cuisine</h1>
        {cuisines.map((cuisine) => (
          <p
            onClick={() => updateQuery('cuisine', cuisine.name)}
            key={cuisine.id}
            className='font-light text-reg capitalize cursor-pointer'
          >
            {cuisine.name}
          </p>
        ))}
      </div>
      <div className='mt-3 pb-4'>
        <h1 className='mb-2'>Price</h1>
        <div className='flex'>
          <button
            className='border w-full text-reg font-light rounded-l p-2'
            onClick={() => updateQuery('price', PRICE.CHEAP)}
          >
            $
          </button>
          <button
            className='border-r border-t border-b w-full text-reg font-light p-2'
            onClick={() => updateQuery('price', PRICE.REGULAR)}
          >
            $$
          </button>
          <button
            onClick={() => updateQuery('price', PRICE.EXPENSIVE)}
            className='border-r border-t border-b w-full text-reg font-light p-2 rounded-r'
          >
            $$$
          </button>
        </div>
      </div>
    </div>
  )
}
