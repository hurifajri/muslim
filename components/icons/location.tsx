// Eksternal
import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

const Location = (props: IconProps): JSX.Element => (
  <Icon viewBox="0 0 64 64" {...props}>
    <g id="Flat">
      <path
        d="m53 24.267c0 18.366-21 36.733-21 36.733s-21-18.367-21-36.733a21 21 0 1 1 42 0z"
        fill="#fa4b4b"
      />
      <path
        d="m19.625 46.953a86.778 86.778 0 0 0 12.375 14.047s17.6-15.4 20.567-32.1c-8.144 9.04-20.061 15.6-32.942 18.053z"
        fill="#dc3c46"
      />
      <circle cx="32" cy="24" fill="#eee" r="17" />
      <path
        d="m40.318 32a6.926 6.926 0 0 0 .682-3c0-3.073-5.663-5.673-8-6.616v-3.4c.058 0 .112.017.17.017a5.006 5.006 0 0 0 3.53-1.459l-1.4-1.424a3 3 0 1 1 -4.246-4.246l-1.424-1.4a4.983 4.983 0 0 0 1.37 8.012v3.9c-2.337.943-8 3.543-8 6.616a6.926 6.926 0 0 0 .682 3h-1.682v2h20v-2z"
        fill="#ad2a37"
      />
    </g>
  </Icon>
);

export default Location;
