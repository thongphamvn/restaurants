import { Item } from '@prisma/client'
import MenuCard from './MenuCard'

export default function Menu({ items }: { items: Item[] }) {
  return (
    <div className='bg-white mt-5'>
      <div className='flex flex-col md:flex-row flex-wrap justify-between'>
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
