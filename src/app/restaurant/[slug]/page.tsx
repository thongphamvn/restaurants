import Description from './components/Description'
import Images from './components/Images'
import Ratings from './components/Ratings'
import Reservation from './components/Reservation'
import RestaurantNavBar from './components/RestaurantNavBar'
import Reviews from './components/Reviews'
import Title from './components/Title'

export default function RestaurantDetail() {
  return (
    <>
      <div className='bg-white w-[70%] rounded p-3 shadow'>
        <RestaurantNavBar />
        <Title />
        <Ratings />
        <Description />
        <Images />
        <Reviews />
      </div>
      <div className='w-[27%] relative'>
        <Reservation />
      </div>
    </>
  )
}
