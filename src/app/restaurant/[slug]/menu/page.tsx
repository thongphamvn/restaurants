import { Metadata } from 'next'
import Menu from '../components/Menu'
import RestaurantNavBar from '../components/RestaurantNavBar'

// FIXME: must be dynamic for each slug
export const metadata: Metadata = {
  title: 'menu of Name of restaurant',
  description: '...',
  icons: {},
}

export default function MenuPage() {
  return (
    <div className='bg-white w-[70%] rounded p-3 shadow'>
      <RestaurantNavBar />
      <Menu />
    </div>
  )
}
