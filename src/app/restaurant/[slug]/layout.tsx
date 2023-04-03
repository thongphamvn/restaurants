import Header from './components/Header'

// FIXME: must be dynamic for each slug
export const metadata = {
  title: 'Name of restaurant',
  description: '...',
}

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
        {children}
      </div>
    </>
  )
}
