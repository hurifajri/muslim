// Eksternal
import { EditIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import React, { ReactNode, useState } from 'react';

// Internal
import { If } from '@components';
import { iTocIcons } from '@interfaces';
import { toc } from '@data';
import {
  Evening,
  Menu,
  Morning,
  Pray,
  Prophet,
  Quran,
} from '@components/icons';
import { useGregDate, useHijriDate } from '@hooks';

// Dynamic icons for table of contents
const Icons: iTocIcons = {
  1: <Morning h="125%" w="100%" />,
  2: <Evening h="100%" w="100%" />,
  3: <Quran h="100%" w="100%" />,
  4: <Prophet h="103%" w="100%" />,
  5: <Pray h="100%" w="100%" />,
};

const Home = (): ReactNode => {
  // Default city
  const [city] = useState('Jakarta');

  const { gregDate, gregTime } = useGregDate();
  const { timings, hijriDate, isLoading, isError } = useHijriDate(city);

  // Destructure praying times
  const ptKeys = Object.keys(timings);
  const ptValues = Object.values(timings);
  const prayingTimes = ptKeys.map((key, i) => ({
    id: i,
    name: key,
    time: ptValues[i],
  }));

  return (
    <Box bgColor="purple.50" h="100vh">
      <Head>
        <title>Muslim</title>
        <meta
          name="description"
          content="Muslim Free • Tidak menjual data pengguna!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container display="flex" flexDirection="column" p={7} sx={{ gap: 30 }}>
        {/* Header */}
        <Flex as="header" align="center" justify="space-between">
          {/* Menu */}
          <IconButton
            aria-label="Open drawer menu"
            bgColor="white"
            borderRadius={10}
            p={2.5}
            icon={<Menu h={25} w={25} />}
          />
          {/* Date */}
          <Flex direction="column">
            <Text
              fontSize={['md', 'lg']}
              fontWeight="extrabold"
              textAlign="right"
            >
              {gregDate}
            </Text>
            <If condition={isError}>
              <Text
                color="#8273D3"
                fontSize={['xs', 'sm']}
                fontWeight="extrabold"
                textAlign="right"
              >
                Gagal memuat tanggal
              </Text>
            </If>
            <If condition={isLoading}>
              <SkeletonText noOfLines={1} />
            </If>
            <If condition={!isLoading}>
              <Text
                color="#8273D3"
                fontSize={['xs', 'sm']}
                fontWeight="extrabold"
                textAlign="right"
              >
                {hijriDate}
              </Text>
            </If>
          </Flex>
        </Flex>
        {/* Main */}
        <Flex as="main" direction="column" sx={{ gap: 30 }}>
          {/* Praying Times */}
          <AspectRatio
            as="section"
            ratio={16 / 9}
            bgColor="white"
            bgGradient="linear(to-bl, purple.400, blue.400)"
            borderRadius={25}
            boxShadow="sm"
          >
            <Box>
              <Flex
                direction="column"
                justify="space-between"
                h="100%"
                w="100%"
                p={7}
              >
                <Flex direction="column">
                  <Flex align="center" sx={{ gap: 5 }}>
                    <Text
                      color="gray.100"
                      fontSize={['xl', '2xl']}
                      fontWeight="bold"
                    >
                      {city}
                    </Text>
                    <IconButton
                      aria-label="Change city"
                      bgColor="transparent"
                      p={0}
                      w={6}
                      h={6}
                      minW={6}
                      _hover={{ bgColor: 'transparent' }}
                      _active={{ bgColor: 'transparent' }}
                      icon={<EditIcon color="gray.300" />}
                    />
                  </Flex>
                  <Text
                    color="gray.100"
                    fontSize={['xl', '2xl']}
                    fontWeight="bold"
                  >
                    {gregTime}
                  </Text>
                </Flex>
                <Flex justify="space-between" sx={{ gap: 15 }}>
                  {prayingTimes.map(item => (
                    <Flex key={item.id} direction="column" align="center">
                      <Text
                        color="gray.100"
                        fontSize={['sm', 'md']}
                        fontWeight="bold"
                      >
                        {item.name}
                      </Text>
                      <Text
                        color="gray.100"
                        fontSize={['sm', 'md']}
                        fontWeight="bold"
                      >
                        {item.time}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Box>
          </AspectRatio>
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
                      <Text
                        color={color}
                        fontSize={['sm', 'md']}
                        fontWeight="extrabold"
                      >
                        {title}
                      </Text>
                    </Flex>
                  </AspectRatio>
                );
              })}
          </Flex>
          {/* Doa */}
          <Flex as="section" direction="column" sx={{ gap: 10 }}>
            <Heading fontSize={['md', 'lg']} fontWeight="extrabold">
              Kumpulan Doa
            </Heading>
            <Flex sx={{ gap: 10 }}>
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
                        <Text
                          color={color}
                          fontSize={['xs', 'sm']}
                          fontWeight="extrabold"
                        >
                          {title}
                        </Text>
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
