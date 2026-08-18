import { Seo, LocalBusinessSchema, FaqSchema } from '../components/Seo';
import { business, faqs, gyms, plans, reviewData } from '../data/content';
import { Intro } from '../sections/Intro';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Services } from '../sections/Services';
import { Process } from '../sections/Process';
import { ClientResults } from '../sections/ClientResults';
import { Reviews } from '../sections/Reviews';
import { Pricing } from '../sections/Pricing';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-bg">
      <Seo title={`${business.name} — ${business.tagline}`} description={business.description} />
      <LocalBusinessSchema gyms={gyms} plans={plans} reviews={reviewData} />
      <FaqSchema faqs={faqs} />

      <Intro />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Process />
        <ClientResults />
        <Reviews />
        <Pricing />
        <FAQ id="faq" animateRadius />
      </main>
      <Footer />
    </div>
  );
}
