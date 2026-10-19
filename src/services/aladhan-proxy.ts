import { parsePrayerResponse } from '@/lib/prayer-response';

type ProxyOptions = {
  baseUrl: string;
  fetcher?: typeof fetch;
  now?: () => number;
};
type ProxyResult = {
  status: number;
  data: unknown;
  fetchedAt?: number;
  retryAfter?: string;
};

function upstreamRequest(input: URLSearchParams, baseUrl: string) {
  // Round-trip the calendar date: Date alone would silently normalize dates such as February 30.
  const date = input.get('date') ?? '';
  const instant = new Date(`${date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(instant.getTime()) ||
    instant.toISOString().slice(0, 10) !== date
  )
    return null;

  const params = new URLSearchParams();
  // Normalize only supported parameters so equivalent locations share one cache key.
  let operation: string;
  if (input.get('mode') === 'city') {
    operation = 'timingsByCity';
    const city = (input.get('city') ?? '').trim();
    const country = (input.get('country') ?? '').trim();
    if (!city || city.length > 120 || !country || country.length > 120)
      return null;
    params.set('city', city.toLowerCase());
    params.set('country', country.toUpperCase());
  } else if (input.get('mode') === 'coordinates') {
    operation = 'timings';
    for (const [name, limit] of [
      ['latitude', 90],
      ['longitude', 180],
    ] as const) {
      const raw = input.get(name);
      const value = Number(raw);
      if (!raw?.trim() || !Number.isFinite(value) || Math.abs(value) > limit)
        return null;
      params.set(name, String(value));
    }
  } else return null;

  for (const [name, fallback] of [
    ['method', 11],
    ['adjustment', 0],
  ] as const) {
    const raw = input.get(name) ?? String(fallback);
    const value = Number(raw);
    if (
      !raw.trim() ||
      !Number.isSafeInteger(value) ||
      (name === 'method' && value < 0)
    )
      return null;
    params.set(name, String(value));
  }
  const url = new URL(
    `${baseUrl.replace(/\/$/, '')}/${operation}/${date.split('-').reverse().join('-')}`
  );
  url.search = params.toString();
  return { url, date };
}

// Cache, pending requests and limiter are shared only within this server process.
// Multiple instances sharing an outbound IP need a shared gateway/limiter.
export function createAladhanHandler({
  baseUrl,
  fetcher = fetch,
  now = Date.now,
}: ProxyOptions) {
  const cache = new Map<string, { expires: number; result: ProxyResult }>();
  const pending = new Map<string, Promise<ProxyResult>>();
  let requests: number[] = [];
  let retryAt = 0;
  const respond = ({ status, data, fetchedAt, retryAfter }: ProxyResult) =>
    Response.json(data, {
      status,
      headers: {
        'Cache-Control': 'no-store',
        // Keep the original fetch time when the client saves a server-cache hit for offline use.
        ...(fetchedAt !== undefined
          ? { 'X-Prayer-Fetched-At': String(fetchedAt) }
          : {}),
        ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
      },
    });
  const limited = (until: number): ProxyResult => ({
    status: 429,
    data: { error: 'Layanan jadwal sedang sibuk. Coba lagi sebentar.' },
    retryAfter: String(Math.max(1, Math.ceil((until - now()) / 1000))),
  });

  return async function handle(request: Request) {
    const upstream = upstreamRequest(
      new URL(request.url).searchParams,
      baseUrl
    );
    if (!upstream)
      return respond({
        status: 400,
        data: { error: 'Parameter jadwal tidak valid.' },
      });
    const { url, date } = upstream;
    const key = url.href;
    const time = now();
    // Valid cached responses and identical in-flight requests bypass the upstream limiter.
    const saved = cache.get(key);
    if (saved && saved.expires > time) return respond(saved.result);
    cache.delete(key);
    const existing = pending.get(key);
    if (existing) return respond(await existing);

    // Eight starts in a rolling second leaves headroom below the provider limit.
    requests = requests.filter(started => started > time - 1000);
    const nextRequestAt = Math.max(
      retryAt,
      requests.length >= 8 ? requests[0] + 1000 : 0
    );
    if (nextRequestAt > time) return respond(limited(nextRequestAt));
    requests.push(time);

    const task = (async (): Promise<ProxyResult> => {
      try {
        const response = await fetcher(url, {
          headers: { Accept: 'application/json' },
          // Leave time for the client's 8-second timeout. A caller disconnecting
          // must not abort work shared by other callers.
          signal: AbortSignal.timeout(6000),
          cache: 'no-store',
        });
        if (response.status === 429) {
          // Accept both Retry-After formats and share the cooldown across all locations.
          const retry = response.headers.get('Retry-After');
          const delay =
            retry && /^\d+$/.test(retry) ? Number(retry) * 1000 : Number.NaN;
          const deadline = Number.isFinite(delay)
            ? now() + delay
            : Date.parse(retry ?? '');
          retryAt = Math.max(
            retryAt,
            now() + 1000,
            Number.isFinite(deadline) ? deadline : now() + 30_000
          );
          await response.body?.cancel();
          return limited(retryAt);
        }
        if (!response.ok) {
          await response.body?.cancel();
          throw new Error('Upstream request failed');
        }
        const data = parsePrayerResponse(await response.json(), date);
        const fetchedAt = now();
        const result = { status: 200, data, fetchedAt };
        // Cache only validated schedules for the requested date, with bounded age and capacity.
        for (const [cachedKey, value] of cache)
          if (value.expires <= fetchedAt) cache.delete(cachedKey);
        if (cache.size >= 256) cache.delete(cache.keys().next().value!);
        cache.set(key, { expires: fetchedAt + 3_600_000, result });
        return result;
      } catch {
        return {
          status: 502,
          data: { error: 'Jadwal belum dapat dimuat. Coba lagi.' },
        };
      }
    })();
    pending.set(key, task);
    try {
      return respond(await task);
    } finally {
      // A completed or failed request must never remain in the in-flight registry.
      pending.delete(key);
    }
  };
}
