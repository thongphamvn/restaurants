import { calculateReviewScore } from '@/utils/utils'
import Image from 'next/image'
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
    <div className=''>
      <div className='w-full rounded overflow-hidden border cursor-pointer'>
        <Link href={`/restaurant/${slug}`}>
          <div className='w-full'>
            <Image
              src={main_image}
              width={700}
              height={475}
              alt=''
              className='object-cover h-36 md:h-48'
            />
          </div>

          <div className='p-1'>
            <h3 className='font-bold text-2xl mb-2'>{name}</h3>
            <div className='flex items-center'>
              <Star value={calculateReviewScore(restaurant.reviews)} />
              <div className='ml-2'>{restaurant.reviews.length} reviews</div>
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
