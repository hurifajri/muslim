// Eksternal
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

// Internal
import { Counter, If } from '@components';
import { useColors } from '@hooks';
import { iBenefit, iItems } from '@interfaces';

// Internal dynamic
const Benefits = dynamic(() => import('@components/Benefits'));

const Items = ({ items, category }: iItems) => {
  // Dark/light mode colors
  const { bc, bgCard, bgPurple } = useColors();

  // Handle "Lihat Keutamaan"
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [benefits, setBenefits] = useState<iBenefit[] | null>([]);
  const handleClickBenefits = (
    itemTitle: string,
    itemBenefits: iBenefit[] | null
  ) => {
    setTitle(itemTitle);
    setBenefits(itemBenefits);
    onOpen();
  };

  return (
    <>
      {/* Dzikir or Doa */}
      <Flex as="main" direction="column">
        {items
          .filter(pItem => pItem.category.includes(category))
          .map(pItem => {
            return (
              <Flex
                as="section"
                key={pItem.id}
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
                    {pItem.title}
                  </Heading>
                  <If condition={pItem.note}>
                    <Text
                      fontSize={['sm', 'md']}
                      opacity={0.8}
                      flex={1}
                      textAlign="right"
                    >
                      {pItem.note}
                    </Text>
                  </If>
                </Flex>
                {pItem.items.map(cItem => {
                  return (
                    <Flex
                      key={cItem.id}
                      direction="column"
                      p={4}
                      sx={{ gap: 20 }}
                    >
                      <Box
                        fontFamily="Amiri, serif"
                        textAlign="right"
                        fontSize="2xl"
                        lineHeight={2.5}
                        dangerouslySetInnerHTML={{ __html: cItem.arabic }}
                      />
                      <Flex
                        justify={cItem.benefits ? 'space-between' : 'flex-end'}
                      >
                        <If condition={cItem.benefits !== null}>
                          <Button
                            aria-label="Lihat Keutamaan"
                            py={2}
                            cursor="pointer"
                            fontSize="sm"
                            opacity={0.7}
                            textTransform="uppercase"
                            onClick={() =>
                              handleClickBenefits(pItem.title, cItem.benefits)
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
                          <Counter />
                        </Flex>
                      </Flex>
                      <If condition={cItem.transliteration}>
                        <Text fontSize={['md', 'lg']} fontStyle="italic">
                          {cItem.transliteration}
                        </Text>
                      </If>
                      <Text fontSize={['md', 'lg']}>
                        {`"${cItem.translation}"`}
                        <If condition={cItem.narrator}>
                          <Text
                            as="span"
                            fontSize={['sm', 'md']}
                            opacity={0.8}
                          >{` [${cItem.narrator}]`}</Text>
                        </If>
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            );
          })}
      </Flex>
      {/* Benefits of each item Dzikir or Doa */}
      <Benefits
        benefits={benefits}
        title={title}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default Items;
