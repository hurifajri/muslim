// Eksternal
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
import { Benefits, Counter, If } from '@components';
import { useColors } from '@hooks';
import { iItems } from '@interfaces';

const Items = ({ items, category }: iItems) => {
  // Dark/light mode colors
  const { bc, bgCard, bgPurple } = useColors();

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
      {/* Dzikir or Doa */}
      <Flex as="main" direction="column">
        {items
          .filter(item => item.category.includes(category))
          .map(item => {
            return (
              <Flex
                as="section"
                key={item.id}
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
                    {item.title}
                  </Heading>
                  <If condition={item.note}>
                    <Text
                      fontSize={['sm', 'md']}
                      opacity={0.8}
                      flex={1}
                      textAlign="right"
                    >
                      {item.note}
                    </Text>
                  </If>
                </Flex>
                {item.items.map(item => {
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
                              handleClickBenefits(item.title, item.benefits)
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
