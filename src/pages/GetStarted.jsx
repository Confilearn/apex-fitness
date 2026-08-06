import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { BookingHero } from '../sections/BookingHero';
import { Location } from '../sections/Location';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';

export default function GetStarted() {
  useDocumentTitle('Get Started — Jordan Lee Fitness');

  return (
    <div className="bg-bg">
      <BookingHero />
      <Location />
      <FAQ />
      <Footer />
    </div>
  );
}
