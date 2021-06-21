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
    <Morning position="absolute" bottom="8px" right="10px" h="43%" w="43%" />
  ),
  Petang: (
    <Evening
      position="absolute"
      bottom="10px"
      right="10px"
      h="30%"
      w="30%"
      sx={{ transform: 'scaleX(-1) rotate(-35deg)' }}
    />
  ),
  Quran: (
    <Quran position="absolute" bottom="12px" right="15px" h="34%" w="34%" />
  ),
  Rasulullah: (
    <Heading
      position="absolute"
      bottom="18px"
      right="15px"
      size="4xl"
      color="purple.200"
      sx={{
        '@media screen and (max-width: 320px)': {
          fontSize: '2.75rem',
        },
        '@media screen and (min-width: 321px) and (max-width: 375px)': {
          fontSize: '3.5rem',
        },
        textShadow:
          '0px 0px 0 rgb(79,-49,45),1px 1px 0 rgb(28,-100,0),2px 2px 0 rgb(-23,-151,0),3px 3px 0 rgb(-74,-202,0),4px 4px 0 rgb(-125,-253,0),5px 5px  0 rgb(-176,-304,0),6px 6px 5px rgba(235,235,235,0),6px 6px 1px rgba(235,235,235,0.5),0px 0px 5px rgba(235,235,235,.2);',
      }}
    >
      ﷺ
    </Heading>
  ),
  'Setelah Solat': (
    <Pray position="absolute" bottom="35px" right="-15px" h="45%" w="45%" />
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
                      top={isLast ? '50px' : '20px'}
                      left={isLast ? '75px' : '20px'}
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
