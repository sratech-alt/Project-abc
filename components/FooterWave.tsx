/**
 * The layered wave that leads into the footer — the brand motif from the original site, recoloured
 * for the dark theme: an indigo swell behind a cyan one, a thin glowing tracing line, and a front
 * wave in the footer's own colour so the graphic resolves into the footer band.
 *
 * The curves are the original paths. Colours come from design tokens via `var()`; the gradient ids
 * are prefixed so they can't clash with any other SVG on the page.
 *
 * Motion: each moving layer is its own <svg>, slightly wider than the footer, drifting sideways at
 * its own pace (`animate-wave`). Animating whole elements with `transform` keeps the loop off the
 * main thread. Layers only ever move sideways and down, so no gap can open above the footer; the
 * front wave stays still.
 */

const layerClass = 'absolute top-0 -left-[5%] block h-full w-[110%] animate-wave';

export function FooterWave() {
  return (
    <div aria-hidden="true" className="relative -mb-px h-14 w-full overflow-hidden leading-[0] sm:h-20 lg:h-32">
      {/* Shared gradients and the glow filter */}
      <svg className="absolute size-0">
        <defs>
          <linearGradient id="footer-wave-back" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--color-iris)', stopOpacity: 0.1 }} />
            <stop offset="0.45" style={{ stopColor: 'var(--color-iris)', stopOpacity: 0.42 }} />
            <stop offset="1" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.2 }} />
          </linearGradient>
          <linearGradient id="footer-wave-mid" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.34 }} />
            <stop offset="0.6" style={{ stopColor: 'var(--color-iris)', stopOpacity: 0.36 }} />
            <stop offset="1" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.14 }} />
          </linearGradient>
          <linearGradient id="footer-wave-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" style={{ stopColor: 'var(--color-accent-strong)', stopOpacity: 0 }} />
            <stop offset="0.22" style={{ stopColor: 'var(--color-accent-strong)', stopOpacity: 0.95 }} />
            <stop offset="0.72" style={{ stopColor: 'var(--color-iris-soft)', stopOpacity: 0.85 }} />
            <stop offset="1" style={{ stopColor: 'var(--color-iris-soft)', stopOpacity: 0 }} />
          </linearGradient>
          <filter id="footer-wave-glow" x="-5%" y="-200%" width="110%" height="500%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
      </svg>

      {/* Back swell — slowest */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={`${layerClass} [animation-duration:16s]`}>
        <path
          d="M0,70 C240,20 420,15 660,55 C900,95 1080,100 1260,65 C1350,48 1400,42 1440,45 L1440,120 L0,120 Z"
          fill="url(#footer-wave-back)"
        />
      </svg>

      {/* Middle swell — drifts the opposite way */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`${layerClass} [animation-direction:alternate-reverse] [animation-duration:11s]`}
      >
        <path
          d="M0,85 C260,45 460,38 680,72 C900,105 1090,112 1260,82 C1350,66 1400,60 1440,64 L1440,120 L0,120 Z"
          fill="url(#footer-wave-mid)"
        />
      </svg>

      {/* Tracing line: a soft glow underneath, a crisp hairline on top */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={`${layerClass} [animation-duration:8s]`}>
        <path
          d="M0,92 C280,60 480,52 700,82 C920,112 1100,116 1270,88 C1355,74 1405,68 1440,72"
          fill="none"
          stroke="url(#footer-wave-line)"
          strokeWidth="5"
          strokeOpacity="0.55"
          filter="url(#footer-wave-glow)"
        />
        <path
          d="M0,92 C280,60 480,52 700,82 C920,112 1100,116 1270,88 C1355,74 1405,68 1440,72"
          fill="none"
          stroke="url(#footer-wave-line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Front wave in the footer's colour — static, so the join with the footer never moves */}
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-0 block size-full">
        <path
          d="M0,100 C280,68 480,60 700,90 C920,120 1100,124 1270,96 C1355,82 1405,76 1440,80 L1440,120 L0,120 Z"
          className="fill-raised"
        />
      </svg>
    </div>
  );
}
