import { prisma } from '@/utils'
import { PRICE } from '@prisma/client'
import { Suspense } from 'react'
import SearchBar from '../components/SearchBar'
import ListLoading from './components/ListLoading'
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

const fetchLocations = async () => {
  return prisma.location.findMany()
}

const fetchCuisines = async () => {
  return prisma.cuisine.findMany()
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

async function RestaurantList({ searchParams }: Props) {
  const searchResults = await searchRestaurants(searchParams)

  return (
    <div>
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
  )
}

export default async function page({ searchParams }: Props) {
  const [locations, cuisines] = await Promise.all([
    fetchLocations(),
    fetchCuisines(),
  ])

  return (
    <>
      <div className='bg-gradient-to-r to-[#5f6984] from-[#0f1f47] p-2'>
        <SearchBar />
      </div>
      <div className='max-w-screen-lg flex p-4 m-auto'>
        <div className='hidden lg:block'>
          <SideBar locations={locations} cuisines={cuisines} />
        </div>
        <Suspense
          key={Object.values(searchParams).join('')}
          fallback={<ListLoading />}
        >
          {/* @ts-expect-error Async Server Component */}
          <RestaurantList searchParams={searchParams}></RestaurantList>
        </Suspense>
      </div>
    </>
  )
}
