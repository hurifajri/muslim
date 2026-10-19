import { CheckIcon, ExternalLinkIcon, SettingsIcon } from 'lucide-react';
import { Fragment } from 'react';

import { TemporaryStorageNotice } from '@/components/storage-notice';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { COLOR_PALETTES } from '@/data/color-palettes';
import { sources } from '@/data/sources';
import { useStorageStatus } from '@/hooks/use-storage-status';
import { cn } from '@/lib/utils';
import { usePaletteStore } from '@/providers/palette-store-provider';
import { useSettingsStore } from '@/providers/settings-store-provider';
import { FONT_SIZE_RANGES } from '@/schemas/settings';
import { SETTINGS_CONFIG } from '@/stores/settings-store';

type SettingsProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, setSettings, fontSizes, setFontSize } = useSettingsStore(
    state => state
  );
  const { paletteId, setPaletteId } = usePaletteStore(state => state);
  const temporary = useStorageStatus('muslim-settings');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader className="flex shrink-0 flex-row items-center gap-2">
          <SettingsIcon />
          <SheetTitle>Pengaturan</SheetTitle>
        </SheetHeader>
        <ScrollArea
          type="scroll"
          scrollHideDelay={700}
          className="min-h-0 flex-1"
          viewportProps={{
            role: 'region',
            'aria-label': 'Pengaturan bacaan',
            tabIndex: 0,
          }}
        >
          <FieldGroup className="gap-4 p-4">
            {temporary && (
              <TemporaryStorageNotice>
                Pengaturan bacaan hanya berlaku selama sesi ini dan akan hilang
                saat halaman dimuat ulang atau ditutup.
              </TemporaryStorageNotice>
            )}
            <FieldSet className="min-w-0 gap-2">
              <FieldLegend variant="label">Tema warna</FieldLegend>
              <div className="flex flex-wrap items-center gap-1">
                {COLOR_PALETTES.map(palette => {
                  const isActive = paletteId === palette.id;
                  return (
                    <Button
                      key={palette.id}
                      size="icon"
                      aria-label={`${palette.flower} (${palette.name})`}
                      aria-pressed={isActive}
                      onClick={() => setPaletteId(palette.id)}
                      className={cn(
                        isActive
                          ? 'border-foreground ring-foreground/30 ring-2'
                          : 'hover:border-foreground/30 border-transparent'
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
              {/* <span className="text-xs">
                {COLOR_PALETTES.find(p => p.id === paletteId)?.flower ?? ''}
              </span> */}
            </FieldSet>
            <Separator />

            {(['arabic', 'translation'] as const).map(key => (
              <Field key={key}>
                <FieldLabel id={`font-${key}-label`} htmlFor={`font-${key}`}>
                  {key === 'arabic'
                    ? 'Ukuran huruf Arab'
                    : 'Ukuran huruf terjemahan'}{' '}
                  · {fontSizes[key]}px
                </FieldLabel>
                <Slider
                  id={`font-${key}`}
                  aria-labelledby={`font-${key}-label`}
                  min={FONT_SIZE_RANGES[key].min}
                  max={FONT_SIZE_RANGES[key].max}
                  step={1}
                  value={[fontSizes[key]]}
                  onValueChange={([value]) => void setFontSize(key, value)}
                  className="min-h-8"
                />
              </Field>
            ))}
            <p
              lang="ar"
              dir="rtl"
              className="font-arabic leading-loose"
              style={{ fontSize: fontSizes.arabic }}
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <p style={{ fontSize: fontSizes.translation }}>
              Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.
            </p>
            <Separator />

            {SETTINGS_CONFIG.map(setting => (
              <Fragment key={setting.name}>
                <Field orientation="horizontal">
                  <FieldLabel htmlFor={setting.name}>
                    {setting.label}
                  </FieldLabel>
                  <Switch
                    id={setting.name}
                    name={setting.name}
                    checked={settings[setting.name]}
                    onCheckedChange={checked => {
                      void setSettings(setting.name, checked);
                    }}
                  />
                </Field>
                <Separator />
              </Fragment>
            ))}
          </FieldGroup>
        </ScrollArea>
        <SheetFooter className="shrink-0 gap-4 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm">Tentang aplikasi</span>
            <div className="flex items-center justify-between">
              <span className="text-xs">Versi</span>
              <span className="text-xs">2.0.0</span>
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
                  rel="noopener noreferrer"
                  className="flex items-center text-xs"
                >
                  {source.title}&nbsp;
                  <ExternalLinkIcon className="size-3" />
                </a>
              ))}
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
