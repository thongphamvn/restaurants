import { SlugParams } from '@/types'
import { PrismaClient } from '@prisma/client'
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

  return items
}

export default async function MenuPage({ params: { slug } }: SlugParams) {
  const items = await fetchMenuBySlug(slug)
  return (
    <div className='bg-white rounded p-3 shadow w-full'>
      <RestaurantNavBar slug={slug} />
      <Menu items={items} />
    </div>
  )
}
