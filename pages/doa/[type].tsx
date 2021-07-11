// Eksternal
import { Box, Flex, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

// Internal
import { doas } from '@data';

const Dzikir: NextPage = () => {
  const { query } = useRouter();

  return (
    <Box position="relative">
      {doas
        .filter(doa => doa.types.includes(query.type))
        .map(doa => {
          return (
            <Box key={doa.id} borderBottom="1px solid rgba(0, 0, 0, 0.1)">
              <Flex
                justify="space-between"
                borderBottom="1px solid rgba(0, 0, 0, 0.1)"
                p={4}
                align="flex-end"
              >
                <Text fontWeight="600" mr={2} flex={2.5}>
                  {doa.title}
                </Text>
              </Flex>
              {doa.items.map(item => {
                return (
                  <Box key={item.id} p={4}>
                    <Box
                      textAlign="right"
                      fontFamily="'Amiri', serif"
                      fontWeight="700"
                      fontSize="2xl"
                      lineHeight="2.4"
                      letterSpacing={{ base: '-0.5px', lg: 0 }}
                      mb={4}
                      dangerouslySetInnerHTML={{ __html: item.arabic }}
                    />
                    <Text fontStyle="italic" mb={4}>
                      {item.transliteration}
                    </Text>
                    <Text>
                      {item.translation}
                      {item.narrator && ` [${item.narrator}]`}
                    </Text>
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
