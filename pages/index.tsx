// Eksternal
import { EditIcon } from '@chakra-ui/icons';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SkeletonText,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { ReactNode, useState } from 'react';

// Internal
import { toc } from '@data';
import {
  Evening,
  Menu,
  Morning,
  Mosque,
  Pray,
  Prophet,
  Quran,
} from '@components/icons';
import { iHome, iTocIcons } from '@interfaces';
import { useGregDate, useHijriDate } from '@hooks';

// Dynamic icons for table of contents
const Icons: iTocIcons = {
  1: <Morning h="125%" w="100%" />,
  2: <Evening h="100%" w="100%" />,
  3: <Quran h="100%" w="100%" />,
  4: <Prophet h="103%" w="100%" />,
  5: <Pray h="100%" w="100%" />,
};

const Home = ({ initialCity, isServer }: iHome): ReactNode => {
  const [tempCity, setTempCity] = useState('');
  const [city, setCity] = useState(initialCity);

  const { gregDate, gregTime } = useGregDate();
  const { prayingTimes, hijriDate, isLoading } = useHijriDate(city);

  // Change city
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChangeCity = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setTempCity(event.target.value);

  const handleClickCity = () => {
    if (!isServer) localStorage.setItem('city', tempCity);
    setCity(tempCity);
    onClose();
  };

  // Get very small screen
  const [isSmallerThan360] = useMediaQuery('(max-width: 360px)');

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
            <SkeletonText isLoaded={!isLoading} noOfLines={1}>
              <Text
                color="#8273D3"
                fontSize={['xs', 'sm']}
                fontWeight="extrabold"
                textAlign="right"
              >
                {hijriDate}
              </Text>
            </SkeletonText>
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
                p={isSmallerThan360 ? 3 : 7}
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
                      onClick={onOpen}
                      p={0}
                      w={6}
                      h={6}
                      minW={6}
                      icon={<EditIcon color="gray.300" />}
                      zIndex={1}
                      _active={{ bgColor: 'transparent' }}
                      _hover={{ bgColor: 'transparent' }}
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
                <Flex
                  justify="space-evenly"
                  zIndex={1}
                  sx={{ gap: isSmallerThan360 ? 5 : 15 }}
                >
                  {prayingTimes.map(item => (
                    <SkeletonText
                      key={item.id}
                      isLoaded={!isLoading}
                      noOfLines={2}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Flex direction="column" align="center">
                        <Text
                          color="gray.100"
                          fontSize={['sm', 'md']}
                          fontWeight="bold"
                          textShadow=".5px .5px #000"
                        >
                          {item.name}
                        </Text>
                        <Text
                          color="gray.100"
                          fontSize={['sm', 'md']}
                          fontWeight="bold"
                          textShadow=".5px .5px #000"
                        >
                          {item.time}
                        </Text>
                      </Flex>
                    </SkeletonText>
                  ))}
                </Flex>
              </Flex>
              <Mosque
                position="absolute"
                right={-12}
                top={4}
                h="85%"
                w="85%"
                opacity={0.35}
                zIndex={0}
              />
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
      {/* Change city modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        motionPreset="scale"
        size="xs"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={['md', 'lg']}>
            Ubah lokasi jadwal solat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Ganti kota"
              defaultValue={city}
              variant="flushed"
              onChange={handleChangeCity}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              bgGradient="linear(to-bl, purple.400, blue.400)"
              onClick={handleClickCity}
            >
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Set default city
  const isServer = typeof window === 'undefined';
  let initialCity = 'Jakarta';
  if (!isServer) initialCity = localStorage?.getItem('city') ?? 'Jakarta';

  return {
    props: { initialCity, isServer },
  };
};

export default Home;
