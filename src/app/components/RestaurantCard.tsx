import { calculateReviewScore } from '@/utils/utils'
import Link from 'next/link'
import { RestaurantType } from '../page'
import Price from './Price'
import Star from './Star'

export default function RestaurantCard({
  restaurant,
}: {
  restaurant: RestaurantType
}) {
  const { name, main_image, price, slug, cuisine, location } = restaurant

  return (
    <div className='py-3 mt-10 flex flex-wrap justify-center'>
      <div className='w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer'>
        <Link href={`/restaurant/${slug}`}>
          <img src={main_image} alt='' className='w-full h-36' />
          <div className='p-1'>
            <h3 className='font-bold text-2xl mb-2'>{name}</h3>
            <div className='flex items-center'>
              <Star value={calculateReviewScore(restaurant.reviews)} />
              <p className='ml-2'>{restaurant.reviews.length} reviews</p>
            </div>
            <div className='flex text-reg font-light capitalize'>
              <p className=' mr-3'>{cuisine.name}</p>
              <p className='mr-3'>
                <Price price={price} />
              </p>
              <p>{location.name}</p>
            </div>
            <p className='text-sm mt-1 font-bold'>Booked 3 times today</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
