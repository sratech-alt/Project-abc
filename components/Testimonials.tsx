import { Quote, Star } from 'lucide-react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { testimonials } from '@/lib/data';

/**
 * Client quotes. Only entries marked `verified: true` in lib/data.ts are shown, and the whole
 * section stays out of the page while there are none — we don't publish quotes we can't stand behind.
 */
export function Testimonials() {
  const quotes = testimonials.filter((testimonial) => testimonial.verified);
  if (quotes.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="testimonials-title" eyebrow="Client Proof" title="What our partners say." align="center">
            Direct feedback from the people we build with.
          </SectionHeading>
        </Reveal>

        <ul className={cn('mt-12 grid gap-5', quotes.length > 1 && 'md:grid-cols-2', quotes.length > 2 && 'lg:grid-cols-3')}>
          {quotes.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={(index % 3) * 0.07} className="h-full">
                <figure data-spotlight className="card flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <div role="img" aria-label={`Rated ${item.rating} out of 5`} className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          aria-hidden="true"
                          className={cn('size-4', star <= item.rating ? 'fill-warn text-warn' : 'text-line-strong')}
                        />
                      ))}
                    </div>
                    <Quote className="size-7 text-accent/40" aria-hidden="true" />
                  </div>

                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-fg sm:text-[1.05rem]">
                    “{item.quote}”
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3.5 border-t border-line/80 pt-5">
                    {item.avatar ? (
                      <Image src={item.avatar} alt="" width={44} height={44} className="size-11 rounded-full border border-line-strong object-cover" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-base font-bold text-accent"
                      >
                        {item.author.trim().charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-[0.95rem] font-semibold text-fg">{item.author}</span>
                      <span className="block text-sm text-muted">
                        {item.title}, {item.company}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
