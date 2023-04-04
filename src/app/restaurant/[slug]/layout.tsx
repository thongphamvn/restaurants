import Header from './components/Header'
import Reservation from './components/Reservation'

// FIXME: must be dynamic for each slug
export const metadata = {
  title: 'Name of restaurant',
  description: '...',
}

export default function RestaurantLayout({
  children,
  params: { slug },
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <>
      <Header name={slug} />
      <div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
        {children}
        <div className='w-[27%] relative'>
          <Reservation />
        </div>
      </div>
    </>
  )
}
