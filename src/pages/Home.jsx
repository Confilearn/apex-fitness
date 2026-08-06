import { useDocumentTitle } from '../hooks/useDocumentTitle';
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
  useDocumentTitle('Jordan Lee Fitness — Built Different. Train Different.');

  return (
    <div className="bg-bg">
      <Intro />
      <Hero />
      <About />
      <Services />
      <Process />
      <ClientResults />
      <Reviews />
      <Pricing />
      <FAQ id="faq" animateRadius />
      <Footer />
    </div>
  );
}
