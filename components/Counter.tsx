// Eksternal
import { AddIcon } from '@chakra-ui/icons';
import { IconButton, Input } from '@chakra-ui/react';
import { useState } from 'react';

// Internal
import { useColors } from '@hooks';

const Counter = () => {
  // Dark/light mode colors
  const { bgButton, textDark } = useColors();

  const [value, setValue] = useState(0);
  const handleClickCounter = () => {
    setValue(value + 1);
  };

  return (
    <>
      <Input
        variant="unstyled"
        color={textDark}
        fontSize={['md', 'lg']}
        fontWeight="bold"
        textAlign="center"
        value={value}
        readOnly={true}
        w={12}
      />
      <IconButton
        aria-label="Hitung"
        bgColor={bgButton}
        borderRadius="md"
        color="black"
        icon={<AddIcon pointerEvents="none" />}
        onClick={handleClickCounter}
      />
    </>
  );
};

export default Counter;
