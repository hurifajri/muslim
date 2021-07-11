// Eksternal
import { Box, Flex, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

// Internal
import { dzikirs } from '@data';
import { capitalize } from '@utils';

const Dzikir: NextPage = () => {
  const { query } = useRouter();
  const time = query?.time ?? '';

  return (
    <>
      <NextSeo
        title={`Muslim • Dzikir ${capitalize(time)}`}
        description="Dzikir Pagi Sesuai Sunnah."
      />
      <Box position="relative">
        {dzikirs
          .filter(dzikir => dzikir.times.includes(time))
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
                {dzikir.items.map(item => {
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
                      {item.benefits && (
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
    </>
  );
};

export default Dzikir;
