// Eksternal
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import theme from '@theme';

const App = ({ Component, pageProps }: AppProps): ReactNode => (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
