// Eksternal
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Text,
} from '@chakra-ui/react';

// Internal
import { useColors } from '@hooks';

const Benefits = ({ benefits, title, isOpen, onClose }) => {
  // Dark/light mode colors
  const { bg } = useColors();

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          bgColor={bg}
          boxShadow="lg"
          borderTopRadius="35px"
          py={2}
        >
          <DrawerCloseButton right="17px" top="17px" borderRadius="50%" />
          <DrawerHeader display="flex">
            <Heading flex={0.9} fontSize={['md', 'lg']} fontWeight="bold">
              Keutamaan {title}
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            {benefits?.map(benefit => (
              <Text key={benefit.id} fontSize={['md', 'lg']}>
                {benefit.translation}
                <Text
                  as="span"
                  fontSize={['sm', 'md']}
                  opacity={0.8}
                >{` [${benefit.narrator}]`}</Text>
              </Text>
            ))}
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Benefits;
