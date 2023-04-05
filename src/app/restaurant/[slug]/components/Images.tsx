import Image from 'next/image'

export default function Images({ value }: { value: string[] }) {
  return (
    <div>
      <h1 className='font-bold text-3xl mt-10 mb-7 border-b pb-5'>
        {value.length} photos
      </h1>
      <div className='flex gap-1 flex-wrap'>
        {value.map((image, index) => (
          <Image
            key={index}
            className='object-cover w-[48%] md:w-[24%]'
            src={image}
            width={280}
            height={220}
            alt=''
          />
        ))}
      </div>
    </div>
  )
}
