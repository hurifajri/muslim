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
  evening: (
    <Evening
      position="absolute"
      bottom="10px"
      right="10px"
      h="32%"
      w="32%"
      sx={{ transform: 'scaleX(-1) rotate(-35deg)' }}
    />
  ),
  morning: (
    <Morning position="absolute" bottom="10px" right="10px" h="45%" w="45%" />
  ),
  nabi: (
    <Heading position="absolute" bottom="5px" right="10px">
      ﷺ
    </Heading>
  ),
  pray: (
    <Pray position="absolute" bottom="15px" right="-40px" h="45%" w="45%" />
  ),
  quran: (
    <Quran position="absolute" bottom="10px" right="10px" h="35%" w="35%" />
  ),
};

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
        <Flex as="main" direction="column" sx={{ gap: 15 }}>
          {/* Doa */}
          <Flex as="section" wrap="wrap" sx={{ gap: 15 }}>
            {doa.map(item => {
              const { bgColor, color, icon, id, title } = item;
              return (
                <AspectRatio key={id} flex={1} maxW="500px" ratio={1}>
                  <Box bgColor={bgColor} borderRadius="35px">
                    <Heading
                      position="absolute"
                      top="20px"
                      left="20px"
                      color={color}
                      fontSize={['1.5rem', '2.1rem']}
                      maxW="72%"
                      sx={{
                        '@media screen and (max-width: 374px)': {
                          fontSize: '1.25rem',
                        },
                      }}
                    >
                      {title}
                    </Heading>
                    {Icons[icon]}
                  </Box>
                </AspectRatio>
              );
            })}
          </Flex>

          {/* Dzikir */}
          <Flex as="section" sx={{ gap: 15 }} wrap="wrap">
            {dzikir.map((item, index) => {
              const { bgColor, color, icon, id, title } = item;
              const isLast = index === dzikir.length - 1;
              return (
                <AspectRatio
                  key={id}
                  flex={isLast ? 2 : 1}
                  flexBasis={isLast ? '100%' : 'auto'}
                  maxW={isLast ? '500px' : '250px'}
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
                      maxW="72%"
                      size="md"
                      sx={{
                        '@media screen and (max-width: 374px)': {
                          fontSize: '1.25rem',
                        },
                      }}
                    >
                      {title}
                    </Heading>
                    {Icons[icon]}
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
