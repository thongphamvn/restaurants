'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get('search') || '')
  const handleBtnClick = () => {
    const params = new URLSearchParams(searchParams)
    params.set('search', location)
    router.push(`/search?${params}`)
  }

  return (
    <div className='text-left text-lg py-3 m-auto flex justify-center'>
      <input
        className='rounded  mr-3 p-2 w-[450px]'
        type='text'
        value={location}
        placeholder='State, city or town'
        onChange={(e) => {
          setLocation(e.target.value)
        }}
      />
      <button
        onClick={handleBtnClick}
        className='rounded bg-red-600 px-9 py-2 text-white'
      >
        {`Let's go`}
      </button>
    </div>
  )
}
