'use client'

import { Cuisine, Location, PRICE } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useEffect, useState } from 'react'

type Props = {
  locations: Location[]
  cuisines: Cuisine[]
}

type SelectedQuery = {
  cuisine?: string
  region?: string
  price?: PRICE
}

const getQueryFromSearchParams = (params: ReadonlyURLSearchParams) => {
  const paramsObj: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    paramsObj[key] = value
  }
  return paramsObj as SelectedQuery
}

export default function SideBar({ locations, cuisines }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [query, setQuery] = useState<SelectedQuery>(
    getQueryFromSearchParams(searchParams)
  )

  const updateQuery = (key: string, value: string) => {
    setQuery({ ...query, [key]: value })
  }

  useEffect(() => {
    const params = new URLSearchParams(query)
    router.push(`${pathname}?${params}`)
  }, [query])

  const activeItemCls = (type: keyof SelectedQuery, name: string) =>
    classNames(
      'font-light text-reg capitalize cursor-pointer border-l-4',
      query[type] === name ? 'border-[#0f1f47]' : 'border-white'
    )

  const priceCls = (price: PRICE) =>
    classNames(
      'border w-full text-reg font-light p-2',
      query.price === price ? 'bg-[#0f1f47] text-white' : ''
    )

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
              className={activeItemCls('region', location.name)}
            >
              <span className='ml-2'>{location.name}</span>
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
              className={activeItemCls('cuisine', cuisine.name)}
            >
              <span className='ml-2'>{cuisine.name}</span>
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
            className={priceCls(PRICE.CHEAP)}
            onClick={() => updateQuery('price', PRICE.CHEAP)}
          >
            $
          </button>
          <button
            className={priceCls(PRICE.REGULAR)}
            onClick={() => updateQuery('price', PRICE.REGULAR)}
          >
            $$
          </button>
          <button
            onClick={() => updateQuery('price', PRICE.EXPENSIVE)}
            className={priceCls(PRICE.EXPENSIVE)}
          >
            $$$
          </button>
        </div>
      </div>
    </div>
  )
}
