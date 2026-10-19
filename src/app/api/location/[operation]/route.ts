import { env } from '@/env';
import { createNominatimHandler } from '@/services/nominatim-proxy';

export const runtime = 'nodejs';

const handler = createNominatimHandler({
  baseUrl: env.NOMINATIM_API_URL,
  userAgent: `Muslim/2.0 (+${env.NEXT_PUBLIC_APP_URL})`,
});

export async function GET(
  request: Request,
  context: { params: Promise<{ operation: string }> }
) {
  const { operation } = await context.params;
  return handler(request, operation);
}
