// Eksternal
import { useEffect, useState } from 'react';

// Internal
import initialSettings from '@data/initialSettings';
import isServer from '@helpers/isServer';
import { Setting } from '@interfaces/Settings';

const useSettings = () => {
  const key = 'mslm-settings';

  const [settings, setSettings] = useState<Setting>(() => {
    const storedSetting = !isServer ? localStorage?.getItem(key) : null;

    return storedSetting !== null ? JSON.parse(storedSetting) : initialSettings;
  });

  useEffect(() => {
    if (!isServer) localStorage?.setItem(key, JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};

export default useSettings;
