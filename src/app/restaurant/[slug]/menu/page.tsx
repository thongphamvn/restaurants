import { PrismaClient } from '@prisma/client'
import { Metadata } from 'next'
import Menu from '../components/Menu'
import RestaurantNavBar from '../components/RestaurantNavBar'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic'
const fetchMenuBySlug = async (slug: string) => {
  // fetch items by restaurant slug
  const items = await prisma.item.findMany({
    where: {
      restaurant: {
        slug,
      },
    },
  })

  console.log('items', items.length)
  return items
}

// FIXME: must be dynamic for each slug
export const metadata: Metadata = {
  title: 'menu of Name of restaurant',
  description: '...',
  icons: {},
}

export default async function MenuPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const items = await fetchMenuBySlug(slug)
  return (
    <div className='bg-white rounded p-3 shadow w-full'>
      <RestaurantNavBar slug={slug} />
      <Menu items={items} />
    </div>
  )
}
