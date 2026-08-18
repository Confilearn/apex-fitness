import { Seo, FaqSchema } from '../components/Seo';
import { faqs } from '../data/content';
import { BookingHero } from '../sections/BookingHero';
import { Location } from '../sections/Location';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';

export default function GetStarted() {
  return (
    <div className="bg-bg">
      <Seo
        title="Book a Free Discovery Call — Apex Performance"
        description="Book a free 20-minute discovery call with Marcus Kane. We cover your goals, current fitness level and schedule, then build a plan within 48 hours."
      />
      <FaqSchema faqs={faqs} />

      <main id="main">
        <BookingHero />
        <Location />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
