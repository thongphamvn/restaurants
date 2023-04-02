import NavBar from '@/app/components/NavBar';
import Description from './components/Description';
import Header from './components/Header';
import Images from './components/Images';
import Ratings from './components/Ratings';
import Reservation from './components/Reservation';
import RestaurantNavBar from './components/RestaurantNavBar';
import Reviews from './components/Reviews';
import Title from './components/Title';

export default function RestaurantDetail() {
  return (
    <main className='bg-gray-100 min-h-screen w-screen'>
      <main className='max-w-screen-2xl m-auto bg-white'>
        <NavBar />
        <Header />
        <div className='flex m-auto w-2/3 justify-between items-start 0 -mt-11'>
          <div className='bg-white w-[70%] rounded p-3 shadow'>
            <RestaurantNavBar />
            <Title />
            <Ratings />
            <Description />
            <Images />
            <Reviews />
          </div>
          <Reservation />
        </div>
      </main>
    </main>
  );
}
