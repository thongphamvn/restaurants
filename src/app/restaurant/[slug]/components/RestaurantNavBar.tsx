'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RestaurantNavBar({ slug }: { slug: string }) {
  const pathName = usePathname()
  const overviewPath = `/restaurant/${slug}`
  const menuPath = `/restaurant/${slug}/menu`

  return (
    <nav className='flex text-reg pb-2'>
      <Link
        href={overviewPath}
        className={classNames(
          'mr-7 border-b-2',
          pathName === overviewPath ? 'border-b-[#5f6984]' : 'border-b-white'
        )}
      >
        Overview
      </Link>
      <Link
        href={menuPath}
        className={classNames(
          'mr-7 border-b-2',
          pathName === menuPath ? 'border-b-[#5f6984]' : 'border-b-white'
        )}
      >
        Menu
      </Link>
    </nav>
  )
}
