'use client'

import LoadingSpinner from '@/app/components/LoadingSpinner'
import { Restaurant } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

export default function Form({ restaurant }: { restaurant: Restaurant }) {
  const [inputs, setInputs] = useState({
    bookerFirstName: '',
    bookerLastName: '',
    bookerPhone: '',
    bookerEmail: '',
    bookerOccasion: '',
    bookerRequest: '',
  })
  const [didBook, setDidBook] = useState(false)
  const params = useSearchParams()
  const paramsArray = [...params.entries()]
  const paramsObject = Object.fromEntries(paramsArray)

  const { mutate: submitReservation, isLoading } = useMutation({
    mutationFn: () => {
      return axios.post('/api/reserve', inputs, {
        params: {
          ...paramsObject,
          slug: restaurant.slug,
        },
      })
    },

    onSuccess: (data: any) => {
      setDidBook(true)
    },
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((inputs) => ({ ...inputs, [name]: value }))
  }

  const btnDisabled = () => {
    return Object.values(inputs).some((input) => input === '')
  }

  const handleSubmit = () => {
    if (btnDisabled() || isLoading) {
      return
    }
    submitReservation()
  }

  if (didBook) {
    return (
      <div className='mt-16 text-center w-full'>
        <p className='text-xl font-bold'>Thank you for your reservation!</p>
      </div>
    )
  }

  return (
    <div className='mt-10 flex flex-wrap justify-between w-[660px]'>
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='First name'
        value={inputs.bookerFirstName}
        name='bookerFirstName'
        onChange={(e) => handleChange(e)}
      />
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='Last name'
        value={inputs.bookerLastName}
        name='bookerLastName'
        onChange={(e) => handleChange(e)}
      />
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='Phone number'
        value={inputs.bookerPhone}
        name='bookerPhone'
        onChange={(e) => handleChange(e)}
      />
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='Email'
        value={inputs.bookerEmail}
        name='bookerEmail'
        onChange={(e) => handleChange(e)}
      />
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='Occasion (optional)'
        value={inputs.bookerOccasion}
        name='bookerOccasion'
        onChange={(e) => handleChange(e)}
      />
      <input
        type='text'
        className='border rounded p-3 w-80 mb-4'
        placeholder='Requests (optional)'
        value={inputs.bookerRequest}
        name='bookerRequest'
        onChange={(e) => handleChange(e)}
      />
      <button
        disabled={btnDisabled()}
        onClick={handleSubmit}
        className='bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300'
      >
        {isLoading ? <LoadingSpinner /> : <p>Complete reservation</p>}
      </button>
      <p className='mt-4 text-sm'>
        By clicking “Complete reservation” you agree to the OpenTable Terms of
        Use and Privacy Policy. Standard text message rates may apply. You may
        opt out of receiving text messages at any time.
      </p>
    </div>
  )
}
