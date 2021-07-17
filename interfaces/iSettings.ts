interface iSettings {
  isOpen: boolean;
  onClose: () => void;
}

export interface iSetting {
  [key: string]: {
    name: string;
    label: string;
    isActive: boolean;
  };
}

export interface iHandleChangeSetting {
  target: { name: string; checked: boolean };
}

export default iSettings;
