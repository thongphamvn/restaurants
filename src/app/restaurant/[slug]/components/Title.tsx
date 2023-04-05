export default function Title({ value }: { value: string }) {
  return (
    <div className='mt-4 border-b pb-6 text-center'>
      <h1 className='font-bold text-4xl md:text-6xl'>{value}</h1>
    </div>
  )
}
