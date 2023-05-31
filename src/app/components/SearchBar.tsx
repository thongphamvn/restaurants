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
    <div className='text-left py-3 m-auto flex justify-center'>
      <input
        className='rounded  w-[70%] max-w-md mr-3 p-2'
        type='text'
        value={location}
        placeholder='Location, cuisine or restaurant'
        onChange={(e) => {
          setLocation(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleBtnClick()
        }}
      />
      <button
        onClick={handleBtnClick}
        className='rounded bg-red-600 px-4 py-2 text-white'
      >
        Search
      </button>
    </div>
  )
}
