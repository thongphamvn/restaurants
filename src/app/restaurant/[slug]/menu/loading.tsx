export default function Loading() {
  return (
    <div className='mx-4 mt-4 grid grid-cols-2 gap-4'>
      {Array.from({ length: 8 }, (_, i) => i + 1).map((key) => (
        <div key={key} className='h-36 bg-gray-200 rounded'></div>
      ))}
    </div>
  )
}
