import { array, safeParse } from 'valibot';

import { NominatimResultSchema } from '@/schemas/nominatim';

type ProxyOptions = {
  baseUrl: string;
  // Identifies this application to the provider, rather than forwarding a browser's identity.
  userAgent: string;
  fetcher?: typeof fetch;
  now?: () => number;
};
type ProxyResult = { status: number; data: unknown; retryAfter?: string };

// Shared by search/reverse and all callers in this server process. Distributed
// deployments must point baseUrl at a shared, rate-limited geocoding gateway.
export function createNominatimHandler({
  baseUrl,
  userAgent,
  fetcher = fetch,
  now = Date.now,
}: ProxyOptions) {
  const cache = new Map<string, { expires: number; data: unknown }>();
  const pending = new Map<string, Promise<ProxyResult>>();
  let nextRequestAt = 0;
  const respond = ({ status, data, retryAfter }: ProxyResult) =>
    Response.json(data, {
      status,
      headers: {
        'Cache-Control': 'no-store',
        ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
      },
    });

  function cacheResult(key: string, data: unknown) {
    // Only validated successes reach this cache. Bound both age and memory use.
    const time = now();
    for (const [cachedKey, value] of cache) {
      if (value.expires <= time) cache.delete(cachedKey);
    }
    if (cache.size >= 128) cache.delete(cache.keys().next().value!);
    cache.set(key, { data, expires: time + 3_600_000 });
  }

  return async function handle(request: Request, operation: string) {
    // Rebuild supported parameters instead of forwarding arbitrary client input.
    const input = new URL(request.url).searchParams;
    const params = new URLSearchParams({
      format: 'jsonv2',
      addressdetails: '1',
      namedetails: '1',
      'accept-language': 'id,en',
    });
    if (operation === 'search') {
      const query = (input.get('q') ?? '').trim();
      if (query.length < 2 || query.length > 120)
        return respond({
          status: 400,
          data: { error: 'Nama kota harus 2–120 karakter.' },
        });
      params.set('q', query.toLocaleLowerCase('id-ID'));
      params.set('limit', '6');
      params.set('featureType', 'city');
    } else if (operation === 'reverse') {
      for (const [name, limit] of [
        ['lat', 90],
        ['lon', 180],
      ] as const) {
        const raw = input.get(name);
        const value = Number(raw);
        if (!raw?.trim() || !Number.isFinite(value) || Math.abs(value) > limit)
          return respond({
            status: 400,
            data: { error: 'Koordinat tidak valid.' },
          });
        params.set(name, String(value));
      }
      params.set('zoom', '10');
    } else {
      return respond({
        status: 400,
        data: { error: 'Pencarian tidak valid.' },
      });
    }

    const url = new URL(`${baseUrl.replace(/\/$/, '')}/${operation}`);
    url.search = params.toString();
    const key = url.href;
    // Cache hits and callers sharing the same request do not consume a rate-limit slot.
    const saved = cache.get(key);
    if (saved && saved.expires > now())
      return respond({ status: 200, data: saved.data });
    cache.delete(key);
    const existing = pending.get(key);
    if (existing) return respond(await existing);
    // Search and reverse geocoding share the provider's one-request-per-second budget.
    if (now() < nextRequestAt)
      return respond({
        status: 429,
        data: {
          error: 'Pencarian terlalu cepat. Tunggu sebentar lalu coba lagi.',
        },
        retryAfter: String(Math.ceil((nextRequestAt - now()) / 1000)),
      });
    nextRequestAt = now() + 1000;

    const task = (async (): Promise<ProxyResult> => {
      try {
        const response = await fetcher(url, {
          headers: { 'User-Agent': userAgent, Accept: 'application/json' },
          // One caller disconnecting must not cancel a shared request.
          signal: AbortSignal.timeout(8000),
          cache: 'no-store',
        });
        if (response.status === 429) {
          // Retry-After may be seconds or an HTTP date. Apply the cooldown to every location.
          const retry = response.headers.get('Retry-After');
          const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : 0;
          const retryAt = seconds
            ? now() + seconds * 1000
            : Date.parse(retry ?? '');
          nextRequestAt = Math.max(
            nextRequestAt,
            Number.isFinite(retryAt) ? retryAt : now() + 30_000
          );
          return {
            status: 429,
            data: { error: 'Layanan lokasi sedang sibuk. Coba lagi sebentar.' },
            retryAfter: String(Math.ceil((nextRequestAt - now()) / 1000)),
          };
        }
        if (!response.ok) throw new Error('Upstream request failed');
        const parsed = safeParse(
          operation === 'search'
            ? array(NominatimResultSchema)
            : NominatimResultSchema,
          await response.json()
        );
        if (!parsed.success) throw new Error('Invalid upstream response');
        cacheResult(key, parsed.output);
        return { status: 200, data: parsed.output };
      } catch {
        return {
          status: 502,
          data: { error: 'Layanan lokasi belum dapat dihubungi. Coba lagi.' },
        };
      }
    })();
    pending.set(key, task);
    try {
      return respond(await task);
    } finally {
      // Release failed requests too, so a later attempt can retry rather than reuse a failure.
      pending.delete(key);
    }
  };
}
