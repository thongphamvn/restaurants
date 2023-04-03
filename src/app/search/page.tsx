import { PRICE, PrismaClient } from '@prisma/client'
import Header from './components/Header'
import RestaurantCard from './components/RestaurantCard'
import SideBar from './components/SideBar'

type Props = {
  searchParams: {
    search?: string
    region?: string
    cuisine?: string
    price?: PRICE
  }
}

const prisma = new PrismaClient()

const fetchLocations = async () => {
  const locations = await prisma.location.findMany()
  return locations
}

const fetchCuisines = async () => {
  const cuisines = await prisma.cuisine.findMany()
  return cuisines
}

const searchRestaurants = async ({
  search: q,
  region,
  cuisine,
  price,
}: Props['searchParams']) => {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      location: { name: region },
      cuisine: { name: cuisine },
      price,
      OR: [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
        {
          location: {
            name: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      cuisine: true,
      location: true,
    },
  })
  return restaurants
}

export default async function page({ searchParams }: Props) {
  const searchResults = await searchRestaurants(searchParams)
  const locations = await fetchLocations()
  const cuisines = await fetchCuisines()

  return (
    <>
      <Header />
      <div className='flex py-4 m-auto w-2/3 justify-between items-start'>
        <SideBar locations={locations} cuisines={cuisines} />
        <div className='w-5/6'>
          {searchResults.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </>
  )
}
