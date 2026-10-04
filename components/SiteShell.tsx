import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { getPageLinks } from '@/lib/content';

/** Header, <main> and footer shared by every page. Works out which content pages to link to. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const pageLinks = await getPageLinks();
  return (
    <>
      <Navbar pageLinks={pageLinks} />
      <main id="main">{children}</main>
      <Footer pageLinks={pageLinks} />
    </>
  );
}
