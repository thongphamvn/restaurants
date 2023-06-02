const formatName = (name: string) => {
  return name
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Header({ name }: { name: string }) {
  return (
    <div className='overflow-hidden'>
      <div className='py-24 bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center'>
        <h1 className='text-4xl text-white captitalize text-shadow capitalize text-center'>
          {formatName(name)}
        </h1>
      </div>
    </div>
  )
}
