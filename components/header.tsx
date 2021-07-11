// Eksternal
import { ChevronLeftIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Flex, Heading, IconButton, useColorMode } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Internal
import { useColors } from '@hooks';

// Helper function to capitalize first letter
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

const Header = () => {
  const { back, pathname, query } = useRouter();
  const isDzikir = pathname === '/dzikir/[time]';
  const time = query?.time ?? '';
  const type = query?.type ?? '';

  const [title, setTitle] = useState('');
  useEffect(() => {
    isDzikir
      ? setTitle(`Dzikir ${capitalize(time)}`)
      : setTitle(`Kumpulan Doa ${capitalize(type)}`);
  }, [isDzikir, time, type]);

  // Dark/light mode colors
  const { bgBlue, textLight } = useColors();

  // Togle dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Flex
      as="header"
      bgColor={bgBlue}
      pos="fixed"
      p={3}
      top={0}
      left={0}
      right={0}
      zIndex={1}
      align="center"
      justify="space-between"
    >
      <Flex align="center" sx={{ gap: 5 }}>
        <IconButton
          aria-label="Back"
          color={textLight}
          icon={<ChevronLeftIcon />}
          onClick={back}
          {...iconButtonProps}
        />
        <Heading as="h1" color={textLight} fontSize="lg">
          {title}
        </Heading>
      </Flex>
      <IconButton
        aria-label={`Mode ${isDark ? 'Gelap' : 'Terang'}`}
        color={textLight}
        icon={isDark ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        {...iconButtonProps}
      />
    </Flex>
  );
};

const iconButtonProps = {
  variant: 'ghost',
  size: 'sm',
  fontSize: 'lg',
  _active: {
    bgColor: 'transparent',
  },
  _hover: {
    bgColor: 'transparent',
  },
  _visited: {
    bgColor: 'transparent',
  },
};

export default Header;
