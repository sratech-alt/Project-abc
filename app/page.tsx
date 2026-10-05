import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { SiteShell } from '@/components/SiteShell';
import { TechStack } from '@/components/TechStack';
import { Testimonials } from '@/components/Testimonials';
import { WhyUs } from '@/components/WhyUs';
import { getProjects, getServices, getStack } from '@/lib/catalog';

/** The home page; sections appear in scroll order. Services, stack and projects are read at build time. */
export default async function HomePage() {
  const [services, stack, projects] = await Promise.all([getServices(), getStack(), getProjects()]);

  return (
    <SiteShell>
      <Hero />
      <About />
      <Services services={services} />
      <TechStack stack={stack} />
      <Projects projects={projects} />
      <WhyUs />
      <Testimonials />
      <Contact />
    </SiteShell>
  );
}
