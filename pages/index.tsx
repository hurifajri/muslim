// Eksternal
import { EditIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
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
  Switch,
  Text,
  useColorMode,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { ReactNode, SetStateAction, useState } from 'react';

// Internal
import {
  Evening,
  Menu,
  Morning,
  Mosque,
  Pray,
  Prophet,
  Quran,
} from '@components/icons';
import { toc } from '@data';
import { useColors, useGregDate, useHijriDate, useQuote } from '@hooks';
import { iTocIcons } from '@interfaces';

// Dynamic icons for table of contents
const Icons: iTocIcons = {
  1: <Morning h="125%" w="100%" />,
  2: <Evening h="100%" w="100%" />,
  3: <Quran h="100%" w="100%" />,
  4: <Prophet h="103%" w="100%" />,
  5: <Pray h="100%" w="100%" />,
};

const Home = (): ReactNode => {
  const isServer = typeof window === 'undefined';

  // Set default city
  let initialCity = 'jakarta';
  if (!isServer) initialCity = localStorage?.getItem('city') ?? 'jakarta';

  const [tempCity, setTempCity] = useState(initialCity);
  const handleChangeCity = (event: {
    target: { value: SetStateAction<string> };
  }) => setTempCity(event.target.value);

  const [city, setCity] = useState(initialCity);
  const handleClickCity = () => {
    if (!isServer) localStorage.setItem('city', tempCity);
    setCity(tempCity);
    onCloseCity();
  };

  // Open city modal
  const {
    isOpen: isOpenCity,
    onOpen: onOpenCity,
    onClose: onCloseCity,
  } = useDisclosure();

  // Open menu drawer
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();

  // Toggle quote text
  const [showFullQuote, setShowFullQuote] = useState(false);
  const handleClickQuote = () => setShowFullQuote(!showFullQuote);

  // Togle dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();

  // Dark/light mode colors
  const {
    bg,
    bgBlue,
    bgCard,
    bgGradientBlue,
    bgGradientPurple,
    bgPurple,
    iconMenu,
    textDark,
    textLight,
    textPurpleDark,
    textPurpleLight,
  } = useColors();

  const { gregDate, gregTime } = useGregDate();
  const { prayingTimes, hijriDate, isLoading } = useHijriDate(city);
  const [isSmallerThan360] = useMediaQuery('(max-width: 360px)');
  const { quote, narrator } = useQuote();

  return (
    <>
      {/* Header */}
      <Flex as="header" align="center" justify="space-between">
        {/* Menu */}
        <IconButton
          aria-label="Open menu drawer"
          bgColor={bgCard}
          borderRadius={10}
          icon={<Menu color={iconMenu} />}
          onClick={onOpenMenu}
          p={2.5}
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
              color={textPurpleDark}
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
          bgGradient={`linear(to-bl, ${bgGradientPurple}, ${bgGradientBlue})`}
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
                    color={textLight}
                    fontSize={['xl', '2xl']}
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {city}
                  </Text>
                  <IconButton
                    aria-label="Open city modal"
                    bgColor="transparent"
                    onClick={onOpenCity}
                    h={5}
                    w={5}
                    minW={5}
                    p={0}
                    icon={<EditIcon color="gray.300" />}
                    zIndex={1}
                    _active={{ bgColor: 'transparent' }}
                    _hover={{ bgColor: 'transparent' }}
                  />
                </Flex>
                <Text
                  color={textLight}
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
                        color={textLight}
                        fontSize={['sm', 'md']}
                        fontWeight="bold"
                        textShadow=".5px .5px #000"
                      >
                        {item.name}
                      </Text>
                      <Text
                        color={textLight}
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
            .filter(({ group }) => group === 'dzikir')
            .map(content => {
              const { id, title, link } = content;
              const bgColor = id === 1 ? bgPurple : bgBlue;
              const color = id === 1 ? textDark : textLight;
              return (
                <Link href={link} key={id}>
                  <AspectRatio flex={1} ratio={1} cursor="pointer">
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
                        fontWeight="bold"
                      >
                        {title}
                      </Text>
                    </Flex>
                  </AspectRatio>
                </Link>
              );
            })}
        </Flex>
        {/* Quotes */}
        <Flex
          as="section"
          direction="column"
          bgColor={bgCard}
          borderRadius={25}
          boxShadow="md"
          p={5}
          sx={{ gap: 10 }}
        >
          <Heading fontSize={['md', 'lg']} fontWeight="bold">
            Mutiara Hikmah
          </Heading>
          <Flex direction="column" sx={{ gap: 10 }}>
            <Collapse startingHeight={40} in={showFullQuote}>
              <Text
                cursor="pointer"
                fontSize={['sm', 'md']}
                fontStyle="italic"
                onClick={handleClickQuote}
              >
                {quote}
              </Text>
            </Collapse>
            <Text
              color={textPurpleLight}
              fontSize={['xs', 'sm']}
              fontWeight="bold"
            >
              {narrator}
            </Text>
          </Flex>
        </Flex>
        {/* Doa */}
        <Flex as="section" direction="column" sx={{ gap: 10 }}>
          <Heading fontSize={['md', 'lg']} fontWeight="bold">
            Kumpulan Doa
          </Heading>
          <Flex sx={{ gap: 10 }}>
            {toc
              .filter(({ group }) => group === 'doa')
              .map(content => {
                const { id, title, link } = content;
                return (
                  <Link href={link} key={id}>
                    <AspectRatio flex={1} ratio={1} cursor="pointer">
                      <Flex
                        bgColor={bgCard}
                        borderRadius="15%"
                        boxShadow="md"
                        direction="column"
                        sx={{ gap: '10px' }}
                      >
                        <Flex align="flex-end" h={['35px', '60px']}>
                          {Icons[id]}
                        </Flex>
                        <Text fontSize={['xs', 'sm']} fontWeight="bold">
                          {title}
                        </Text>
                      </Flex>
                    </AspectRatio>
                  </Link>
                );
              })}
          </Flex>
        </Flex>
      </Flex>
      {/* Change city modal */}
      <Modal
        isOpen={isOpenCity}
        onClose={onCloseCity}
        closeOnOverlayClick={true}
        motionPreset="scale"
        size="xs"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={['md', 'lg']} textTransform="capitalize">
            Ubah Lokasi
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Contoh: Bogor"
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
      {/* Drawer menu */}
      <Drawer
        placement="right"
        size="xs"
        closeOnOverlayClick={true}
        onClose={onCloseMenu}
        isOpen={isOpenMenu}
      >
        <DrawerOverlay />
        <DrawerContent bgColor={bg}>
          <DrawerCloseButton />
          <DrawerHeader
            display="flex"
            alignItems="center"
            borderBottomWidth="1px"
            sx={{ gap: 10 }}
            mb={5}
          >
            <SettingsIcon />
            <Heading fontSize={['lg', 'xl']} fontWeight="bold" lineHeight={1}>
              Pengaturan
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            {/* Dark mode */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="mode-gelap" mb={0}>
                Mode Gelap
              </FormLabel>
              <Switch
                id="mode-gelap"
                defaultChecked={colorMode === 'light'}
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
              />
            </FormControl>
            <Divider my={2.5} />
            {/* Terjemahan */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="terjemahan" mb={0}>
                Terjemahan
              </FormLabel>
              <Switch id="terjemahan" />
            </FormControl>
            <Divider my={2.5} />
            {/* Transliterasi */}
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel htmlFor="transliterasi" mb={0}>
                Transliterasi
              </FormLabel>
              <Switch id="transliterasi" />
            </FormControl>
          </DrawerBody>
          <DrawerFooter display="flex" justifyContent="flex-start">
            <Text>Tentang Aplikasi</Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Home;
