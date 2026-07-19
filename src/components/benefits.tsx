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
import useColors from '@/hooks/use-colors';

export interface Benefit {
  id: number;
  translation: string;
  narrator: string;
}

interface BenefitsProps {
  benefits: Benefit[] | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Benefits = ({ benefits, title, isOpen, onClose }: BenefitsProps) => {
  // Dark/light mode colors
  const { bg } = useColors();

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          sx={{
            bgColor: bg,
            boxShadow: 'lg',
            borderTopRadius: '35px',
            py: 2,
          }}
        >
          <DrawerCloseButton
            sx={{ right: '17px', top: '17px', borderRadius: '50%' }}
          />
          <DrawerHeader sx={{ display: 'flex' }}>
            <Heading
              sx={{ flex: 0.9, fontSize: ['md', 'lg'], fontWeight: 'bold' }}
            >
              Keutamaan {title}
            </Heading>
          </DrawerHeader>
          <DrawerBody
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {benefits?.map(benefit => (
              <Text key={benefit.id} sx={{ fontSize: ['md', 'lg'] }}>
                {benefit.translation}
                <Text
                  as="span"
                  sx={{
                    fontSize: ['sm', 'md'],
                    opacity: 0.8,
                  }}
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
