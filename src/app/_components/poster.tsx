import { toBlob } from 'html-to-image';
import { RefreshCwIcon, Share2Icon, SlidersHorizontalIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';
import { RandomDoa } from '@/hooks/use-random-doa';
import { cn } from '@/lib/utils';

const BACKGROUNDS = Array.from(
  { length: 12 },
  (_, i) => `/bgs/bg-${i + 1}.jpeg`
);

const FONT_SIZE_LABELS = ['Kecil', 'Sedang', 'Besar'] as const;

const FONT_SIZES = [
  {
    title: 'text-xs',
    arabic: 'text-base',
    translation: 'text-[10px]',
    narrator: 'text-[8px]',
  },
  {
    title: 'text-sm',
    arabic: 'text-lg',
    translation: 'text-xs',
    narrator: 'text-[10px]',
  },
  {
    title: 'text-base',
    arabic: 'text-xl',
    translation: 'text-sm',
    narrator: 'text-xs',
  },
] as const;

const POSTER_FILENAME = 'doa-poster.jpg';
const POSTER_MIME_TYPE = 'image/jpeg';

function buildShareText(doa: RandomDoa): string {
  return [doa.title, doa.arabic, doa.translation, doa.narrator]
    .filter(Boolean)
    .join('\n\n');
}

type PosterProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  doa: RandomDoa;
  onRollNewDoa?: () => void;
}>;

export function Poster({ isOpen, onClose, doa, onRollNewDoa }: PosterProps) {
  const { isMobile } = useIsMobile();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [bgIndex, setBgIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const [showTitle, setShowTitle] = useState(true);
  const [showArabic, setShowArabic] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [textOutline, setTextOutline] = useState(false);

  const [fontSizeLevel, setFontSizeLevel] = useState([1]);
  const [overlayOpacity, setOverlayOpacity] = useState([60]);

  const handleShare = async () => {
    if (!posterRef.current) return;

    setIsGenerating(true);
    try {
      // Ensure the active background image is fully decoded before capture.
      const img = posterRef.current.querySelector('img');
      if (img && !img.complete) {
        await img.decode().catch(() => {});
      }

      const opts = {
        type: POSTER_MIME_TYPE,
        quality: 0.92,
        pixelRatio: 4,
      } as const;

      // html-to-image has a known first-render issue where external resources
      // (images, fonts) are not yet in its internal cache on the first call,
      // resulting in blank/missing backgrounds. A warmup pass primes the cache.
      await toBlob(posterRef.current, opts);
      const blob = await toBlob(posterRef.current, opts);

      if (!blob) throw new Error('Failed to generate image');

      const file = new File([blob], POSTER_FILENAME, {
        type: POSTER_MIME_TYPE,
      });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: doa.title,
          text: buildShareText(doa),
        });
      } else {
        const url = URL.createObjectURL(blob);
        try {
          const a = document.createElement('a');
          a.href = url;
          a.download = POSTER_FILENAME;
          a.click();
        } finally {
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('Failed to share image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const sizes = FONT_SIZES[fontSizeLevel[0]] ?? FONT_SIZES[1];

  const toggles = [
    {
      id: 'showTitle',
      label: 'Judul',
      checked: showTitle,
      onChange: setShowTitle,
    },
    {
      id: 'showArabic',
      label: 'Teks Arab',
      checked: showArabic,
      onChange: setShowArabic,
    },
    {
      id: 'showTranslation',
      label: 'Terjemahan',
      checked: showTranslation,
      onChange: setShowTranslation,
    },
    {
      id: 'textOutline',
      label: 'Garis Tepi Teks',
      checked: textOutline,
      onChange: setTextOutline,
    },
  ];

  const sliders = [
    {
      id: 'fontSize',
      label: 'Ukuran Teks',
      value: fontSizeLevel,
      onChange: setFontSizeLevel,
      min: 0,
      max: 2,
      step: 1,
      displayValue: FONT_SIZE_LABELS[fontSizeLevel[0]] ?? FONT_SIZE_LABELS[1],
    },
    {
      id: 'overlayOpacity',
      label: 'Latar Teks',
      value: overlayOpacity,
      onChange: setOverlayOpacity,
      min: 0,
      max: 100,
      step: 1,
      displayValue: `${overlayOpacity[0]}%`,
    },
  ];

  const settingsContent = (
    <div className="flex flex-col gap-6">
      {/* Text Toggles */}
      <div className="flex flex-col gap-4">
        {toggles.map(option => (
          <div
            key={option.id}
            className="flex items-center justify-between gap-4"
          >
            <Label htmlFor={option.id}>{option.label}</Label>
            <Switch
              id={option.id}
              checked={option.checked}
              onCheckedChange={val => option.onChange(val === true)}
            />
          </div>
        ))}
      </div>

      {/* Visual Adjustments */}
      <div className="flex flex-col gap-4">
        {sliders.map(option => (
          <div key={option.id} className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              <Label htmlFor={option.id}>{option.label}</Label>
              <span className="text-xs">{option.displayValue}</span>
            </div>
            <Slider
              id={option.id}
              value={option.value}
              onValueChange={option.onChange}
              min={option.min}
              max={option.max}
              step={option.step}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const modalContent = (
    <div className={cn('flex flex-col gap-4 sm:flex-row', isMobile && 'p-4')}>
      {/* Unified Preview Container Group */}
      <div className="bg-input/90 relative flex max-h-[calc(100dvh-268px)] w-full flex-col items-center gap-4 overflow-y-auto rounded-xl p-4 sm:max-h-[calc(100dvh-120px)] sm:w-fit sm:flex-1">
        {/* Preview Image */}
        <div className="w-full">
          <AspectRatio
            ratio={9 / 16}
            className="shrink-0 overflow-hidden rounded-xl"
          >
            <div ref={posterRef} className="absolute inset-0">
              <Image
                src={BACKGROUNDS[bgIndex]}
                alt="Background"
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover"
              />

              <div className="relative flex h-full w-full flex-col p-4 text-black">
                <div
                  className="my-auto flex flex-col gap-8 rounded-xl p-4"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${overlayOpacity[0] / 100})`,
                  }}
                >
                  {showTitle && (
                    <h2
                      className={cn(
                        'font-semibold',
                        sizes.title,
                        textOutline && 'text-outline'
                      )}
                    >
                      {doa.title}
                    </h2>
                  )}
                  <div className="flex flex-col gap-4">
                    {showArabic && (
                      <p
                        className={cn(
                          'font-arabic text-right leading-loose',
                          sizes.arabic,
                          textOutline && 'text-outline'
                        )}
                        dir="rtl"
                      >
                        {doa.arabic}
                      </p>
                    )}
                    {showTranslation && (
                      <p
                        className={cn(
                          'font-medium',
                          sizes.translation,
                          textOutline && 'text-outline'
                        )}
                      >
                        {doa.translation}
                      </p>
                    )}
                    {doa.narrator && (
                      <p
                        className={cn(
                          'font-medium',
                          sizes.narrator,
                          textOutline && 'text-outline'
                        )}
                      >
                        {doa.narrator}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-outline mt-auto flex items-end justify-end text-[8px] font-medium">
                  muslim.vercel.app
                </p>
              </div>
            </div>
          </AspectRatio>
        </div>

        {/* Background Selector */}
        <div className="w-full">
          <Carousel
            orientation="horizontal"
            setApi={setCarouselApi}
            opts={{
              align: 'center',
              dragFree: true,
            }}
          >
            <CarouselContent className="-ms-2 px-1">
              {BACKGROUNDS.map((bg, idx) => (
                <CarouselItem key={bg} className="basis-auto ps-2">
                  <Button
                    variant="ghost"
                    aria-label={`Pilih latar belakang ${idx + 1}`}
                    onClick={() => {
                      setBgIndex(idx);
                      carouselApi?.scrollTo(idx);
                    }}
                    className={cn(
                      'relative block h-auto w-12 cursor-pointer overflow-hidden rounded-lg border-2 p-0 transition-all hover:bg-transparent',
                      bgIndex === idx
                        ? 'border-primary'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    )}
                  >
                    <AspectRatio ratio={9 / 16} className="h-full w-full">
                      <Image
                        src={bg}
                        alt="bg"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </AspectRatio>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-4 sm:min-w-60">
        {!isMobile && settingsContent}

        {/* Actions */}
        <div className="mt-auto flex flex-col items-center gap-2 sm:flex-row">
          {(onRollNewDoa || isMobile) && (
            <div className="flex w-full items-center gap-2 sm:flex-1">
              {onRollNewDoa && (
                <Button
                  aria-label="Ganti doa"
                  variant="outline"
                  onClick={onRollNewDoa}
                  className="flex-1"
                >
                  <RefreshCwIcon /> Ganti Doa
                </Button>
              )}

              {isMobile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Pengaturan poster"
                      variant="outline"
                      className="flex-1"
                    >
                      <SlidersHorizontalIcon /> Pengaturan
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-4">
                    {settingsContent}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          <Button
            onClick={handleShare}
            className="w-full sm:w-auto sm:flex-1"
            disabled={isGenerating}
          >
            <Share2Icon />
            {isGenerating ? 'Memproses...' : 'Bagikan'}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[95dvh]">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-left">Buat Poster Doa</DrawerTitle>
          </DrawerHeader>
          {modalContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[95dvh] flex-col sm:max-w-2xl">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>Buat Poster Doa</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
