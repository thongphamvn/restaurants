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
      <div className='flex m-auto mx-4 justify-between items-start 0 -mt-11 gap-4'>
        <div className='w-full'>{children}</div>
        <div className='hidden lg:block bg-white rounded p-3 shadow'>
          <Reservation />
        </div>
      </div>
    </>
  )
}
