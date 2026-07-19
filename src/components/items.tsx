// Eksternal
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { Benefit } from '@/components/benefits';
// Internal
import Counter from '@/components/counter';
import If from '@/components/if';
import useColors from '@/hooks/use-colors';
import useSettings from '@/hooks/use-settings';

interface ContentItem {
  id: number;
  arabic: string;
  transliteration: string | null;
  translation: string;
  narrator: string | null;
  benefits: Benefit[] | null;
}

interface ParentItem {
  id: number;
  title: string;
  note: string | null;
  category: string[];
  items: ContentItem[];
}

interface ItemsProps {
  items: ParentItem[];
  category: string;
}

// Internal dynamic
const Benefits = dynamic(() => import('@/components/benefits'));

const Items = ({ items, category }: ItemsProps) => {
  // Dark/light mode colors
  const { bc, bgButton, bgCard } = useColors();

  // Handle "Lihat Keutamaan"
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [benefits, setBenefits] = useState<Benefit[] | null>([]);
  const handleClickBenefits = (
    itemTitle: string,
    itemBenefits: Benefit[] | null
  ) => {
    setTitle(itemTitle);
    setBenefits(itemBenefits);
    onOpen();
  };

  // Settings
  const { settings } = useSettings();

  return (
    <>
      {/* Dzikir or Doa */}
      <Flex as="main" sx={{ flexDirection: 'column' }}>
        {items
          .filter(pItem => pItem.category.includes(category))
          .map(pItem => {
            return (
              <Flex
                as="section"
                key={pItem.id}
                sx={{
                  flexDirection: 'column',
                  borderBottom: `1px solid ${bc}`,
                  _even: { bgColor: bgCard },
                  _last: { borderBottom: 'none' },
                }}
              >
                {/* Header */}
                <Flex
                  as="header"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `1px solid ${bc}`,
                    p: 4,
                  }}
                >
                  <Heading
                    sx={{ fontSize: ['md', 'lg'], fontWeight: 'bold', flex: 3 }}
                  >
                    {pItem.title}
                  </Heading>
                  <If condition={pItem.note}>
                    <Text
                      sx={{
                        fontSize: ['sm', 'md'],
                        opacity: 0.8,
                        flex: 1,
                        textAlign: 'right',
                      }}
                    >
                      {pItem.note}
                    </Text>
                  </If>
                </Flex>
                {pItem.items.map(cItem => {
                  return (
                    <Flex
                      key={cItem.id}
                      sx={{ flexDirection: 'column', p: 4, gap: 20 }}
                    >
                      <Box
                        dangerouslySetInnerHTML={{ __html: cItem.arabic }}
                        sx={{
                          fontFamily: 'Amiri, serif',
                          textAlign: 'right',
                          fontSize: '2xl',
                          lineHeight: 2.5,
                        }}
                      />
                      {/* Condition to render benefits and counter button */}
                      <If
                        condition={
                          (cItem.benefits !== null &&
                            settings.benefits.isActive === true) ||
                          (pItem.note !== null &&
                            pItem.note !== 'Dibaca 1x' &&
                            settings.counter.isActive === true)
                        }
                      >
                        <Flex
                          sx={{
                            justifyContent:
                              cItem.benefits !== null &&
                              settings.benefits.isActive === true
                                ? 'space-between'
                                : 'flex-end',
                          }}
                        >
                          {/* Condition to render benefits button */}
                          <If
                            condition={
                              cItem.benefits !== null &&
                              settings.benefits.isActive === true
                            }
                          >
                            <Button
                              aria-label="Lihat Keutamaan"
                              onClick={() =>
                                handleClickBenefits(pItem.title, cItem.benefits)
                              }
                              sx={{
                                py: 2,
                                cursor: 'pointer',
                                fontSize: ['sm', 'md'],
                                textTransform: 'uppercase',
                                bgColor: bgButton,
                                width:
                                  pItem.note !== null &&
                                  pItem.note !== 'Dibaca 1x' &&
                                  settings.counter.isActive === true
                                    ? 'auto'
                                    : '100%',
                                _hover: { bg: bgButton },
                              }}
                            >
                              Lihat Keutamaan
                            </Button>
                          </If>
                          {/* Condition to render counter button */}
                          <If
                            condition={
                              pItem.note !== null &&
                              pItem.note !== 'Dibaca 1x' &&
                              settings.counter.isActive === true
                            }
                          >
                            <Counter />
                          </If>
                        </Flex>
                      </If>
                      {/*  Condition to render transliteration */}
                      <If
                        condition={
                          cItem.transliteration &&
                          settings.transliteration.isActive === true
                        }
                      >
                        <Text
                          sx={{ fontSize: ['md', 'lg'], fontStyle: 'italic' }}
                        >
                          {cItem.transliteration}
                        </Text>
                      </If>
                      {/*  Condition to render translation */}
                      <If condition={settings.translation.isActive === true}>
                        <Text sx={{ fontSize: ['md', 'lg'] }}>
                          {`"${cItem.translation}"`}
                          <If condition={cItem.narrator}>
                            <Text
                              as="span"
                              sx={{
                                fontSize: ['sm', 'md'],
                                opacity: 0.8,
                              }}
                            >{` [${cItem.narrator}]`}</Text>
                          </If>
                        </Text>
                      </If>
                    </Flex>
                  );
                })}
              </Flex>
            );
          })}
      </Flex>
      {/* Benefits of each item Dzikir or Doa */}
      <If condition={settings.benefits.isActive === true}>
        <Benefits
          benefits={benefits}
          title={title}
          isOpen={isOpen}
          onClose={onClose}
        />
      </If>
    </>
  );
};

export default Items;
