// Eksternal
import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

// Internal
import theme from '@theme';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="id">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
