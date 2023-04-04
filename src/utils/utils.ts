import { Review } from '@prisma/client'

export const calculateReviewScore = (reviews: Review[]) => {
  if (reviews.length === 0) return 0

  const total = reviews.reduce((acc, review) => acc + review.rating, 0)
  const inv = 1.0 / 0.5
  return Math.round((total / reviews.length) * inv) / inv
}
