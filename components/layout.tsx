// Eksternal
import { Box, Container } from '@chakra-ui/react';
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
    <Box bgColor={bg}>
      {!isHome && <Header />}
      <Container display="flex" flexDirection="column" p={7} sx={{ gap: 30 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;