import { RestaurantType } from '@/app/page'
import { SlugParams } from '@/types'
import { prisma } from '@/utils'
import { Suspense } from 'react'
import Description from './components/Description'
import Images from './components/Images'
import Ratings from './components/Ratings'
import Reservation from './components/Reservation'
import Reviews from './components/Reviews'

const fetchRestaurantBySlug = async (slug: string): Promise<RestaurantType> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    include: {
      cuisine: true,
      location: true,
      reviews: true,
    },
  })

  if (!restaurant) {
    throw new Error('Restaurant not found')
  }
  return restaurant
}

async function RestaurantDetail({ slug }: { slug: string }) {
  const restaurant = await fetchRestaurantBySlug(slug)

  return (
    <div>
      <Description value={restaurant.description} />
      <Ratings reviews={restaurant.reviews} />
      <Images value={restaurant.images} />
      <div className='lg:hidden'>
        <Reservation restaurant={restaurant} />
      </div>
      <Reviews reviews={restaurant.reviews} />
    </div>
  )
}

function Loading() {
  return (
    <div className='w-full flex flex-col gap-4 '>
      <div className='h-8 bg-gray-200 rounded'></div>
      <div className='h-24 bg-gray-200 rounded'></div>
      <div className='h-48 bg-gray-200 rounded'></div>
    </div>
  )
}

export default async function RestaurantDetailPage({
  params: { slug },
}: SlugParams) {
  return (
    <div className='bg-white rounded p-3 shadow'>
      <Suspense fallback={<Loading />}>
        {/* @ts-expect-error Async Server Component */}
        <RestaurantDetail slug={slug} />
      </Suspense>
    </div>
  )
}
