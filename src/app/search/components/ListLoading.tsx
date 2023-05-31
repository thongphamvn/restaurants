export default function ListLoading() {
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className='flex items-center space-x-4 animate-pulse'>
          <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
          <div className='flex-1 py-2 space-y-2'>
            <div className='w-full h-4 bg-gray-200 rounded'></div>
            <div className='w-2/3 h-4 bg-gray-200 rounded'></div>
          </div>
        </div>
      ))}
    </div>
  )
}
