// Eksternal
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// Internal
import isServer from '@/helpers/isServer';
import useColors from '@/hooks/useColors';
import useInitialLocation from '@/hooks/useInitialLocation';

interface LocationProps {
  isOpen: boolean;
  onClose: () => void;
}

type HandleChangeLocation = React.ChangeEvent<HTMLInputElement>;

const Location = ({ isOpen, onClose }: LocationProps) => {
  // Get and set default location from storage if any
  const { initialLocation } = useInitialLocation();

  // Get and set typed location by user
  const [tempLocation, setTempLocation] = useState(initialLocation);
  const handleChangeLocation = (event: HandleChangeLocation) =>
    setTempLocation(event.target.value);

  // Set location from user typing and exit
  const [location, setLocation] = useState(initialLocation);
  const handleClickLocation = () => {
    setLocation(tempLocation);
    onClose();
  };

  // Set location to storage
  useEffect(() => {
    if (!isServer) localStorage?.setItem('mslm-location', location);
  }, [location]);

  // Dark/light mode colors
  const { bgButton } = useColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
      motionPreset="scale"
      size="xs"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={['md', 'lg']} textTransform="capitalize">
          Ubah Lokasi
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Contoh: Bogor"
            defaultValue={location}
            variant="flushed"
            onChange={handleChangeLocation}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            bgColor={bgButton}
            onClick={handleClickLocation}
            _hover={{ bg: bgButton }}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Location;
