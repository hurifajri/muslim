// Eksternal
// Internal
import { useEffect, useState } from 'react';

import initialSettings from '@/data/initial-settings';
import isServer from '@/helpers/is-server';

type Setting = Record<
  string,
  {
    name: string;
    label: string;
    isActive: boolean;
  }
>;

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
