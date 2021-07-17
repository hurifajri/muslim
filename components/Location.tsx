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
import { isServer } from '@helpers';
import { useInitialLocation } from '@hooks';
import { iHandleChangeLocation, iLocation } from '@interfaces';

const Location = ({ isOpen, onClose }: iLocation) => {
  // Get and set default location from storage if any
  const { initialLocation } = useInitialLocation();

  // Get and set typed location by user
  const [tempLocation, setTempLocation] = useState(initialLocation);
  const handleChangeLocation = (event: iHandleChangeLocation) =>
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
            colorScheme="purple"
            bgGradient="linear(to-bl, purple.400, blue.400)"
            onClick={handleClickLocation}
          >
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Location;
