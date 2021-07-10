// Eksternal
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Internal
import { useColors } from '@hooks';

const iconButtonProps = {
  variant: 'ghost',
  size: 'sm',
  fontSize: '2xl',
  _hover: {
    bgColor: 'transparent',
  },
  _active: {
    bgColor: 'transparent',
  },
  _visited: {
    bgColor: 'transparent',
  },
};

const Header = () => {
  const { back, query, pathname } = useRouter();
  const isDzikir = pathname === '/dzikir/[time]';
  const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  const [title, setTitle] = useState('');
  useEffect(() => {
    isDzikir
      ? setTitle(`Dzikir ${capitalize(query.time)}`)
      : setTitle(`Doa ${capitalize(query.type)}`);
  }, [isDzikir, query.time, query.type]);

  // Dark/light mode colors
  const { bgBlue } = useColors();

  return (
    <Box
      bgColor={bgBlue}
      p={4}
      color="white"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      zIndex={1}
    >
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <IconButton
            aria-label="Back"
            icon={<ChevronLeftIcon />}
            onClick={back}
            {...iconButtonProps}
          />
          <Heading as="h1" fontSize="lg" ml={4}>
            {title}
          </Heading>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
