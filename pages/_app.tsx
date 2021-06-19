import React, { ReactNode } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

const App = function ({ Component, pageProps }: AppProps): ReactNode {
  return <Component {...pageProps} />;
};
export default App;
