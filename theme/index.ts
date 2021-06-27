// Eksternal
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Internal
import fonts from '@theme/fonts';
import styles from '@theme/styles';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const overrides = {
  ...config,
  fonts,
  styles,
};

export default extendTheme(overrides);
