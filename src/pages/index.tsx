// Eksternal
import { EditIcon } from '@chakra-ui/icons';
import {
  AspectRatio,
  Box,
  Collapse,
  Flex,
  Heading,
  IconButton,
  SkeletonText,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { ReactNode, useState } from 'react';

import { EveningIcon } from '@/components/icons/evening';
import { MenuIcon } from '@/components/icons/menu';
import { MorningIcon } from '@/components/icons/morning';
import { MosqueIcon } from '@/components/icons/mosque';
import { PrayIcon } from '@/components/icons/pray';
import { ProphetIcon } from '@/components/icons/prophet';
import { QuranIcon } from '@/components/icons/quran';

type Icons = Record<number, ReactNode>;
import { toc } from '@/data/toc';
import { useColors } from '@/hooks/use-colors';
import { useGregDate } from '@/hooks/use-greg-date';
import { useHijriDate } from '@/hooks/use-hijri-date';
import { useInitialLocation } from '@/hooks/use-initial-location';
import { useQuote } from '@/hooks/use-quote';

// Internal dynamic
const Location = dynamic(() =>
  import('@/components/location').then(mod => mod.Location)
);
const Settings = dynamic(() =>
  import('@/components/settings').then(mod => mod.Settings)
);

// Dynamic icons for table of contents
const Icons: Icons = {
  1: <MorningIcon h="125%" w="100%" />,
  2: <EveningIcon h="100%" w="100%" />,
  3: <QuranIcon h="100%" w="100%" />,
  4: <ProphetIcon h="103%" w="100%" />,
  5: <PrayIcon h="100%" w="100%" />,
};

const Home = () => {
  // Open location picker
  const {
    isOpen: isOpenLocation,
    onOpen: onOpenLocation,
    onClose: onCloseLocation,
  } = useDisclosure();

  // Open settings
  const {
    isOpen: isOpenSettings,
    onOpen: onOpenSettings,
    onClose: onCloseSettings,
  } = useDisclosure();

  // Toggle quote text
  const [showFullQuote, setShowFullQuote] = useState(false);
  const handleClickQuote = () => setShowFullQuote(!showFullQuote);

  // Dark/light mode colors
  const {
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

  // Get default location from storage
  const { initialLocation: city } = useInitialLocation();

  const { gregDate, gregTime } = useGregDate();
  const { prayingTimes, hijriDate, isLoading } = useHijriDate(city);
  const [isSmallerThan360] = useMediaQuery('(max-width: 360px)');
  const { quote, narrator } = useQuote();

  return (
    <>
      {/* Head */}
      <NextSeo
        title="Muslim • Jadwal Sholat, Dzikir, dan Doa."
        description="Jadwal sholat, dzikir, dan kumpulan doa dalam genggaman."
      />
      {/* Header */}
      <Flex
        as="header"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        {/* Menu */}
        <IconButton
          aria-label="Open menu drawer"
          icon={<MenuIcon color={iconMenu} />}
          onClick={onOpenSettings}
          sx={{
            bgColor: bgCard,
            borderRadius: 10,
            p: 2.5,
          }}
        />
        {/* Date */}
        <Flex sx={{ flexDirection: 'column' }}>
          <Text
            sx={{
              fontSize: ['md', 'lg'],
              fontWeight: 'extrabold',
              textAlign: 'right',
            }}
          >
            {gregDate}
          </Text>
          <SkeletonText isLoaded={!isLoading} noOfLines={1}>
            <Text
              sx={{
                color: textPurpleDark,
                fontSize: ['xs', 'sm'],
                fontWeight: 'extrabold',
                textAlign: 'right',
              }}
            >
              {hijriDate}
            </Text>
          </SkeletonText>
        </Flex>
      </Flex>
      {/* Main */}
      <Flex as="main" sx={{ flexDirection: 'column', gap: 30 }}>
        {/* Praying Times */}
        <AspectRatio
          as="section"
          ratio={16 / 9}
          sx={{
            bgGradient: `linear(to-bl, ${bgGradientPurple}, ${bgGradientBlue})`,
            borderRadius: 25,
            boxShadow: 'sm',
          }}
        >
          <Box>
            <Flex
              sx={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                h: '100%',
                w: '100%',
                p: isSmallerThan360 ? 3 : 7,
              }}
            >
              <Flex sx={{ flexDirection: 'column' }}>
                <Flex sx={{ alignItems: 'center', gap: 5 }}>
                  <Text
                    sx={{
                      color: textLight,
                      fontSize: ['xl', '2xl'],
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {city}
                  </Text>
                  <IconButton
                    aria-label="Open location modal"
                    onClick={onOpenLocation}
                    icon={<EditIcon color="gray.300" />}
                    sx={{
                      bgColor: 'transparent',
                      h: 5,
                      w: 5,
                      minW: 5,
                      p: 0,
                      zIndex: 1,
                      _active: { bgColor: 'transparent' },
                      _hover: { bgColor: 'transparent' },
                    }}
                  />
                </Flex>
                <Text
                  sx={{
                    color: textLight,
                    fontSize: ['xl', '2xl'],
                    fontWeight: 'bold',
                  }}
                >
                  {gregTime}
                </Text>
              </Flex>
              <Flex
                sx={{
                  justifyContent: 'space-evenly',
                  zIndex: 1,
                  gap: isSmallerThan360 ? 5 : 15,
                }}
              >
                {prayingTimes.map(item => (
                  <SkeletonText
                    key={item.id}
                    isLoaded={!isLoading}
                    noOfLines={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Flex
                      sx={{ flexDirection: 'column', alignItems: 'center' }}
                    >
                      <Text
                        sx={{
                          color: textLight,
                          fontSize: ['sm', 'md'],
                          fontWeight: 'bold',
                          textShadow: '.5px .5px #000',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        sx={{
                          color: textLight,
                          fontSize: ['sm', 'md'],
                          fontWeight: 'bold',
                          textShadow: '.5px .5px #000',
                        }}
                      >
                        {item.time}
                      </Text>
                    </Flex>
                  </SkeletonText>
                ))}
              </Flex>
            </Flex>
            <MosqueIcon
              sx={{
                position: 'absolute',
                right: -12,
                top: 4,
                h: '85%',
                w: '85%',
                opacity: 0.35,
                zIndex: 0,
              }}
            />
          </Box>
        </AspectRatio>
        {/* Dzikir */}
        <Flex as="section" sx={{ gap: 20 }}>
          {toc
            .filter(({ category }) => category === 'dzikir')
            .map(content => {
              const { id, title, link } = content;
              const bgColor = id === 1 ? bgPurple : bgBlue;
              const color = id === 1 ? textDark : textLight;
              return (
                <Link href={link} passHref={true} key={id}>
                  <AspectRatio ratio={1} sx={{ flex: 1, cursor: 'pointer' }}>
                    <Flex
                      sx={{
                        bgColor: bgColor,
                        borderRadius: '20%',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <Flex
                        sx={{ alignItems: 'flex-end', h: ['50px', '75px'] }}
                      >
                        {Icons[id]}
                      </Flex>
                      <Text
                        sx={{
                          color: color,
                          fontSize: ['sm', 'md'],
                          fontWeight: 'bold',
                        }}
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
          sx={{
            flexDirection: 'column',
            bgColor: bgCard,
            borderRadius: 25,
            boxShadow: 'md',
            p: 5,
            gap: 10,
          }}
        >
          <Heading sx={{ fontSize: ['md', 'lg'], fontWeight: 'bold' }}>
            Mutiara Hikmah
          </Heading>
          <Flex sx={{ flexDirection: 'column', gap: 10 }}>
            <Collapse startingHeight={40} in={showFullQuote}>
              <Text
                onClick={handleClickQuote}
                sx={{
                  cursor: 'pointer',
                  fontSize: ['sm', 'md'],
                  fontStyle: 'italic',
                }}
              >
                {quote}
              </Text>
            </Collapse>
            <Text
              sx={{
                color: textPurpleLight,
                fontSize: ['xs', 'sm'],
                fontWeight: 'bold',
              }}
            >
              {narrator}
            </Text>
          </Flex>
        </Flex>
        {/* Doa */}
        <Flex as="section" sx={{ flexDirection: 'column', gap: 10 }}>
          <Heading sx={{ fontSize: ['md', 'lg'], fontWeight: 'bold' }}>
            Kumpulan Doa
          </Heading>
          <Flex sx={{ gap: 10 }}>
            {toc
              .filter(({ category }) => category === 'doa')
              .map(content => {
                const { id, title, link } = content;
                return (
                  <Link href={link} passHref={true} key={id}>
                    <AspectRatio ratio={1} sx={{ flex: 1, cursor: 'pointer' }}>
                      <Flex
                        sx={{
                          bgColor: bgCard,
                          borderRadius: '15%',
                          boxShadow: 'md',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <Flex
                          sx={{ alignItems: 'flex-end', h: ['35px', '60px'] }}
                        >
                          {Icons[id]}
                        </Flex>
                        <Text
                          sx={{ fontSize: ['xs', 'sm'], fontWeight: 'bold' }}
                        >
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
      {/* Settings */}
      <Settings isOpen={isOpenSettings} onClose={onCloseSettings} />
      {/* Location Picker */}
      <Location isOpen={isOpenLocation} onClose={onCloseLocation} />
    </>
  );
};

export default Home;
