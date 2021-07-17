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
import { Fragment } from 'react';

// Internal
import { useColors, useSettings } from '@hooks';
import { iHandleChangeSetting, iSettings } from '@interfaces';

const Settings = ({ isOpen, onClose }: iSettings) => {
  // Togle dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();

  // Dark/light mode colors
  const { bg } = useColors();

  // Settings
  const { settings, setSettings } = useSettings();
  const handleChangeSetting = (event: iHandleChangeSetting) => {
    const { name, checked } = event.target;
    const newSettings = { ...settings };
    newSettings[name].isActive = checked;
    setSettings(newSettings);
  };

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
              isChecked={colorMode === 'dark'}
              onChange={toggleColorMode}
            />
          </FormControl>
          <Divider my={5} />
          {/* Other settings */}
          {Object.values(settings).map(setting => (
            <Fragment key={setting.name}>
              <FormControl
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <FormLabel htmlFor={setting.name} mb={0} cursor="pointer">
                  {setting.label}
                </FormLabel>
                <Switch
                  id={setting.name}
                  name={setting.name}
                  isChecked={setting.isActive}
                  onChange={event => handleChangeSetting(event)}
                />
              </FormControl>
              <Divider my={5} />
            </Fragment>
          ))}
        </DrawerBody>
        <DrawerFooter display="flex" justifyContent="flex-start">
          <Text>Tentang Aplikasi</Text>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
