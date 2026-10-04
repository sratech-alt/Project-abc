import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: `Page not found — ${site.name}`,
  robots: { index: false },
};

/** Exported as 404.html, which the host serves for any address that doesn't exist. */
export default function NotFound() {
  return (
    <main id="main" className="relative isolate flex min-h-dvh items-center overflow-hidden py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_20%,transparent_75%)]" />
        <div className="glow top-1/2 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 [--glow-color:var(--color-iris)] [--glow-opacity:0.16]" />
      </div>

      <div className="container-page flex flex-col items-center text-center">
        <Image src="/images/logo-mark.webp" alt="" width={126} height={160} className="h-12 w-auto" />
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
          This page <span className="text-gradient">doesn’t exist.</span>
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          The address may be mistyped, or the page may have moved. Everything {site.name} publishes lives on the
          homepage.
        </p>
        <a href="/" className="btn btn-primary mt-9 h-13 px-7 text-base">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Back to the homepage
        </a>
      </div>
    </main>
  );
}
