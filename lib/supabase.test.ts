import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { supabaseConfig } from './site';
import { ContentUnavailableError, selectRows, setTransport } from './supabase';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** A stand-in for the network that gives each queued answer in turn (a thrown answer simulates a network failure). */
function answers(...queue: Array<() => Response>) {
  const mock = vi.fn(async () => {
    const next = queue[Math.min(mock.mock.calls.length - 1, queue.length - 1)];
    return next();
  });
  setTransport(mock as unknown as typeof fetch);
  return mock;
}

const fast = { retryDelayMs: 0 };

afterEach(() => {
  setTransport();
  vi.unstubAllGlobals();
});

describe('selectRows', () => {
  it('requests the table through the Data API with the public key and the given query', async () => {
    const mock = answers(() => json(200, [{ slug: 'a' }]));
    const rows = await selectRows<{ slug: string }>('posts', { select: 'slug', order: 'published_at.desc' });

    expect(rows).toEqual([{ slug: 'a' }]);
    const [url, init] = mock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.origin + url.pathname).toBe(`${supabaseConfig.url}/rest/v1/posts`);
    expect(url.searchParams.get('select')).toBe('slug');
    expect(url.searchParams.get('order')).toBe('published_at.desc');
    expect((init.headers as Record<string, string>).apikey).toBe(supabaseConfig.publishableKey);
  });

  it('treats a table that does not exist yet as "no content"', async () => {
    const mock = answers(() => json(404, { code: 'PGRST205', message: "Could not find the table 'public.posts' in the schema cache" }));
    await expect(selectRows('posts', {}, fast)).resolves.toEqual([]);
    expect(mock).toHaveBeenCalledOnce();
  });

  it('retries a momentary server error and succeeds', async () => {
    const mock = answers(
      () => json(523, null),
      () => json(200, [{ slug: 'a' }]),
    );
    await expect(selectRows('posts', {}, fast)).resolves.toEqual([{ slug: 'a' }]);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('retries a momentary network failure and succeeds', async () => {
    const mock = answers(
      () => {
        throw new TypeError('socket hang up');
      },
      () => json(200, []),
    );
    await expect(selectRows('posts', {}, fast)).resolves.toEqual([]);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('fails the build when the server error persists, rather than publishing a site with no content', async () => {
    const mock = answers(() => json(503, { message: 'Service unavailable' }));
    await expect(selectRows('posts', {}, { attempts: 3, ...fast })).rejects.toBeInstanceOf(ContentUnavailableError);
    expect(mock).toHaveBeenCalledTimes(3);
  });

  it('fails the build when Supabase cannot be reached at all', async () => {
    const mock = answers(() => {
      throw new TypeError('getaddrinfo ENOTFOUND');
    });
    await expect(selectRows('posts', {}, { attempts: 2, ...fast })).rejects.toThrow(/Could not reach Supabase/);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [401, { message: 'Invalid API key' }],
    [400, { message: 'Bad request' }],
    [404, { code: 'SOMETHING_ELSE', message: 'Not found' }],
  ])('fails straight away on HTTP %i, which retrying cannot fix', async (status, body) => {
    const mock = answers(() => json(status, body));
    await expect(selectRows('posts', {}, fast)).rejects.toBeInstanceOf(ContentUnavailableError);
    expect(mock).toHaveBeenCalledOnce();
  });
});

describe('the real HTTP client', () => {
  // Next.js caches `fetch` responses between builds, which would freeze content at the first build.
  // The client must therefore not go through `fetch` at all.
  it('reads over HTTP without calling fetch, so the framework cannot cache the answer', async () => {
    const fetchSpy = vi.fn(async () => json(200, [{ slug: 'from-fetch-cache' }]));
    vi.stubGlobal('fetch', fetchSpy);

    let hits = 0;
    let seenKey: string | undefined;
    const server: Server = createServer((request, response) => {
      hits += 1;
      seenKey = request.headers.apikey as string | undefined;
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify([{ slug: `live-${hits}`, path: request.url }]));
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const original = supabaseConfig.url;
    try {
      (supabaseConfig as { url: string }).url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      const first = await selectRows<{ slug: string; path: string }>('posts', { select: 'slug' });
      const second = await selectRows<{ slug: string }>('posts', { select: 'slug' });

      expect(first[0].slug).toBe('live-1');
      expect(first[0].path).toBe('/rest/v1/posts?select=slug');
      expect(second[0].slug).toBe('live-2'); // asked again, not remembered
      expect(seenKey).toBe(supabaseConfig.publishableKey);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      (supabaseConfig as { url: string }).url = original;
      await new Promise((resolve) => server.close(resolve));
    }
  });
});

describe('supabaseConfig', () => {
  it('uses a public (publishable) key, never a secret one', () => {
    expect(supabaseConfig.url).toMatch(/^https?:\/\//);
    expect(supabaseConfig.publishableKey).toMatch(/^(sb_publishable_|eyJ)/);
    expect(supabaseConfig.publishableKey).not.toMatch(/^sb_secret_/);
  });
});
