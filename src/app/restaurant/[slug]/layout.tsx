import { RestaurantType } from '@/app/page'
import { PrismaClient } from '@prisma/client'
import Header from './components/Header'
import Reservation from './components/Reservation'

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

type Props = {
  params: { slug: string }
  children: React.ReactNode
}

export const generateMetadata = async ({ params: { slug } }: Props) => {
  const restaurant = await fetchRestaurantBySlug(slug)
  return {
    title: restaurant.name,
    description: restaurant.name,
  }
}

export default async function RestaurantLayout({
  children,
  params: { slug },
}: Props) {
  const restaurant = await fetchRestaurantBySlug(slug)
  return (
    <>
      <Header name={slug} />
      <div className='flex m-auto mx-4 justify-between items-start 0 -mt-11 gap-4'>
        <div className='w-full'>{children}</div>
        <div className='hidden lg:block bg-white rounded p-3 shadow'>
          <Reservation restaurant={restaurant} />
        </div>
      </div>
    </>
  )
}
