// Eksternal
import { Box, Container } from '@chakra-ui/react';
// Internal
import Header from '@components/Header';
import useColors from '@hooks/useColors';
import { useRouter } from 'next/router';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useRouter();
  const isHome = pathname === '/';

  // Dark/light mode colors
  const { bg } = useColors();

  return (
    <Box bgColor={bg}>
      {!isHome && <Header />}
      <Container
        display="flex"
        flexDirection="column"
        px={isHome ? 7 : 0}
        pb={isHome ? 7 : 0}
        pt={isHome ? 7 : '3.5rem'}
        sx={{ gap: 30 }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
