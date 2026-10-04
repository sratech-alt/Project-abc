import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { SiteShell } from '@/components/SiteShell';
import { TechStack } from '@/components/TechStack';
import { Testimonials } from '@/components/Testimonials';
import { WhyUs } from '@/components/WhyUs';

/** The home page; sections appear in scroll order. */
export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <About />
      <Services />
      <TechStack />
      <Projects />
      <WhyUs />
      <Testimonials />
      <Contact />
    </SiteShell>
  );
}
