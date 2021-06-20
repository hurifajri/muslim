// Eksternal
import Head from 'next/head';
import { Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import { useToc } from '@/hooks';

const Home = (): ReactNode => {
  const { contents, isLoading, isError } = useToc();

  if (isError) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  console.log(contents);

  return (
    <Stack bgColor="purple.50" height="100vh">
      <Head>
        <title>Muslim</title>
        <meta name="description" content="Muslim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>tes</div>
    </Stack>
  );
};

export default Home;
