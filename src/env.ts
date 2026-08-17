import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: pipe(string(), minLength(1)),
    NEXT_PUBLIC_ALADHAN_API_URL: pipe(string(), url()),
    NEXT_PUBLIC_NOMINATIM_API_URL: pipe(string(), url()),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ALADHAN_API_URL: process.env.NEXT_PUBLIC_ALADHAN_API_URL,
    NEXT_PUBLIC_NOMINATIM_API_URL: process.env.NEXT_PUBLIC_NOMINATIM_API_URL,
  },
});
