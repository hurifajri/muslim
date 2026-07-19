// Eksternal
import { ChakraProvider, localStorageManager } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

// Internal
import Layout from '@/components/Layout';
import theme from '@/theme/index';

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider colorModeManager={localStorageManager} theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
);

export default App;
