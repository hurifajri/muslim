import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string, url } from 'valibot';

export const env = createEnv({
  server: {
    ALADHAN_API_URL: pipe(string(), url()),
    NOMINATIM_API_URL: pipe(string(), url()),
  },
  client: {
    NEXT_PUBLIC_APP_URL: pipe(string(), minLength(1)),
  },
  runtimeEnv: {
    ALADHAN_API_URL: process.env.ALADHAN_API_URL,
    NOMINATIM_API_URL: process.env.NOMINATIM_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
