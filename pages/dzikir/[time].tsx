// Eksternal
import { AddIcon } from '@chakra-ui/icons';
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
  IconButton,
  Input,
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
  const { bc, bg, bgButton, bgCard, bgPurple, textDark } = useColors();

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
                      opacity={0.8}
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
                      sx={{ gap: 20 }}
                    >
                      <Box
                        fontFamily="Amiri, serif"
                        textAlign="right"
                        fontSize="2xl"
                        lineHeight={2.5}
                        dangerouslySetInnerHTML={{ __html: item.arabic }}
                      />
                      <Flex
                        justify={item.benefits ? 'space-between' : 'flex-end'}
                      >
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
                        <Flex
                          align="center"
                          justify="space-between"
                          borderRadius="md"
                          bgColor={bgPurple}
                        >
                          <Input
                            variant="unstyled"
                            color={textDark}
                            fontSize={['md', 'lg']}
                            fontWeight="bold"
                            textAlign="center"
                            id={`input-${dzikir.id}.${item.id}`}
                            name={`input-${dzikir.id}.${item.id}`}
                            value={0}
                            readOnly={true}
                            w={12}
                          />
                          <IconButton
                            aria-label="Hitung"
                            bgColor={bgButton}
                            borderRadius="md"
                            color="black"
                            icon={<AddIcon pointerEvents="none" />}
                            name={`button-${dzikir.id}.${item.id}`}
                            // onClick={handleClickCounter}
                          />
                        </Flex>
                      </Flex>
                      <If condition={item.transliteration}>
                        <Text fontSize={['md', 'lg']} fontStyle="italic">
                          {item.transliteration}
                        </Text>
                      </If>
                      <Text fontSize={['md', 'lg']}>
                        {`"${item.translation}"`}
                        <If condition={item.narrator}>
                          <Text
                            as="span"
                            fontSize={['sm', 'md']}
                            opacity={0.8}
                          >{` [${item.narrator}]`}</Text>
                        </If>
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            );
          })}
      </Flex>

      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent
            bgColor={bg}
            boxShadow="lg"
            borderTopRadius="35px"
            py={2}
          >
            <DrawerCloseButton right="17px" top="17px" borderRadius="50%" />
            <DrawerHeader display="flex">
              <Heading flex={0.9} fontSize={['md', 'lg']} fontWeight="bold">
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
                    opacity={0.8}
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
