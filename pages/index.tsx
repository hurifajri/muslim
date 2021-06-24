// Eksternal
import Head from 'next/head';
import { AspectRatio, Box, Container, Flex, Heading } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import { toc } from '@/data';
import { TocIcons } from '@/interfaces';
import { useToday } from '@/hooks';
import {
  Evening,
  Menu,
  Morning,
  Pray,
  Prophet,
  Quran,
} from '@/components/icons';

const Icons: TocIcons = {
  1: <Morning h="125%" w="100%" />,
  2: <Evening h="100%" w="100%" />,
  3: <Quran h="100%" w="100%" />,
  4: <Prophet h="103%" w="100%" />,
  5: <Pray h="100%" w="100%" />,
};

const Home = (): ReactNode => {
  const { today, isLoading, isError } = useToday();

  if (isError) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Box bgColor="purple.50" height="100vh">
      <Head>
        <title>Muslim</title>
        <meta name="description" content="Muslim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        display="flex"
        flexDirection="column"
        p="2rem"
        sx={{ gap: 30 }}
      >
        {/* Header */}
        <Flex as="header" justify="space-between">
          <Box bgColor="white" borderRadius="20%" p=".75rem">
            <Menu h="25px" w="25px" />
          </Box>
          <Flex direction="column" align="flex-end">
            <Heading as="h1" fontSize={['md', 'lg']} fontWeight="extrabold">
              {today.greg}
            </Heading>
            <Heading
              as="h1"
              color="#8273D3"
              fontSize={['xs', 'sm']}
              fontWeight="extrabold"
            >
              {today.hijri}
            </Heading>
          </Flex>
        </Flex>
        {/* Main */}
        <Flex as="main" direction="column" sx={{ gap: 40 }}>
          {/* Dzikir */}
          <Flex as="section" sx={{ gap: 20 }}>
            {toc
              .filter(({ group }) => group === 'Dzikir')
              .map(content => {
                const { bgColor, color, id, title } = content;
                return (
                  <AspectRatio key={id} flex={1} ratio={1}>
                    <Flex
                      bgColor={bgColor}
                      borderRadius="20%"
                      direction="column"
                      sx={{ gap: '10px' }}
                    >
                      <Flex align="flex-end" h={['50px', '75px']}>
                        {Icons[id]}
                      </Flex>
                      <Heading
                        as="h3"
                        color={color}
                        fontSize={['sm', 'md']}
                        fontWeight="extrabold"
                      >
                        {title}
                      </Heading>
                    </Flex>
                  </AspectRatio>
                );
              })}
          </Flex>
          {/* Doa */}
          <Flex as="section" direction="column" sx={{ gap: 15 }}>
            <Heading fontSize={['md', 'lg']} fontWeight="extrabold">
              Kumpulan Doa
            </Heading>
            <Flex sx={{ gap: 15 }}>
              {toc
                .filter(({ group }) => group === 'Doa')
                .map(content => {
                  const { bgColor, color, id, title } = content;
                  return (
                    <AspectRatio key={id} flex={1} ratio={1}>
                      <Flex
                        bgColor={bgColor}
                        borderRadius="15%"
                        boxShadow="md"
                        direction="column"
                        sx={{ gap: '10px' }}
                      >
                        <Flex align="flex-end" h={['35px', '60px']}>
                          {Icons[id]}
                        </Flex>
                        <Heading
                          as="h3"
                          color={color}
                          fontSize={['xs', 'sm']}
                          fontWeight="extrabold"
                        >
                          {title}
                        </Heading>
                      </Flex>
                    </AspectRatio>
                  );
                })}
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;
