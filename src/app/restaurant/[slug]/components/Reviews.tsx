import Star from '@/app/components/Star'
import { calculateReviewScore } from '@/utils'
import { Review } from '@prisma/client'

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div>
      <h1 className='font-bold text-3xl mt-10 mb-7 borber-b pb-5'>
        What {reviews.length} {reviews.length > 1 ? `people` : 'person'} are
        saying
      </h1>
      <div>
        {reviews.map((review) => (
          <div key={review.id} className='border-b pb-7 mb-7'>
            <div className='flex'>
              <div className='w-1/6 flex flex-col items-center'>
                <div className='rounded-full bg-blue-400 w-16 h-16 flex items-center justify-center'>
                  <h2 className='text-white text-2xl'>
                    {(review.first_name[0] + review.last_name[0]).toUpperCase()}
                  </h2>
                </div>
                <p className='text-center'>
                  {review.first_name + ' ' + review.last_name}
                </p>
              </div>
              <div className='ml-10 w-5/6'>
                <div className='flex items-center'>
                  <div className='flex mr-5'>
                    <Star value={calculateReviewScore(reviews)} />
                  </div>
                </div>
                <div className='mt-5'>
                  <p className='text-lg font-light'>{review.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
