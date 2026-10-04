/**
 * supabase.ts — Reads content from Supabase's Data API at build time.
 *
 * Deliberately small: the site only ever SELECTs public rows, so a plain `fetch` replaces the
 * Supabase SDK. Row Level Security on the database decides what the public key may read; this
 * file adds no access rules of its own.
 */
import { supabaseConfig } from './site';

/** Thrown when Supabase can't be reached or answers with an error. Failing the build is intended. */
export class ContentUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentUnavailableError';
  }
}

/** PostgREST's code for "this table is not in the schema" — i.e. supabase/schema.sql hasn't been run yet. */
const TABLE_MISSING = 'PGRST205';

type Options = {
  fetchImpl?: typeof fetch;
  /** Total tries for a failure that might be temporary (network error or a 5xx answer). */
  attempts?: number;
  /** Wait before the second try; doubles for each try after that. */
  retryDelayMs?: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns the rows of `table` matching a PostgREST query (e.g. `{ select: '*', order: 'published_at.desc' }`).
 *
 * - Table doesn't exist yet → `[]`. The site builds and simply has no content of that kind.
 * - A network error or server error (5xx) is retried a few times, since those are often momentary.
 * - Anything that still fails → throws. A real Supabase outage must stop the build rather than
 *   publish a site with its content missing; the host keeps serving the last good build.
 */
export async function selectRows<Row>(table: string, query: Record<string, string>, options: Options = {}): Promise<Row[]> {
  const { fetchImpl = fetch, attempts = 4, retryDelayMs = 600 } = options;
  const url = new URL(`${supabaseConfig.url}/rest/v1/${table}`);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);

  let failure = '';
  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (attempt > 1) await wait(retryDelayMs * 2 ** (attempt - 2));

    let response: Response;
    try {
      response = await fetchImpl(url, {
        headers: { apikey: supabaseConfig.publishableKey, Accept: 'application/json' },
      });
    } catch (error) {
      failure = `Could not reach Supabase to read "${table}": ${(error as Error).message}`;
      continue;
    }

    if (response.ok) return (await response.json()) as Row[];

    const body = (await response.json().catch(() => null)) as { code?: string; message?: string } | null;
    if (response.status === 404 && body?.code === TABLE_MISSING) return [];

    failure = `Supabase refused to read "${table}": HTTP ${response.status}${body?.message ? ` — ${body.message}` : ''}`;
    // A 4xx answer (bad key, bad query) will not get better by asking again.
    if (response.status < 500) break;
  }

  throw new ContentUnavailableError(failure);
}
