import Image from 'next/image'
import noStar from '../../../public/empty-star.png'
import fullStar from '../../../public/full-star.png'
import halfStar from '../../../public/half-star.png'

export default function Star({ value }: { value: number }) {
  const hasHalf = value % 1 !== 0

  const indicators = Array(5)
    .fill(0)
    .map((_, i) => {
      if (hasHalf && i === Math.floor(value)) {
        return halfStar
      }

      if (i < value) {
        return fullStar
      }

      return noStar
    })

  return (
    <div className='flex pb-1 h-4 items-center gap-x-0.5'>
      {indicators.map((src, i) => (
        <Image height={16} key={i} alt='' src={src} />
      ))}
    </div>
  )
}
