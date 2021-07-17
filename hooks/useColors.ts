// Eksternal
import { useColorModeValue } from '@chakra-ui/react';

const useColors = () => {
  const bc = useColorModeValue(
    'rgba(0, 0, 0, 0.2)',
    'rgba(255, 255, 255, 0.2)'
  );
  const bg = useColorModeValue('purple.50', 'purple.900');
  const bgBlue = useColorModeValue('#36219E', '#44339A');
  const bgButton = useColorModeValue('purple.100', 'purple.600');
  const bgButtonHighlight = useColorModeValue('#805AD5', '#7D2AE8');
  const bgCard = useColorModeValue('white', 'purple.800');
  const bgGradientBlue = useColorModeValue('blue.400', 'blue.300');
  const bgGradientPurple = useColorModeValue('purple.400', 'purple.300');
  const bgPurple = useColorModeValue('#E3DEFF', '#C3B8FF');
  const iconMenu = useColorModeValue('#36219E', '#FFFFFFEB');
  const textDark = useColorModeValue('gray.800', 'gray.900');
  const textLight = useColorModeValue('whiteAlpha.900', 'white');
  const textPurpleDark = useColorModeValue('purple.600', 'purple.200');
  const textPurpleLight = useColorModeValue('purple.400', 'purple.100');

  return {
    bc,
    bg,
    bgBlue,
    bgButton,
    bgButtonHighlight,
    bgCard,
    bgGradientBlue,
    bgGradientPurple,
    bgPurple,
    iconMenu,
    textDark,
    textLight,
    textPurpleDark,
    textPurpleLight,
  };
};

export default useColors;
