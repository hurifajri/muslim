import { createEnv } from '@t3-oss/env-nextjs';
import { minLength, pipe, string } from 'valibot';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_URL: pipe(string(), minLength(1)),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
