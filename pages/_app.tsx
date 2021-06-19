// Eksternal
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps): ReactNode => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
