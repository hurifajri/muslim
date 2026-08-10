import { ExternalLink, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Fragment } from 'react';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { sources } from '@/data/sources';
import { useSettingsStore } from '@/providers/settings-store-provider';
import { SETTINGS_CONFIG } from '@/stores/settings-store';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { settings, setSettings } = useSettingsStore(state => state);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader className="flex-row items-center">
          <SettingsIcon />
          <SheetTitle>Pengaturan</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col overflow-y-auto px-6">
          {SETTINGS_CONFIG.map(setting => {
            const isDarkMode = setting.name === 'darkMode';

            return (
              <Fragment key={setting.name}>
                <div className="flex items-center justify-between">
                  <Label htmlFor={setting.name}>{setting.label}</Label>
                  <Switch
                    id={setting.name}
                    name={setting.name}
                    checked={isDarkMode ? isDark : settings[setting.name]}
                    onCheckedChange={checked => {
                      if (isDarkMode) {
                        setTheme(checked ? 'dark' : 'light');
                      }
                      setSettings(setting.name, checked);
                    }}
                  />
                </div>
                <Separator className="my-4" />
              </Fragment>
            );
          })}
        </div>
        <SheetFooter className="gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm">Tentang Aplikasi</span>
            <div className="flex items-center justify-between">
              <span className="text-xs">Versi</span>
              <span className="text-xs">1.0.0</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">Sumber</span>
            <div className="flex flex-wrap items-center gap-2">
              {sources.map(source => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-xs"
                >
                  {source.title}&nbsp;
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { Settings };
