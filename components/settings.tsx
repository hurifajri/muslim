// Eksternal
import { SettingsIcon } from '@chakra-ui/icons';
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Text,
  useColorMode,
} from '@chakra-ui/react';

// Internal
import { useColors } from '@hooks';

const Settings = ({ isOpen, onClose }) => {
  // Togle dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();

  // Dark/light mode colors
  const { bg } = useColors();

  return (
    <Drawer
      placement="right"
      size="xs"
      closeOnOverlayClick={true}
      onClose={onClose}
      isOpen={isOpen}
    >
      <DrawerOverlay />
      <DrawerContent bgColor={bg}>
        <DrawerCloseButton />
        <DrawerHeader
          display="flex"
          alignItems="center"
          borderBottomWidth="1px"
          sx={{ gap: 10 }}
          mb={5}
        >
          <SettingsIcon />
          <Heading fontSize={['lg', 'xl']} fontWeight="bold" lineHeight={1}>
            Pengaturan
          </Heading>
        </DrawerHeader>
        <DrawerBody>
          {/* Dark mode */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel htmlFor="mode-gelap" mb={0} cursor="pointer">
              Mode Gelap
            </FormLabel>
            <Switch
              id="mode-gelap"
              defaultChecked={colorMode === 'light'}
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
          <Divider my={2.5} />
          {/* Terjemahan */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel htmlFor="terjemahan" mb={0} cursor="pointer">
              Terjemahan
            </FormLabel>
            <Switch id="terjemahan" />
          </FormControl>
          <Divider my={2.5} />
          {/* Transliterasi */}
          <FormControl
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <FormLabel htmlFor="transliterasi" mb={0} cursor="pointer">
              Transliterasi
            </FormLabel>
            <Switch id="transliterasi" />
          </FormControl>
        </DrawerBody>
        <DrawerFooter display="flex" justifyContent="flex-start">
          <Text>Tentang Aplikasi</Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
