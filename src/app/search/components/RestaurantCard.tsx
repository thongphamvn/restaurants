import Price from '@/app/components/Price'
import Star from '@/app/components/Star'
import { RestaurantType } from '@/app/page'
import { calculateReviewScore } from '@/utils/utils'
import Link from 'next/link'

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantType
}) {
  const rating = calculateReviewScore(restaurant.reviews)

  const renderRating = () => {
    if (rating > 4) return 'Awesome'
    if (rating > 3) return 'Great'
    if (rating > 2) return 'Good'
    return ''
  }

  return (
    <div className='border-b flex pb-5'>
      <img
        src='https://images.otstatic.com/prod1/49153814/2/medium.jpg'
        alt=''
        className='w-44 rounded'
      />
      <div className='pl-5'>
        <h2 className='text-3xl'>{restaurant.name}</h2>
        <div className='flex items-start'>
          <Star value={rating} />
          <p className='ml-2 text-sm'>{renderRating()}</p>
        </div>
        <div className='mb-9'>
          <div className='font-light flex text-reg'>
            <p className='mr-4'>
              <Price price={restaurant.price} />
            </p>
            <p className='mr-4 capitalize'>{restaurant.cuisine.name}</p>
            <p className='mr-4 capitalize'>{restaurant.location.name}</p>
          </div>
        </div>
        <div className='text-red-600'>
          <Link href={`/restaurant/${restaurant.slug}`}>
            View more information
          </Link>
        </div>
      </div>
    </div>
  )
}
