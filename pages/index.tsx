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
  Pagi: (
    <Morning position="absolute" bottom="10px" right="10px" h="45%" w="45%" />
  ),
  Petang: (
    <Evening
      position="absolute"
      bottom="10px"
      right="10px"
      h="32%"
      w="32%"
      sx={{ transform: 'scaleX(-1) rotate(-35deg)' }}
    />
  ),
  Quran: (
    <Quran position="absolute" bottom="10px" right="10px" h="35%" w="35%" />
  ),
  Rasulullah: (
    <Heading
      position="absolute"
      bottom="15px"
      right="10px"
      size="4xl"
      sx={{
        '@media screen and (max-width: 320px)': {
          fontSize: '2.75rem',
        },
        '@media screen and (min-width: 321px) and (max-width: 375px)': {
          fontSize: '3.5rem',
        },
      }}
    >
      ﷺ
    </Heading>
  ),
  'Setelah Solat': (
    <Pray position="absolute" bottom="15px" right="-15px" h="45%" w="45%" />
  ),
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
              const { bgColor, color, group, id, title } = content;
              const isLast = index === contents.length - 1;
              return (
                <AspectRatio
                  key={id}
                  flex={isLast ? 4 : 1}
                  flexBasis={isLast ? '100%' : '35%'}
                  ratio={isLast ? 4 / 2 : 1}
                >
                  <Box
                    bgColor={bgColor}
                    borderRadius="35px"
                    boxShadow={isLast ? 'lg' : 'none'}
                  >
                    <Heading
                      position="absolute"
                      top="20px"
                      left="20px"
                      color={color}
                      size="xl"
                      sx={{
                        '@media screen and (max-width: 320px)': {
                          fontSize: '1.25rem',
                        },
                        '@media screen and (min-width: 321px) and (max-width: 375px)':
                          {
                            fontSize: '1.5rem',
                          },
                      }}
                    >
                      {group}
                      <br />
                      {title}
                    </Heading>
                    {Icons[title]}
                  </Box>
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
