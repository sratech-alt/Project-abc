import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { MotionProvider } from '@/components/MotionProvider';
import { SpotlightTracker } from '@/components/ui/SpotlightTracker';
import { socials } from '@/lib/data';
import { site } from '@/lib/site';
import './globals.css';

// Fonts are downloaded at build time and served from our own domain — no runtime request to Google.
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${site.name} — software development studio in Kathmandu, Nepal` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/og.png'],
  },
  icons: {
    // The favicon follows the browser's colour scheme so it stays visible on light and dark tab bars.
    icon: [
      { url: '/favicon-light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: 'dark',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  logo: `${site.url}/apple-touch-icon.png`,
  image: `${site.url}/og.png`,
  description: site.description,
  email: site.emails.sales,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    postalCode: site.postalCode,
    addressCountry: site.countryCode,
  },
  areaServed: 'Worldwide',
  sameAs: socials.map((social) => social.url),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        {/* Scroll reveals start hidden and are shown by JS; without JS, show everything. */}
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <a
          href="#main"
          className="btn btn-primary fixed top-3 left-3 z-[100] h-10 -translate-y-20 px-4 text-sm focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
        <SpotlightTracker />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
