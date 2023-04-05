import SearchBar from './SearchBar'

export default function Header() {
  return (
    <div className='bg-gradient-to-r from-[#0f1f47] to-[#5f6984] p-2'>
      <div className='text-center my-4 mt-8'>
        <h1 className='text-white text-2xl md:text-4xl font-bold mb-2'>
          Find your table for any occasion
        </h1>
        <SearchBar />
      </div>
    </div>
  )
}
