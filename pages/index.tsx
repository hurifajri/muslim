// Eksternal
import Head from 'next/head';
import { AspectRatio, Box, Container, Flex, Text } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import { useToc } from '@/hooks';

const Home = (): ReactNode => {
  const { contents, isLoading, isError } = useToc();

  if (isError) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

  const { doa, dzikir } = contents;

  return (
    <Box bgColor="purple.50" height="100vh">
      <Head>
        <title>Muslim</title>
        <meta name="description" content="Muslim" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container display="flex" flexDirection="column" sx={{ gap: 30 }}>
        {/* Header */}
        <Flex as="header" justify="space-between">
          <Text>Text 1</Text>
          <Text>Text 2</Text>
        </Flex>

        {/* Main */}
        <Flex as="main" direction="column" sx={{ gap: 30 }}>
          {/* Dzikir */}
          <Flex as="section" sx={{ gap: 15 }} wrap="wrap">
            {dzikir.map(({ id, title }, index) => {
              const isLast = index === dzikir.length - 1;
              return (
                <AspectRatio
                  flex={isLast ? 2 : 1}
                  flexBasis={isLast ? '100%' : 'auto'}
                  key={id}
                  maxW={isLast ? '500px' : '250px'}
                  ratio={isLast ? 4 / 2 : 1}
                >
                  <Box
                    bgColor={isLast ? '#fff' : 'red'}
                    borderRadius="35px"
                    boxShadow={isLast ? 'lg' : 'none'}
                  >
                    {title}
                  </Box>
                </AspectRatio>
              );
            })}
          </Flex>

          {/* Doa */}
          <Flex as="section" sx={{ gap: 15 }} wrap="wrap">
            {doa.map(({ id, title }) => (
              <AspectRatio flex={1} key={id} maxW="500px" ratio={1}>
                <Box bgColor="red" borderRadius="35px">
                  {title}
                </Box>
              </AspectRatio>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;
