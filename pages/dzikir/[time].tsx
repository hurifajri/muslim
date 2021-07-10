// Eksternal
import { Box } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { useRouter } from 'next/router';
// import { NextSeo } from 'next-seo';

// Internal
// import { data } from '@data/dzikr';
// import dynamic from 'next/dynamic';

// const DzikrItem = dynamic(() => import('@components/dzikrItem'), {
//   ssr: false,
// });

const Dzikir: NextPage = () => {
  const { query } = useRouter();

  return (
    <>
      {/* <NextSeo
        title={`Dzikrr | Dzikir ${query.time}`}
        description="Aplikasi Dzikir Pagi dan Petang"
      /> */}

      <Box pos="relative">
        {/* <DzikrItem
          data={{
            id: 0,
            arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
            arabic_latin: '',
            faedah: '',
            narrator: '',
            note: 'Dibaca 1x',
            title: `Ta'awudz`,
            translated_id:
              'Aku berlindung kepada Allah dari godaan syaitan yang terkutuk.',
            time: '',
          }}
        />
        {data.dzikr
          .filter((item) => ['', query.time].includes(item.time))
          .map((item) => {
            if (item.arabic.indexOf('@') > 0) {
              const arabics: string[] = item.arabic.split('@');
              const narrators: string[] = item.narrator.split('@');
              const translatedIds: string[] = item.translated_id.split('@');

              return (
                <Box
                  _even={{ bgColor: 'rgba(251, 240, 218, 0.24)' }}
                  key={item.id}
                >
                  {arabics.map((arabic, index) => (
                    <DzikrItem
                      noTitle={index > 0}
                      noFaedah={index < arabics.length - 1}
                      data={{
                        ...item,
                        arabic,
                        narrator: narrators[index],
                        translated_id: translatedIds[index],
                      }}
                      key={index}
                      borderBottom={0}
                      _last={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  ))}
                </Box>
              );
            } else {
              return (
                <DzikrItem
                  data={item}
                  key={item.id}
                  _even={{ bgColor: 'rgba(251, 240, 218, 0.24)' }}
                />
              );
            }
          })} */}
      </Box>
    </>
  );
};

export default Dzikir;
