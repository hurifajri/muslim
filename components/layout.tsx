// Eksternal
import { Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

// Internal
import { Header } from '@components';
import { useColors } from '@hooks';
import { iLayout } from '@interfaces';

const Layout = ({ children }: iLayout) => {
  const { pathname } = useRouter();
  const isHome = pathname === '/';

  // Dark/light mode colors
  const { bg } = useColors();

  return (
    <>
      <Head>
        <title>Muslim</title>
        <meta
          name="description"
          content="Muslim • Dzikir, Doa, dan Jadwal Sholat."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box bgColor={bg}>
        {!isHome && <Header />}
        <Container display="flex" flexDirection="column" p={7} sx={{ gap: 30 }}>
          {children}
        </Container>
      </Box>
    </>
  );
};

export default Layout;
