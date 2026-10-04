import { describe, expect, it, vi } from 'vitest';
import { supabaseConfig } from './site';
import { ContentUnavailableError, selectRows } from './supabase';

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** A fetch that gives each queued answer in turn (a thrown answer simulates a network failure). */
function fetchSequence(...answers: Array<() => Response>) {
  const mock = vi.fn(async () => {
    const next = answers[Math.min(mock.mock.calls.length - 1, answers.length - 1)];
    return next();
  });
  return mock;
}

const fast = { retryDelayMs: 0 };
const asFetch = (mock: unknown) => mock as typeof fetch;

describe('selectRows', () => {
  it('requests the table through the Data API with the public key and the given query', async () => {
    const mock = fetchSequence(() => json(200, [{ slug: 'a' }]));
    const rows = await selectRows<{ slug: string }>('posts', { select: 'slug', order: 'published_at.desc' }, { fetchImpl: asFetch(mock) });

    expect(rows).toEqual([{ slug: 'a' }]);
    const [url, init] = mock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.origin + url.pathname).toBe(`${supabaseConfig.url}/rest/v1/posts`);
    expect(url.searchParams.get('select')).toBe('slug');
    expect(url.searchParams.get('order')).toBe('published_at.desc');
    expect((init.headers as Record<string, string>).apikey).toBe(supabaseConfig.publishableKey);
  });

  it('treats a table that does not exist yet as "no content"', async () => {
    const mock = fetchSequence(() => json(404, { code: 'PGRST205', message: "Could not find the table 'public.posts' in the schema cache" }));
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), ...fast })).resolves.toEqual([]);
    expect(mock).toHaveBeenCalledOnce();
  });

  it('retries a momentary server error and succeeds', async () => {
    const mock = fetchSequence(
      () => json(523, null),
      () => json(200, [{ slug: 'a' }]),
    );
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), ...fast })).resolves.toEqual([{ slug: 'a' }]);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('retries a momentary network failure and succeeds', async () => {
    const mock = fetchSequence(
      () => {
        throw new TypeError('fetch failed');
      },
      () => json(200, []),
    );
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), ...fast })).resolves.toEqual([]);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it('fails the build when the server error persists, rather than publishing a site with no content', async () => {
    const mock = fetchSequence(() => json(503, { message: 'Service unavailable' }));
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), attempts: 3, ...fast })).rejects.toBeInstanceOf(ContentUnavailableError);
    expect(mock).toHaveBeenCalledTimes(3);
  });

  it('fails the build when Supabase cannot be reached at all', async () => {
    const mock = fetchSequence(() => {
      throw new TypeError('fetch failed');
    });
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), attempts: 2, ...fast })).rejects.toThrow(/Could not reach Supabase/);
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it.each([
    [401, { message: 'Invalid API key' }],
    [400, { message: 'Bad request' }],
    [404, { code: 'SOMETHING_ELSE', message: 'Not found' }],
  ])('fails straight away on HTTP %i, which retrying cannot fix', async (status, body) => {
    const mock = fetchSequence(() => json(status, body));
    await expect(selectRows('posts', {}, { fetchImpl: asFetch(mock), ...fast })).rejects.toBeInstanceOf(ContentUnavailableError);
    expect(mock).toHaveBeenCalledOnce();
  });
});

describe('supabaseConfig', () => {
  it('uses a public (publishable) key, never a secret one', () => {
    expect(supabaseConfig.url).toMatch(/^https?:\/\//);
    expect(supabaseConfig.publishableKey).toMatch(/^(sb_publishable_|eyJ)/);
    expect(supabaseConfig.publishableKey).not.toMatch(/^sb_secret_/);
  });
});
