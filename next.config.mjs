/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes a plain static site to `out/` — no server, no backend.
  output: 'export',
  // The image optimizer needs a server; images are pre-sized by `npm run images` instead.
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
