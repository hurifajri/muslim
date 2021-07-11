// Eksternal
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useState } from 'react';

// Internal
import { If } from '@components';
import { dzikirs } from '@data';
import { useColors } from '@hooks';
import { capitalize } from '@utils';

const Dzikir: NextPage = () => {
  const { query } = useRouter();
  const time = query?.time ?? '';

  // Dark/light mode colors
  const { bgCard, bc } = useColors();

  // Handle "Lihat Keutamaan"
  type tItemBenefits =
    | { id: number; translation: string; narrator: string }[]
    | null;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [benefits, setBenefits] = useState<tItemBenefits>([]);
  const handleClickBenefits = (
    itemTitle: string,
    itemBenefits: tItemBenefits
  ) => {
    setTitle(itemTitle);
    setBenefits(itemBenefits);
    onOpen();
  };

  return (
    <>
      <NextSeo
        title={`Muslim • Dzikir ${capitalize(time)}`}
        description="Dzikir Pagi Sesuai Sunnah."
      />
      <Flex as="main" direction="column">
        {dzikirs
          .filter(dzikir => dzikir.times.includes(time))
          .map(dzikir => {
            return (
              <Flex
                as="section"
                key={dzikir.id}
                direction="column"
                borderBottom={`1px solid ${bc}`}
                _even={{ bgColor: bgCard }}
                _last={{
                  borderBottom: 'none',
                }}
              >
                {/* Header */}
                <Flex
                  as="header"
                  align="center"
                  justify="space-between"
                  borderBottom={`1px solid ${bc}`}
                  p={4}
                >
                  <Heading fontSize={['md', 'lg']} fontWeight="bold" flex={3}>
                    {dzikir.title}
                  </Heading>
                  <If condition={dzikir.note}>
                    <Text
                      fontSize={['sm', 'md']}
                      opacity={0.9}
                      flex={1}
                      textAlign="right"
                    >
                      {dzikir.note}
                    </Text>
                  </If>
                </Flex>
                {dzikir.items.map(item => {
                  return (
                    <Flex
                      key={item.id}
                      direction="column"
                      p={4}
                      sx={{ gap: 30 }}
                    >
                      <Box
                        fontFamily="Amiri, serif"
                        textAlign="right"
                        fontSize="2xl"
                        lineHeight={2.5}
                        dangerouslySetInnerHTML={{ __html: item.arabic }}
                      />
                      <If condition={item.transliteration}>
                        <Text fontSize={['md', 'lg']} fontStyle="italic">
                          {item.transliteration}
                        </Text>
                      </If>
                      <Text fontSize={['md', 'lg']}>
                        {item.translation}
                        <If condition={item.narrator}>
                          <Text
                            as="span"
                            fontSize={['sm', 'md']}
                            opacity={0.9}
                          >{` [${item.narrator}]`}</Text>
                        </If>
                      </Text>
                      <If condition={item.benefits !== null}>
                        <Button
                          aria-label="Lihat Keutamaan"
                          py={2}
                          cursor="pointer"
                          fontSize="sm"
                          opacity={0.7}
                          textTransform="uppercase"
                          onClick={() =>
                            handleClickBenefits(dzikir.title, item.benefits)
                          }
                        >
                          Lihat Keutamaan
                        </Button>
                      </If>
                    </Flex>
                  );
                })}
              </Flex>
            );
          })}
      </Flex>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent borderTopRadius="40px" pt="50px" pb={6}>
            <DrawerCloseButton right="22px" top="22px" borderRadius="50%" />
            <DrawerHeader>
              <Heading fontSize={['md', 'lg']} fontWeight="bold">
                Keutamaan {title}
              </Heading>
            </DrawerHeader>
            <DrawerBody>
              {benefits?.map(benefit => (
                <Text key={benefit.id} fontSize={['md', 'lg']}>
                  {benefit.translation}
                  <Text
                    as="span"
                    fontSize={['sm', 'md']}
                    opacity={0.9}
                  >{` [${benefit.narrator}]`}</Text>
                </Text>
              ))}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Dzikir;
