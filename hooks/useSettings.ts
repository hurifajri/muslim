// Eksternal
import { useEffect, useState } from 'react';

// Internal
import { initialSettings } from '@data';
import { isServer } from '@helpers';
import { iSetting } from '@interfaces';

const useSettings = () => {
  const key = 'mslm-settings';

  const [settings, setSettings] = useState<iSetting>(() => {
    const storedSetting = !isServer ? localStorage?.getItem(key) : null;

    return storedSetting !== null ? JSON.parse(storedSetting) : initialSettings;
  });

  useEffect(() => {
    if (!isServer) localStorage?.setItem(key, JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings };
};

export default useSettings;
