// Eksternal
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input } from '@chakra-ui/react';
import { useState } from 'react';

// Internal
import { useColors } from '@hooks';

const Counter = () => {
  // Dark/light mode colors
  const { bgButton, bgInput } = useColors();

  const [value, setValue] = useState(0);
  const handleClickCounter = () => setValue(value + 1);
  const handleClickReset = () => setValue(0);

  return (
    <Flex>
      <IconButton
        aria-label="Reset"
        bgColor={bgButton}
        borderLeftRadius="md"
        icon={<RepeatIcon pointerEvents="none" />}
        onClick={handleClickReset}
        _hover={{ bg: bgButton }}
        zIndex={1}
      />
      <Input
        variant="unstyled"
        bgColor={bgInput}
        borderRadius="none"
        fontSize={['md', 'lg']}
        fontWeight="bold"
        textAlign="center"
        value={value}
        readOnly={true}
        w={12}
        zIndex={0}
      />
      <IconButton
        aria-label="Hitung"
        bgColor={bgButton}
        borderRightRadius="md"
        icon={<AddIcon pointerEvents="none" />}
        onClick={handleClickCounter}
        _hover={{ bg: bgButton }}
        zIndex={1}
      />
    </Flex>
  );
};

export default Counter;
