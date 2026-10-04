/**
 * optimize-images.mjs — builds the published images in `public/` from the originals in `assets/`.
 * `assets/` is never deployed. Re-run with `npm run images` whenever a source image changes.
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (file) => path.join(root, 'assets', file);
const out = (file) => path.join(root, 'public', file);

// Mirrors --color-canvas in app/globals.css (the apple-touch icon needs an opaque background).
const CANVAS = { r: 11, g: 15, b: 23, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const webp = [
  { from: 'ecommerce.png', to: 'images/projects/fashion-rental-platform.webp', resize: { width: 1280 }, quality: 80 },
  { from: 'cafe-mgmt.png', to: 'images/projects/cafe-management-system.webp', resize: { width: 1280 }, quality: 80 },
  { from: 'aora.jpeg', to: 'images/projects/aora.webp', resize: { width: 640 }, quality: 82 },
  { from: 'unvoid.jpeg', to: 'images/projects/unvoid.webp', resize: { width: 640 }, quality: 82 },
  { from: 'logo-mark-white.png', to: 'images/logo-mark.webp', resize: { height: 160 }, quality: 92 },
  { from: 'logo-full-white.png', to: 'images/logo-full.webp', resize: { width: 560 }, quality: 92 },
  { from: 'Co-Founder.jpeg', to: 'images/team/rupesh-dulal.webp', resize: { width: 480, height: 480, fit: 'cover', position: 'top' }, quality: 82 },
  { from: 'Co-Founder3.jpeg', to: 'images/team/biman-lakhey.webp', resize: { width: 480, height: 480, fit: 'cover', position: 'top' }, quality: 82 },
];

const png = [
  { from: 'favicon-light.png', to: 'favicon-light.png', resize: { width: 96, height: 96, fit: 'contain', background: CLEAR } },
  { from: 'favicon-dark.png', to: 'favicon-dark.png', resize: { width: 96, height: 96, fit: 'contain', background: CLEAR } },
];

async function report(file) {
  const meta = await sharp(out(file)).metadata();
  const { size } = await stat(out(file));
  console.log(`${file.padEnd(52)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(size / 1024).toFixed(1).padStart(7)} KB`);
}

for (const job of webp) {
  await mkdir(path.dirname(out(job.to)), { recursive: true });
  await sharp(src(job.from)).resize(job.resize).webp({ quality: job.quality }).toFile(out(job.to));
  await report(job.to);
}

for (const job of png) {
  await sharp(src(job.from)).resize(job.resize).png({ compressionLevel: 9 }).toFile(out(job.to));
  await report(job.to);
}

// Apple touch icon: white mark centred on the site background.
const mark = await sharp(src('logo-mark-white.png')).resize({ height: 112 }).toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: CANVAS } })
  .composite([{ input: mark, gravity: 'centre' }])
  .png({ compressionLevel: 9 })
  .toFile(out('apple-touch-icon.png'));
await report('apple-touch-icon.png');
