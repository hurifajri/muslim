// Eksternal
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

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
                      sx={{ gap: 30 }}
                    >
                      <Box
                        fontFamily="Amiri, serif"
                        fontWeight="bold"
                        textAlign="right"
                        fontSize="2xl"
                        lineHeight={2.5}
                        dangerouslySetInnerHTML={{ __html: item.arabic }}
                      />
                      <If condition={item.transliteration}>
                        <Text fontStyle="italic">{item.transliteration}</Text>
                      </If>
                      <Text>
                        {item.translation}
                        {item.narrator && ` [${item.narrator}]`}
                      </Text>
                      <If condition={item.benefits !== null}>
                        <Button
                          py={2}
                          cursor="pointer"
                          fontSize="sm"
                          opacity={0.7}
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
    </>
  );
};

export default Dzikir;
