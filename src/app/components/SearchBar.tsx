'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');

  return (
    <div className='text-left text-lg py-3 m-auto flex justify-center'>
      <input
        className='rounded  mr-3 p-2 w-[450px]'
        type='text'
        value={location}
        placeholder='State, city or town'
        onChange={(e) => {
          setLocation(e.target.value);
        }}
      />
      <button
        onClick={() => router.push('/search')}
        className='rounded bg-red-600 px-9 py-2 text-white'
      >
        {`Let's go`}
      </button>
    </div>
  );
}
