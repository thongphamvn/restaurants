export default function Loading() {
  return (
    <div className='animate-pulse mx-4 mb-8 mt-4 rounded pb-4'>
      <div className='h-32 bg-gray-200'></div>
      <div className='mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {Array.from({ length: 8 }, (_, i) => i + 1).map((key) => (
          <div key={key} className='h-36 bg-gray-200'></div>
        ))}
      </div>
    </div>
  )
}
