import { PRICE, PrismaClient } from '@prisma/client'
import SearchBar from '../components/SearchBar'
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
export const dynamic = 'force-dynamic'
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
      reviews: true,
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
      <div className='bg-gradient-to-r to-[#5f6984] from-[#0f1f47] p-2'>
        <SearchBar />
      </div>
      <div className='max-w-screen-lg flex p-4 m-auto'>
        <div className='hidden lg:block'>
          <SideBar locations={locations} cuisines={cuisines} />
        </div>
        {searchResults.length ? (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            {searchResults.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className='mx-auto py-8 font-light italic'>No results found</div>
        )}
      </div>
    </>
  )
}
