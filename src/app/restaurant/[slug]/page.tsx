import { RestaurantType } from '@/app/page'
import { PrismaClient } from '@prisma/client'
import Description from './components/Description'
import Images from './components/Images'
import Ratings from './components/Ratings'
import Reservation from './components/Reservation'
import RestaurantNavBar from './components/RestaurantNavBar'
import Reviews from './components/Reviews'
import Title from './components/Title'

const prisma = new PrismaClient()

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

export default async function RestaurantDetail({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const restaurant = await fetchRestaurantBySlug(slug)

  return (
    <>
      <div className='bg-white rounded p-3 shadow'>
        <RestaurantNavBar slug={restaurant.slug} />
        <Title value={restaurant.name} />
        <Ratings reviews={restaurant.reviews} />
        <Description value={restaurant.description} />
        <Images value={restaurant.images} />
        <div className='lg:hidden'>
          <Reservation />
        </div>
        <Reviews reviews={restaurant.reviews} />
      </div>
    </>
  )
}
