import { PrismaClient } from '@prisma/client'

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
export async function GET(request: Request) {
  const res = await fetchMenuBySlug('ramakrishna-indian-restaurant-ottawa')

  return new Response('Hello, Next.js!' + ' ' + JSON.stringify(res))
}
