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
import { If, Items } from '@components';
import { doas } from '@data';
import { useColors } from '@hooks';
import { capitalize } from '@utils';

const Doa: NextPage = () => {
  const { query } = useRouter();
  const type = Array.isArray(query.type) ? query.type[0] : query.type ?? '';

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
        title={`Muslim • Kumpulan Doa ${capitalize(type)}`}
        description="Kumpulan Doa di Dalam Al-Quran dan Hadits Nabi."
      />
      <Items items={doas} timeOrType={{ label: 'types', data: type }} />
    </>
  );
};

export default Doa;
