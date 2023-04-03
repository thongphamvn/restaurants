import { Cuisine, Location, PrismaClient, Restaurant } from '@prisma/client'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'

const inter = Inter({ subsets: ['latin'] })
const prisma = new PrismaClient()

export type RestaurantType = Restaurant & {
  cuisine: Cuisine
  location: Location
}

const fetchRestaurants = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      cuisine: true,
      location: true,
    },
  })

  return restaurants
}

export default async function Home() {
  const restaurants = await fetchRestaurants()

  return (
    <main className={inter.className}>
      <Header />
      <div className='py-3 px-36 mt-10 flex flex-wrap'>
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </main>
  )
}
