import Star from '@/app/components/Star'
import { calculateReviewScore } from '@/utils/utils'
import { Review } from '@prisma/client'

export default function Ratings({ reviews }: { reviews: Review[] }) {
  const rating = calculateReviewScore(reviews)

  return (
    <div className='flex items-end'>
      <div className='ratings mt-2 flex items-center'>
        <p>
          <Star value={rating} />
        </p>
        <p className='text-reg ml-3'>{rating}</p>
      </div>
      <div>
        <p className='text-reg ml-4'>{reviews.length} Reviews</p>
      </div>
    </div>
  )
}
