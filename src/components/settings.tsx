import { ExternalLink, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Fragment } from 'react';

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
      <SheetContent side="right" className="bg-app-bg">
        <SheetHeader className="flex flex-row items-center gap-2 border-b pb-4 mb-5">
          <SettingsIcon />
          <SheetTitle className="text-lg font-bold leading-none">
            Pengaturan
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 flex flex-col overflow-y-auto">
          {/* Dark mode */}
          <div className="flex items-center justify-between">
            <span className="text-sm cursor-pointer">Mode Gelap</span>
            <Switch
              id="mode-gelap"
              checked={isDark}
              onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          <Separator className="my-5" />
          {/* Other settings */}
          {SETTINGS_CONFIG.map(setting => (
            <Fragment key={setting.name}>
              <div className="flex items-center justify-between">
                <span className="text-sm cursor-pointer">{setting.label}</span>
                <Switch
                  id={setting.name}
                  name={setting.name}
                  checked={settings[setting.name]}
                  onCheckedChange={checked =>
                    setSettings(setting.name, checked)
                  }
                />
              </div>
              <Separator className="my-5" />
            </Fragment>
          ))}
        </div>
        <SheetFooter className="flex flex-col items-start gap-2 px-6 pb-6">
          <span className="text-sm">Tentang Aplikasi</span>
          <div className="flex flex-col w-full gap-[30px]">
            <div className="flex items-center justify-between">
              <span className="text-xs">Versi</span>
              <span className="text-xs">1.0.0</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm">Sumber</span>
              <div className="flex flex-wrap items-center gap-1">
                {sources.map(source => (
                  <div key={source.id} className="flex items-center gap-1">
                    <span className="text-xs">{source.title}</span>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { Settings };
