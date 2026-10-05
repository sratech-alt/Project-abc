import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getPageLinks } from '@/lib/content';
import { availabilityLabel } from '@/lib/site';

/** Header, <main> and footer shared by every page. Works out which content pages to link to. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const pageLinks = await getPageLinks();
  return (
    <>
      {/* Worked out here, at build time, so the server and the browser always agree on the text. */}
      <Navbar pageLinks={pageLinks} availability={availabilityLabel()} />
      <main id="main">{children}</main>
      <Footer pageLinks={pageLinks} />
    </>
  );
}
