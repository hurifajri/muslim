import {
  DownloadIcon,
  RefreshCwIcon,
  Share2Icon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePosterExport } from '@/hooks/use-poster-export';
import type { RandomDoa } from '@/hooks/use-random-doa';
import { cn } from '@/lib/utils';

import { PosterBackgrounds, PosterControls } from './poster-controls';
import {
  defaultPosterOptions,
  MAX_FONT_SIZE,
  type PosterOptions,
} from './poster-options';
import { PosterPreview } from './poster-preview';

type PosterProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  doa: RandomDoa;
  onRollNewDoa?: () => void;
}>;

export function Poster({ isOpen, onClose, doa, onRollNewDoa }: PosterProps) {
  const { isMobile } = useIsMobile();
  const [options, setOptions] = useState(defaultPosterOptions);
  const [maxFontSize, setMaxFontSize] = useState(MAX_FONT_SIZE);
  const fitFontSize = useCallback((maximum: number) => {
    setMaxFontSize(maximum);
    setOptions(current =>
      current.fontSize > maximum ? { ...current, fontSize: maximum } : current
    );
  }, []);
  const posterRef = useRef<HTMLDivElement>(null);
  const key = JSON.stringify([doa, options]);
  const exporter = usePosterExport(key);
  const changeOptions = (change: Partial<PosterOptions>) =>
    setOptions(current => ({ ...current, ...change }));
  const result = exporter.result;
  const controls = (
    <PosterControls
      options={options}
      maxFontSize={maxFontSize}
      onChange={changeOptions}
    />
  );
  const content = (
    <fieldset
      disabled={exporter.isGenerating}
      className={cn(
        'flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 sm:flex-row',
        isMobile && 'p-4'
      )}
    >
      <div className="bg-input/90 flex max-h-[calc(100dvh-340px)] min-h-0 min-w-0 flex-col gap-4 overflow-y-auto rounded-xl p-4 sm:max-h-none sm:flex-1 sm:overflow-hidden">
        <div className="w-full shrink-0 sm:@container-size sm:flex sm:min-h-0 sm:flex-1 sm:items-center sm:justify-center">
          <div className="w-full sm:w-[min(100%,56.25cqh)]">
            <PosterPreview
              doa={doa}
              options={options}
              posterRef={posterRef}
              onMaxFontSizeChange={fitFontSize}
            />
          </div>
        </div>
        <PosterBackgrounds options={options} onChange={changeOptions} />
      </div>
      <div className="flex min-w-0 shrink-0 flex-col gap-4 sm:w-60">
        {!isMobile && controls}
        <div className="mt-auto flex gap-2 sm:grid sm:grid-cols-2">
          {isMobile && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  aria-label="Pengaturan poster"
                  title="Pengaturan poster"
                  size="icon"
                  variant="outline"
                >
                  <SlidersHorizontalIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" aria-label="Pengaturan poster">
                {controls}
              </PopoverContent>
            </Popover>
          )}
          {onRollNewDoa && (
            <Button
              aria-label="Ganti doa"
              title={isMobile ? 'Ganti doa' : undefined}
              size={isMobile ? 'icon' : 'default'}
              variant="outline"
              onClick={onRollNewDoa}
              className={cn(!isMobile && 'col-span-2 w-full')}
            >
              <RefreshCwIcon />
              {!isMobile && 'Ganti doa'}
            </Button>
          )}
          {result ? (
            <>
              <Button
                asChild
                variant="outline"
                size={isMobile ? 'icon' : 'default'}
                className={cn(!isMobile && 'flex-1')}
              >
                <a
                  href={result.url}
                  download={result.file.name}
                  aria-label={isMobile ? 'Unduh poster' : undefined}
                  title={isMobile ? 'Unduh poster' : undefined}
                >
                  <DownloadIcon />
                  {!isMobile && 'Unduh'}
                </a>
              </Button>
              <Button
                className="min-w-0 flex-1"
                onClick={() => void exporter.share(result.file, doa.title)}
              >
                <Share2Icon data-icon="inline-start" />
                Bagikan
              </Button>
            </>
          ) : (
            <Button
              className="min-w-0 flex-1 sm:col-span-2 sm:w-full"
              disabled={exporter.isGenerating}
              onClick={() => {
                if (posterRef.current) void exporter.prepare(posterRef.current);
              }}
            >
              <DownloadIcon data-icon="inline-start" />
              {exporter.isGenerating ? 'Membuat poster…' : 'Buat poster'}
            </Button>
          )}
        </div>
      </div>
    </fieldset>
  );
  if (isMobile)
    return (
      <Drawer
        open={isOpen}
        onOpenChange={open => {
          if (!open) onClose();
        }}
      >
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[95dvh]">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-left">Buat poster doa</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex h-[min(95dvh,48rem)] flex-col gap-4 sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Buat poster doa</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
