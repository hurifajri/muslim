// Eksternal
import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import type { AppProps } from 'next/app';

// Internal
import theme from '@theme';

const App = ({ Component, pageProps }: AppProps): ReactNode => (
  <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
