'use client'

import Image from 'next/image'
import errorI from '../../public/error.png'

export default function Error({ error }: { error: Error }) {
  return (
    <div className='h-screen bg-gray-200 flex flex-col justify-center items-center'>
      <Image src={errorI} alt='' />
      <div className='px-9 py-14'>
        <h3 className='text-3xl font-bold'>{error.message}</h3>
      </div>
    </div>
  )
}
