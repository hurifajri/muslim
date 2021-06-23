// Eksternal
import Head from 'next/head';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

// Internal
import { TocIcons } from '@/interfaces';
import { useToc } from '@/hooks';
import { Evening, Morning, Pray, Quran } from '@/components/icons';

const Icons: TocIcons = {
  1: <Quran h="100%" w="100%" />,
  2: (
    <Heading fontSize={['6xl', '8xl']} lineHeight={0.6}>
      ﷺ
    </Heading>
  ),
  3: <Morning h="125%" w="100%" />,
  4: <Evening h="100%" w="100%" />,
  5: <Pray h="125%" w="100%" />,
};

const Home = (): ReactNode => {
  const { contents, isLoading, isError } = useToc();

  if (isError) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;

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
        <Flex as="main" direction="column" sx={{ gap: 15 }}>
          <Flex as="section" wrap="wrap" sx={{ gap: 15 }}>
            {contents.map((content, index) => {
              const { bgColor, color, id, title } = content;
              const isLast = index === contents.length - 1;
              return (
                <AspectRatio
                  key={id}
                  flex={isLast ? 4 : 1}
                  flexBasis={isLast ? '100%' : '35%'}
                  ratio={isLast ? 4 / 2 : 1}
                >
                  <Flex
                    bgColor={bgColor}
                    borderRadius="35px"
                    boxShadow={isLast ? 'lg' : 'none'}
                    flexDirection="column"
                    sx={{ gap: '10px' }}
                  >
                    <Flex h={['50px', '75px']} alignItems="flex-end">
                      {Icons[id]}
                    </Flex>
                    <Heading
                      color={color}
                      fontSize={['lg', '2xl']}
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
      </Container>
    </Box>
  );
};

export default Home;
