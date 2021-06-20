// Eksternal
import Head from 'next/head';
import { Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const Home = (): ReactNode => (
  <Stack bgColor="purple.50" height="100vh">
    <Head>
      <title>Muslim</title>
      <meta name="description" content="Muslim" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div>tes</div>
  </Stack>
);

export default Home;
