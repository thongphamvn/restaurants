import {
  Cuisine,
  Location,
  PrismaClient,
  Restaurant,
  Review,
} from '@prisma/client'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'

const inter = Inter({ subsets: ['latin'] })
const prisma = new PrismaClient()

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

export default async function Home() {
  const restaurants = await fetchRestaurants()

  return (
    <main className={inter.className}>
      <Header />
      <div className='mx-4 mb-8 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </main>
  )
}
