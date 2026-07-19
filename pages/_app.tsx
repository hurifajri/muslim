// Eksternal
import { ChakraProvider, localStorageManager } from '@chakra-ui/react';
// Internal
import Layout from '@components/Layout';
import theme from '@theme/index';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider colorModeManager={localStorageManager} theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
);

export default App;
