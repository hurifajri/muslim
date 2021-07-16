// Eksternal
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Internal
import fonts from '@theme/fonts';
import styles from '@theme/styles';

const themeConfig: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const overrides = { ...themeConfig, fonts, styles };
const theme = extendTheme(overrides);

export default theme;
