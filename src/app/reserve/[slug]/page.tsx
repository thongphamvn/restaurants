import { prisma } from '@/utils'
import Form from './components/Form'
import Header from './components/Header'

const fetchRestaurantBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
  })

  if (!restaurant) {
    throw new Error('Restaurant not found')
  }

  return restaurant
}

export default async function ReservePage({
  params: { slug },
  searchParams: { day, time, partySize },
}: {
  params: { slug: string }
  searchParams: { day: string; time: string; partySize: string }
}) {
  const restaurant = await fetchRestaurantBySlug(slug)

  return (
    <div className='border-t h-screen'>
      <div className='py-9 w-3/5 m-auto'>
        <Header
          restaurant={restaurant}
          day={day}
          time={time}
          partySize={partySize}
        />
        <Form restaurant={restaurant} />
      </div>
    </div>
  )
}
