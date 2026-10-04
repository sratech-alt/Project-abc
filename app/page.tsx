import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { TechStack } from '@/components/TechStack';
import { Testimonials } from '@/components/Testimonials';
import { WhyUs } from '@/components/WhyUs';

/** The whole site is this one page; sections appear in scroll order. */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <TechStack />
        <Projects />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
