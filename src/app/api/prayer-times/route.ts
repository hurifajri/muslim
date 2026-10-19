import { env } from '@/env';
import { createAladhanHandler } from '@/services/aladhan-proxy';

export const runtime = 'nodejs';

const handler = createAladhanHandler({
  baseUrl: env.ALADHAN_API_URL,
});

export async function GET(request: Request) {
  return handler(request);
}
