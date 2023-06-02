import { prisma } from '@/utils'
import { Cuisine, Location, Restaurant, Review } from '@prisma/client'
import { Suspense } from 'react'
import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'

export type RestaurantType = Restaurant & {
  cuisine: Cuisine
  location: Location
  reviews: Review[]
}

const fetchRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      cuisine: true,
      location: true,
      reviews: true,
    },
  })

  return restaurants
}

function Loading() {
  return (
    <div className='mx-4 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {Array.from({ length: 8 }, (_, i) => i + 1).map((key) => (
        <div key={key} className='h-48 bg-gray-200 rounded'></div>
      ))}
    </div>
  )
}

async function RestaurantList() {
  const restaurants = await fetchRestaurants()
  return (
    <div className='mx-4 mb-8 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}

export default async function Home() {
  return (
    <main>
      <Header />

      <Suspense fallback={<Loading />}>
        {/* @ts-expect-error Async Server Component */}
        <RestaurantList />
      </Suspense>
    </main>
  )
}
