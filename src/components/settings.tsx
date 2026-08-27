import { CheckIcon, ExternalLinkIcon, SettingsIcon, XIcon } from 'lucide-react';
import { Fragment } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { COLOR_PALETTES } from '@/data/color-palettes';
import { sources } from '@/data/sources';
import { cn } from '@/lib/utils';
import { usePaletteStore } from '@/providers/palette-store-provider';
import { useSettingsStore } from '@/providers/settings-store-provider';
import { SETTINGS_CONFIG } from '@/stores/settings-store';

type SettingsProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, setSettings } = useSettingsStore(state => state);
  const { paletteId, setPaletteId } = usePaletteStore(state => state);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" showCloseButton={false} className="bg-app-1">
        <SheetHeader className="flex-row items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="text-app-1-1" />
            <SheetTitle className="text-app-1-1">Pengaturan</SheetTitle>
          </div>
          <SheetClose asChild>
            <Button
              size="icon"
              aria-label="Tutup pengaturan"
              onClick={onClose}
              className="bg-app-6 hover:bg-app-6/80 text-app-6-6"
            >
              <XIcon />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            <Label className="text-app-1-1">Tema Warna</Label>
            <div className="flex flex-wrap items-center gap-1">
              {COLOR_PALETTES.map(palette => {
                const isActive = paletteId === palette.id;
                return (
                  <Button
                    key={palette.id}
                    size="icon-xs"
                    aria-label={`${palette.flower} (${palette.name})`}
                    aria-pressed={isActive}
                    onClick={() => setPaletteId(palette.id)}
                    className={cn(
                      isActive
                        ? 'border-app-1-1 ring-app-1-1/30 ring-2'
                        : 'hover:border-app-1-1/30 border-transparent'
                    )}
                    style={{ backgroundColor: palette.previewColor }}
                  >
                    {isActive && (
                      <CheckIcon
                        className="size-3.5"
                        style={{
                          color:
                            palette.mode === 'dark' ? '#e0e0e0' : '#2a2a2a',
                        }}
                      />
                    )}
                  </Button>
                );
              })}
            </div>
            {/* <span className="text-app-1-1 text-xs">
              {COLOR_PALETTES.find(p => p.id === paletteId)?.flower ?? ''}
            </span> */}
          </div>
          <Separator className="bg-app-2" />

          {SETTINGS_CONFIG.map(setting => (
            <Fragment key={setting.name}>
              <div className="flex items-center justify-between">
                <Label htmlFor={setting.name} className="text-app-1-1">
                  {setting.label}
                </Label>
                <Switch
                  id={setting.name}
                  name={setting.name}
                  checked={settings[setting.name]}
                  onCheckedChange={checked => {
                    setSettings(setting.name, checked);
                  }}
                  className="*:data-[slot=switch-thumb]:bg-app-5 dark:*:data-[slot=switch-thumb]:bg-app-5 data-checked:border-app-6 data-checked:bg-app-6! bg-app-4!"
                />
              </div>
              <Separator className="bg-app-2" />
            </Fragment>
          ))}
        </div>
        <SheetFooter className="gap-4 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-app-1-1 text-sm">Tentang Aplikasi</span>
            <div className="flex items-center justify-between">
              <span className="text-app-1-1 text-xs">Versi</span>
              <span className="text-app-1-1 text-xs">2.0.0</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-app-1-1 text-sm">Sumber</span>
            <div className="flex flex-wrap items-center gap-2">
              {sources.map(source => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-app-1-1 flex items-center text-xs"
                >
                  {source.title}&nbsp;
                  <ExternalLinkIcon className="text-app-1-1 size-3" />
                </a>
              ))}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
