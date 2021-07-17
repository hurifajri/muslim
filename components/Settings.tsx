// Eksternal
import { ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Switch,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Link from 'next/link';
import { Fragment } from 'react';

// Internal
import { sources } from '@data';
import { useColors, useSettings } from '@hooks';
import { iHandleChangeSetting, iSettings } from '@interfaces';

const Settings = ({ isOpen, onClose }: iSettings) => {
  // Togle dark/light mode
  const { colorMode, toggleColorMode } = useColorMode();

  // Dark/light mode colors
  const { bg, bgButtonHighlight, textLight } = useColors();

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
              colorScheme="purple"
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
                  colorScheme="purple"
                />
              </FormControl>
              <Divider my={5} />
            </Fragment>
          ))}
          <Link href="/contact" passHref={true}>
            <Button
              width="100%"
              color={textLight}
              bg={bgButtonHighlight}
              _hover={{ bg: bgButtonHighlight }}
            >
              Kritik dan Saran
            </Button>
          </Link>
        </DrawerBody>
        <DrawerFooter
          display="flex"
          alignItems="flex-start"
          flexDirection="column"
          sx={{ gap: 10 }}
        >
          <Text fontSize={['sm', 'md']}>Tentang Aplikasi</Text>
          <Flex direction="column" width="100%" sx={{ gap: 30 }}>
            <Flex align="center" justify="space-between">
              <Text fontSize={['xs', 'sm']}>Versi</Text>
              <Text fontSize={['xs', 'sm']}>1.0.0</Text>
            </Flex>
            <Flex direction="column" sx={{ gap: 10 }}>
              <Text fontSize={['sm', 'md']}>Sumber</Text>
              <Flex flexWrap="wrap" align="center" sx={{ gap: 5 }}>
                {sources.map(source => (
                  <Flex
                    key={source.id}
                    align="center"
                    justify="center"
                    sx={{ gap: 5 }}
                  >
                    <Text fontSize={['xs', 'sm']}>{source.title}</Text>
                    <Text fontSize={['xs', 'sm']}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        <ExternalLinkIcon />
                      </a>
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Settings;
