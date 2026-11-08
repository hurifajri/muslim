import { readFileSync } from 'node:fs';

import { withSerwist } from '@serwist/turbopack';
import type { NextConfig } from 'next';

const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
) as { version: string };

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withSerwist(nextConfig);
