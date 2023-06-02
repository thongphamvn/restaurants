export default function SideBarLoading() {
  return (
    <div className='w-[200px] pr-4'>
      <div className='ml-1 flex flex-col gap-4 animate-pulse rounded'>
        <div className='flex flex-col gap-4'>
          <div className='h-8 bg-gray-200'></div>
          <div className='h-8 bg-gray-200'></div>
          <div className='h-8 bg-gray-200'></div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='h-8 bg-gray-200'></div>
          <div className='h-8 bg-gray-200'></div>
          <div className='h-8 bg-gray-200'></div>
        </div>
      </div>
    </div>
  )
}
