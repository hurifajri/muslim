// Eksternal
import { Box, Flex, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

// Internal
import { dzikirs } from '@data';

const Dzikir: NextPage = () => {
  const { query } = useRouter();

  return (
    <Box position="relative">
      {dzikirs
        .filter(dzikir => dzikir.times.includes(query.time))
        .map(dzikir => {
          return (
            <Box key={dzikir.id} borderBottom="1px solid rgba(0, 0, 0, 0.1)">
              <Flex
                justify="space-between"
                borderBottom="1px solid rgba(0, 0, 0, 0.1)"
                p={4}
                align="flex-end"
              >
                <Text fontWeight="600" mr={2} flex={2.5}>
                  {dzikir.title}
                </Text>
                <Text fontSize="sm" textAlign="right" opacity={0.7} flex={1}>
                  {dzikir.note}
                </Text>
              </Flex>
              {dzikir.contents.map(content => {
                return (
                  <Box key={content.id} p={4}>
                    <Box
                      textAlign="right"
                      fontFamily="'Amiri', serif"
                      fontWeight="700"
                      fontSize="2xl"
                      lineHeight="2.4"
                      letterSpacing={{ base: '-0.5px', lg: 0 }}
                      mb={4}
                      dangerouslySetInnerHTML={{ __html: content.arabic }}
                    />
                    <Text fontStyle="italic" mb={4}>
                      {content.transliteration}
                    </Text>
                    <Text>
                      {content.translation}
                      {content.narrator && ` [${content.narrator}]`}
                    </Text>
                    {content.benefits && (
                      <Box
                        py={2}
                        mt={4}
                        cursor="pointer"
                        fontSize="sm"
                        opacity={0.7}
                      >
                        Lihat Keutamaan
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          );
        })}
    </Box>
  );
};

export default Dzikir;
