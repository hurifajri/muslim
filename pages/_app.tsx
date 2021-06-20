// Eksternal
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const App = ({ Component, pageProps }: AppProps): ReactNode => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
