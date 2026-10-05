/**
 * serve-out.mjs — Serves the built site in `out/` the way the real host does: `/blog` finds
 * `blog.html`, and an unknown address gets `404.html` with a 404 status.
 * Used by the browser tests and for a local look at a production build:
 *   npm run build && node scripts/serve-out.mjs        → http://127.0.0.1:4173
 */
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const port = Number(process.argv[2] || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

async function find(pathname) {
  const candidates = pathname.endsWith('/') ? [`${pathname}index.html`] : [pathname, `${pathname}.html`];
  for (const candidate of candidates) {
    const file = path.join(root, candidate);
    // Never serve anything outside out/.
    if (!file.startsWith(root)) continue;
    try {
      return { file, body: await readFile(file), status: 200 };
    } catch {
      // not a file — try the next candidate
    }
  }
  const file = path.join(root, '404.html');
  return { file, body: await readFile(file), status: 404 };
}

createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const { file, body, status } = await find(decodeURIComponent(pathname));
    response.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(500).end('The site has not been built. Run "npm run build" first.');
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving out/ at http://127.0.0.1:${port}`));
