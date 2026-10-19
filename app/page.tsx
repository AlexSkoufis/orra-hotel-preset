import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Rooms from '@/components/Rooms';
import Day from '@/components/Day';
import Dining from '@/components/Dining';
import Baths from '@/components/Baths';
import Gallery from '@/components/Gallery';
import Arrive from '@/components/Arrive';
import Footer from '@/components/Footer';
import BookingBar from '@/components/BookingBar';
import Preloader from '@/components/Preloader';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <Rooms />
        <Day />
        <Dining />
        <Baths />
        <Gallery />
        <Arrive />
      </main>
      <Footer />
      <BookingBar />
    </>
  );
}
